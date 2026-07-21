#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(process.argv[2] || path.join(projectRoot, "github-pages"));
const workerPath = path.join(projectRoot, "dist/server/index.js");
const clientPath = path.join(projectRoot, "dist/client");
const entriesPath = path.join(projectRoot, "data/wordpress-content.json");

const fixedRoutes = [
  "/",
  "/research/",
  "/group/",
  "/papers/",
  "/publications/",
  "/talks/",
  "/news/",
  "/battle-of-the-big-bang/",
  "/updates/",
  "/cv/",
  "/archive/",
  "/2026/07/21/do-quantum-black-holes-have-just-enough-hair/",
  "/2026/07/14/cleaning-the-cmb-backlight/",
  "/welcome/original-home/",
];

function staticHtml(html) {
  return html
    .replace(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>\s*/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/\sdata-rsc-css-href=["'][^"']*["']/gi, "")
    .replace(/\sdata-precedence=["'][^"']*["']/gi, "");
}

function outputFileForRoute(route) {
  const pathname = new URL(route, "https://nafshordi.github.io").pathname;
  const decoded = pathname
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join("/");
  const relative = decoded === "/" ? "" : decoded.replace(/^\/+|\/+$/g, "");
  if (relative.split("/").includes("..")) {
    throw new Error(`Unsafe route: ${route}`);
  }
  return path.join(outputRoot, relative, "index.html");
}

const entries = JSON.parse(await readFile(entriesPath, "utf8"));
const routes = [...new Set([...fixedRoutes, ...entries.map((entry) => entry.path)])];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(clientPath, outputRoot, {
  recursive: true,
  filter(source) {
    const relative = path.relative(clientPath, source);
    if (!relative) return true;
    if (relative === "_headers" || relative === ".assetsignore") return false;
    if (relative === ".vite" || relative.startsWith(`.vite${path.sep}`)) return false;
    if (relative.endsWith(".js")) return false;
    return true;
  },
});

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("github-pages-export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

for (const route of routes) {
  const requestRoute = route === "/" ? route : route.replace(/\/+$/, "");
  const response = await worker.fetch(
    new Request(new URL(requestRoute, "https://nafshordi.github.io"), {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  if (response.status !== 200) {
    throw new Error(`Export failed for ${route}: HTTP ${response.status}`);
  }
  const filePath = outputFileForRoute(route);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, staticHtml(await response.text()), "utf8");
}

const stylesheet = (await readdir(path.join(outputRoot, "assets"))).find((name) =>
  /^index-.+\.css$/.test(name),
);
if (!stylesheet) throw new Error("Exported stylesheet was not found");

const notFound = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found | Niayesh Afshordi</title><link rel="stylesheet" href="/assets/${stylesheet}"></head>
<body><main class="content-page"><h1>Page not found</h1><p>The requested page is not in the archive.</p><p><a class="button" href="/">Return home</a></p></main></body></html>`;
await writeFile(path.join(outputRoot, "404.html"), notFound, "utf8");
await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");
await writeFile(path.join(outputRoot, "CNAME"), "nafshordi.com\n", "utf8");

console.log(JSON.stringify({ output: outputRoot, routes: routes.length }, null, 2));
