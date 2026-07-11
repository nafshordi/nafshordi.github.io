#!/usr/bin/env node

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(process.argv[2] || path.join(projectRoot, "github-pages"));
const entries = JSON.parse(await readFile(path.join(projectRoot, "data/wordpress-content.json"), "utf8"));
const audit = JSON.parse(await readFile(path.join(projectRoot, "data/migration-audit/wordpress-external-links-2026-07-10.json"), "utf8"));

const htmlCache = new Map();
const intentionallyReplacedLegacyUrls = new Set([
  "https://www.facebook.com/sabine.hossenfelder/posts/10156438692514574?comment_id=10156439172764574&reply_comment_id=10156442581219574¬if_id=1522146692570693¬if_t=mentions_comment&ref=notif",
]);

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'");
}

function routeForEntry(entryPath) {
  return entryPath === "/" ? "/welcome/original-home/" : entryPath;
}

function fileForRoute(route) {
  const pathname = decodeURIComponent(new URL(route, "https://nafshordi.github.io").pathname);
  const relative = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");
  return path.join(outputRoot, relative, "index.html");
}

async function htmlForRoute(route) {
  if (!htmlCache.has(route)) htmlCache.set(route, await readFile(fileForRoute(route), "utf8"));
  return htmlCache.get(route);
}

function attributeTargets(html) {
  return [...html.matchAll(/\b(?:href|src)=(['"])(.*?)\1/gi)].map((match) => decodeEntities(match[2]));
}

function canonicalExternalUrl(value) {
  const repaired = value.replaceAll("¬if_", "&notif_");
  try {
    const url = new URL(repaired);
    url.hash = "";
    return url.href;
  } catch {
    return repaired;
  }
}

const missingRoutes = [];
for (const entry of entries) {
  try {
    await access(fileForRoute(routeForEntry(entry.path)));
  } catch {
    missingRoutes.push(routeForEntry(entry.path));
  }
}
assert.deepEqual(missingRoutes, [], `Missing imported routes: ${missingRoutes.join(", ")}`);

const missingExternalLinks = [];
for (const link of audit.links) {
  if (link.state === "dead") continue;
  if (intentionallyReplacedLegacyUrls.has(link.url)) continue;
  for (const occurrence of link.occurrences) {
    const route = routeForEntry(occurrence.path);
    const targets = attributeTargets(await htmlForRoute(route)).map(canonicalExternalUrl);
    if (!targets.includes(canonicalExternalUrl(link.url))) missingExternalLinks.push({ route, url: link.url });
  }
}
assert.deepEqual(
  missingExternalLinks,
  [],
  `Active or unverifiable legacy links missing from static pages: ${JSON.stringify(missingExternalLinks, null, 2)}`,
);

const brokenLocalTargets = [];
for (const entry of entries) {
  const route = routeForEntry(entry.path);
  const targets = attributeTargets(await htmlForRoute(route));
  for (const target of targets) {
    if (!target || target.startsWith("#") || target.startsWith("mailto:") || target.startsWith("tel:")) continue;
    const url = new URL(target, "https://nafshordi.github.io");
    if (url.origin !== "https://nafshordi.github.io") continue;
    const decodedPath = decodeURIComponent(url.pathname);
    const relative = decodedPath.replace(/^\/+/, "");
    const candidate = path.extname(decodedPath)
      ? path.join(outputRoot, relative)
      : fileForRoute(decodedPath);
    try {
      await access(candidate);
    } catch {
      brokenLocalTargets.push({ route, target });
    }
  }
}
assert.deepEqual(
  brokenLocalTargets,
  [],
  `Broken local links or media in imported content: ${JSON.stringify(brokenLocalTargets, null, 2)}`,
);

console.log(JSON.stringify({
  imported_routes: entries.length,
  preserved_non_dead_external_links: audit.links.filter((link) => link.state !== "dead").length,
  checked_static_pages: htmlCache.size,
  broken_local_targets: 0,
}, null, 2));
