export const writingPosts = [
  {
    title: "Do Quantum Black Holes Have Just Enough Hair?",
    slug: "do-quantum-black-holes-have-just-enough-hair",
    path: "/2026/07/21/do-quantum-black-holes-have-just-enough-hair/",
    type: "post" as const,
    date: "2026-07-21",
    html: `<article class="writing-post">
<p class="writing-dek">Black holes are supposed to be simple. Quantum gravity begs to differ!</p>

<figure class="writing-lead-image">
  <img src="/images/writing/quantum-black-hole-entropy-echoes.png" alt="Conceptual illustration of a slightly deformed black hole with faint gravitational-wave echoes" loading="eager" decoding="async" />
  <figcaption><strong>Just enough structure to leave a trace?</strong> A conceptual illustration of a nearly classical black hole whose horizon-scale physics could alter its exterior geometry or produce faint gravitational-wave echoes. The image is illustrative, not observational data.</figcaption>
</figure>

<p>One of the most famous claims about black holes is that they have no hair.</p>
<p>This does not mean that black holes are featureless in every possible sense. It means something more precise and more astonishing: in classical general relativity, an isolated, settled black hole is described by only a few numbers. Its mass tells us how heavy it is. Its spin tells us how fast it rotates. Its electric charge is usually irrelevant for astrophysical black holes. Once those numbers are fixed, everything else is supposed to follow.</p>
<p>In the simplest version of this story, two black holes with the same mass and spin are not merely similar. They are the same object, at least from the outside. The messy history that formed them -- collapsing stars, accretion disks, mergers, magnetic fields, turbulence, and all the violent astrophysics of their birth -- is hidden behind the horizon.</p>
<p>That is why the no-hair theorem is so powerful. It turns black holes into clean laboratories. It is also why any controlled way of violating it is interesting.</p>
<p>If real black holes differ from the Kerr solution of general relativity, the difference cannot be arbitrary. A useful theory has to say not only that there may be deviations, but how large they should be and where observations should look. A deviation that is too small is invisible. A deviation that is too large is already ruled out or physically implausible. The most valuable clue is one that lands in the uncomfortable middle: small enough to have survived, large enough to be testable.</p>
<p>Our recently published paper, <a href="https://doi.org/10.1088/1361-6382/ae7793" target="_blank" rel="noreferrer">Self-regularized entropy: What does black hole entropy predict for tests of Kerr no-hair theorem?</a>, written with Shokoufe Faraji, asks whether black-hole entropy can provide such a clue.</p>

<figure class="writing-collaborator">
  <img src="/images/shokoufe-faraji.png" alt="Shokoufe Faraji" loading="lazy" decoding="async" />
  <figcaption><strong><a href="https://perimeterinstitute.ca/people/shokoufe-faraji" target="_blank" rel="noreferrer">Shokoufe Faraji ↗</a></strong><span>Postdoctoral researcher at Perimeter Institute and the University of Waterloo, working on strong gravity, quantum gravity, and accretion around black holes. Shokoufe is the lead author of the new study.</span></figcaption>
</figure>

<h2 id="from-entropy-to-echoes-and-back">From entropy to echoes, and back</h2>
<p>For our group, this question is part of a longer attempt to connect the quantum physics of horizons to observations.</p>
<p>More than a decade ago, in <a href="https://arxiv.org/abs/1212.4176" target="_blank" rel="noreferrer">Empty Black Holes, Firewalls, and the Origin of Bekenstein-Hawking Entropy</a>, Mehdi Saravani, Robert Mann, and I explored a model in which spacetime ends at a microscopic distance from the classical horizon. A surface fluid at this boundary reproduced the Bekenstein-Hawking area law using local thermodynamics. The details of that proposal were deliberately speculative, but the guiding question has endured: could the same microscopic structure that accounts for black-hole entropy also change what an observer sees from the outside?</p>
<p>Gravitational-wave astronomy turned that conceptual question into an experimental one. If the region near the horizon is not perfectly absorbing, radiation left after a merger can become trapped between the angular-momentum barrier and the compact object's surface, leaking out in a sequence of delayed echoes. In 2016, Jahed Abedi, Hannah Dykaar, and I reported <a href="https://arxiv.org/abs/1612.00266" target="_blank" rel="noreferrer">tentative evidence for such echoes</a> in the first LIGO black-hole merger data. The significance was modest, the templates were simplified, and the claim generated a healthy controversy. As I wrote in <a href="https://nafshordi.com/2018/04/02/echoes-strike-back/" target="_blank" rel="noreferrer">Echoes Strike Back!</a>, only more data and better predictions could settle whether the apparent signals were new physics, noise, or a systematic effect. That remains the right standard: echoes have not been established observationally.</p>
<p>The controversy sharpened the theory. With Qingwen Wang, I developed <a href="https://arxiv.org/abs/1803.02845" target="_blank" rel="noreferrer">an observer's manual for black-hole echoes</a>, showing how their shape, decay, and stability depend on the near-horizon boundary. With Naritaka Oshita and Qingwen, we later derived a frequency-dependent <a href="https://arxiv.org/abs/1905.00464" target="_blank" rel="noreferrer">Boltzmann reflectivity</a> from detailed balance and the fluctuation-dissipation theorem, replacing a perfectly reflecting wall with a thermodynamically motivated response. More recently, Conner Dailey, Erik Schnetter, and I formulated a <a href="https://arxiv.org/abs/2409.17970" target="_blank" rel="noreferrer">complete initial-boundary-value framework</a> for evolving such boundaries in numerical relativity, a step toward waveforms that can be compared consistently with merger data.</p>
<p>Entropy and echoes met directly in our 2023 paper <a href="https://arxiv.org/abs/2302.08964" target="_blank" rel="noreferrer">From Entropy to Echoes</a>, where Naritaka and I related the counting of black-hole modes to an echo timescale. The new work with Shokoufe follows the arrow in the other direction. Rather than starting with a hypothetical surface and asking what echoes it would produce, we start with the entropy and ask what departure from the classical geometry it may require. The possible observable is then not only a delayed echo, but a broader violation of the Kerr no-hair relations.</p>
<p>The paper is technical, but the motivation is simple. Black holes carry entropy. In the standard Bekenstein-Hawking formula, that entropy is proportional to the area of the horizon. This is one of the deepest results in gravitational physics. It suggests that the microscopic information associated with a black hole is not stored in its volume, as one might naively expect, but scales like the surface that bounds it.</p>
<p>That idea has shaped quantum gravity for half a century. It is also a source of trouble.</p>
<p>If one tries to count ordinary quantum-field modes near a classical black-hole horizon, the number of available states grows too fast. In the old "brick wall" calculation, one has to place an artificial cutoff just outside the horizon to prevent the entropy from diverging. The cutoff works as a regulator, but it is put in by hand. It says, in effect: do not trust the calculation closer than this distance.</p>
<p>That may be a practical fix, but it is not a physical explanation.</p>
<p>The question we asked is whether a small deformation of the black-hole exterior could regulate the calculation by itself.</p>
<p>In the paper, the exterior geometry is modeled using a static deformation of the Schwarzschild solution called the q-metric, also known as the Zipoy-Voorhees metric. This is not presented as the final theory of quantum black holes. It is a controlled phenomenological model: a way to ask what happens when the near-horizon region is slightly distorted by a quadrupolar parameter.</p>
<p>The result is striking. Within the perturbative regime studied, the deformation changes the near-horizon density of states in such a way that the usual brick-wall ultraviolet divergence is self-regularized. The entropy calculation no longer needs an arbitrary proper-distance cutoff. The geometry itself supplies the regularization.</p>
<p>That is the first lesson:</p>
<blockquote>
<p>A black hole whose near-horizon geometry is slightly deformed may avoid the entropy divergence that appears in the classical Schwarzschild calculation.</p>
</blockquote>
<p>The second lesson is what makes the result observationally interesting.</p>
<p>If we require the regulated entropy to match the usual Bekenstein-Hawking entropy of a Schwarzschild black hole of the same mass, the calculation points to a characteristic deformation scale. In the model, the natural size is roughly <em>|q|</em> ≈ 0.2, and it remains of that order from stellar-mass to supermassive black holes.</p>
<p>This number should not be oversold. It is not a detection. It is not a claim that nature has already chosen this value. It comes from a simplified exterior model and a particular entropy-matching argument.</p>
<p>But it is not arbitrary either. It is a physical target emerging from the demand that the entropy behave properly.</p>
<p>The next step is to translate that target into something observers could actually test. Real astrophysical black holes rotate, so the paper uses a stationary extension to map the deformation scale into possible violations of the Kerr multipole relations. In the Kerr solution, all the higher multipole moments are fixed by the mass and spin. If those relations fail, the black hole has "hair" in the precise observational sense: extra structure not captured by the classical Kerr description.</p>
<p>The mapped effects can land at the percent-to-tens-of-percent level. That is exactly the range that makes the question worth asking now. It is not obviously hopeless, and it is not already settled.</p>
<p>This is where several future observational programs enter the story.</p>
<p>The next-generation Event Horizon Telescope, or ngEHT, aims to sharpen horizon-scale images of supermassive black holes. LISA, the planned space-based gravitational-wave observatory, should be especially sensitive to extreme mass-ratio inspirals, where a small compact object traces the spacetime around a massive black hole over many orbits. Third-generation ground-based gravitational-wave detectors will measure black-hole mergers with far greater precision than today's instruments.</p>
<p>These experiments are very different. One images hot plasma near horizons. One listens to long, delicate gravitational-wave tracks in space. One measures violent mergers from the ground. But they share a common goal: they can test whether astrophysical black holes are exactly Kerr.</p>
<p>That is why black-hole entropy matters beyond thermodynamics. It may help tell us what kind of imperfection to search for.</p>
<p>There is a familiar pattern in fundamental physics. A beautiful theory makes an elegant prediction. Experiments confirm it again and again. Then progress depends on asking where the elegance might fail without abandoning the discipline that made the theory powerful in the first place.</p>
<p>The no-hair theorem is beautiful. Kerr black holes are beautiful. The Bekenstein-Hawking entropy is beautiful. But when these ideas are placed together with quantum fields near a horizon, the calculation asks for something more than beauty. It asks for a regulator. Perhaps that regulator is not a wall inserted by hand, but a hint that the horizon is not quite the featureless surface of the classical story.</p>
<p>If so, black holes may not need much hair.</p>
<p>They may need just enough for their entropy to make sense.</p>
<p>And just enough, if we are fortunate, for the next generation of observations to see.</p>
<aside class="writing-links" aria-label="Related links">
  <h2>Related links</h2>
    <ul>
      <li><a href="https://doi.org/10.1088/1361-6382/ae7793" target="_blank" rel="noreferrer">Published paper: Self-regularized entropy and tests of Kerr no-hair ↗</a></li>
      <li><a href="/2018/04/02/echoes-strike-back/">Earlier writing: Echoes Strike Back!</a></li>
      <li><a href="https://arxiv.org/abs/2302.08964" target="_blank" rel="noreferrer">Paper: From Entropy to Echoes ↗</a></li>
      <li><a href="https://arxiv.org/abs/2409.17970" target="_blank" rel="noreferrer">Paper: Modelling black-hole echoes in numerical relativity ↗</a></li>
      <li><a href="/research#quantum-black-holes">Research area: Quantum black holes &amp; horizon physics</a></li>
      <li><a href="/research#gravitational-waves">Research area: Gravitational-wave astronomy &amp; black-hole spectroscopy</a></li>
  </ul>
</aside>
</article>`,
  },
  {
    title: "Cleaning the CMB Backlight",
    slug: "cleaning-the-cmb-backlight",
    path: "/2026/07/14/cleaning-the-cmb-backlight/",
    type: "post" as const,
    date: "2026-07-14",
    html: `<article class="writing-post">
<p class="writing-dek">The hidden gas between galaxies is hard to see. It is even harder to clean.</p>

<p>Most of the ordinary matter in the universe is not in stars, planets, or the cold gas that lights up galaxies. Cosmology tells us how much ordinary matter, or baryonic matter, should have been made in the early universe. But when we count what is easily visible today, a large fraction is hard to find.</p>

<p>This is not because the matter is exotic. It is probably mostly ordinary gas. The difficulty is that much of it is spread thinly through and around galaxies, groups, clusters, and the cosmic web. It can be hot enough to matter dynamically, but too diffuse to shine brightly. So one of the persistent questions in observational cosmology is deceptively simple:</p>

<blockquote>Where is the hot gas?</blockquote>

<p>One of the best ways to look for it is not to look for the gas shining by itself, but to look for how it changes the oldest light in the universe.</p>

<p>The cosmic microwave background, or CMB, reaches us from the early universe after travelling for almost 14 billion years. Along the way, some of its photons pass through hot ionized gas. When they scatter off energetic electrons, their spectrum is shifted in a characteristic way. This is the thermal Sunyaev-Zel'dovich effect, usually abbreviated as tSZ. In simple terms, the CMB becomes a backlight, and hot electrons leave a shadow-like spectral fingerprint on it.</p>

<p>For massive galaxy clusters, this method is now a standard tool. Clusters contain dense reservoirs of hot plasma, and their tSZ signal can be strong. The harder, and in many ways more interesting, regime is lower-mass galaxies and groups. That is where the gas is fainter, more extended, more affected by feedback, and more easily confused with everything else in the microwave sky.</p>

<p>Our new paper, <a href="https://arxiv.org/abs/2606.28099" target="_blank" rel="noreferrer"><em>Thermal Sunyaev-Zel'dovich cross-correlations with unWISE galaxies: disentangling radio contamination, dust properties, and electron pressure</em> ↗</a>, is about this hard regime. The work was led by Guandi Zhao, with Alex Krolewski and me. Guandi carried out the demanding multi-frequency analysis that made it possible to distinguish the overlapping signals. Alex's expertise with the unWISE galaxy samples and their connection to dark matter haloes was essential for turning the cleaned maps into a physical measurement of gas around galaxies.</p>

<p>The method is to cross-correlate maps of the microwave sky with maps of galaxies. A single low-mass halo is too faint to see cleanly in tSZ. But if we know where many galaxies are, we can ask whether the CMB has a statistically consistent tSZ imprint at those positions. The galaxy catalogue we use is based on unWISE, which gives wide-area infrared-selected galaxy samples. The microwave maps come from Planck and the Atacama Cosmology Telescope, ACT. Planck gives broad frequency coverage. ACT gives high angular resolution. Together they are a powerful pair.</p>

<p>But the main lesson of the paper is that the hard part is not only measuring a weak signal. The hard part is knowing what else is being measured at the same time.</p>

<p>At the relevant frequencies, the microwave sky contains more than tSZ. Dusty star-forming galaxies contribute to the cosmic infrared background. Radio emission from galaxies can also correlate with the same structures we are using as tracers. These foregrounds are not just random noise. They can be spatially correlated with the galaxies whose hot gas we are trying to measure. If we ignore them, we do not simply get a noisier answer. We can get the wrong answer.</p>

<p>In fact, without explicitly modelling radio contamination, the recovered galaxy-tSZ cross-correlation can look suppressed, or even become apparently negative on small angular scales. A negative pressure signal is not the physical interpretation one wants for hot gas around galaxies. It is a warning sign that the cleaning procedure is absorbing, mixing, or misassigning components.</p>

<p>The central result of the paper is that the data prefer a three-component model: tSZ, radio emission, and a cosmic-infrared-background amplitude term. Using the nine Planck frequency bands, this radio-inclusive model is strongly preferred over a model that omits radio contamination. Once that lesson from Planck is carried into the higher-resolution ACT plus Planck maps, the apparent negative small-scale galaxy-tSZ signal disappears. The cleaned spectra remain positive to small angular scales and can be interpreted with a conventional halo model and an electron-pressure profile.</p>

<figure class="writing-money-plot">
  <img src="/images/writing/act-planck-unwise-component-separation-low-z.png" alt="Four-panel comparison of low-redshift unWISE cross-correlations with ACT and Planck component-separated maps" loading="lazy" decoding="async" />
  <figcaption><strong>The foreground model changes the physical answer.</strong> The key comparison is in the upper-left panel. The orange curve, which models tSZ, radio emission, and infrared-background amplitude together, remains positive on small angular scales. The purple and blue curves, which do not adequately account for the radio contribution, turn negative beyond roughly multipole 2,000. The other panels track the radio and infrared components that have to be separated from the hot-gas signal. Figure from Zhao, Krolewski &amp; Afshordi (2026).</figcaption>
</figure>

<p>So the story is not simply "we found hot gas." It is more precise, and more useful:</p>

<blockquote>To infer the hot gas around low-redshift galaxies from CMB cross-correlations, radio contamination is not a minor nuisance. It is part of the measurement.</blockquote>

<p>That may sound technical, but it is actually a general lesson about cosmology. The universe does not hand us labelled maps. We observe a sky in which many physical processes overlap: primordial fluctuations, dust, radio sources, gravitational lensing, hot gas, instrumental noise, and survey selection effects. A measurement is only as meaningful as the model that separates these ingredients.</p>

<p>This problem has been in the background of my work for a long time. The <a href="/welcome/research/missing-baryons-of-the-universe/">missing-baryons page</a> on this site says the basic thing plainly: warm and hot gas between galaxies contains much of the thermal energy and baryonic content of the universe, and one way to understand it is through its impact on the CMB via the Sunyaev-Zel'dovich effect.</p>

<h2>An unfinished beginning</h2>

<p>In 2018, Natacha Altamirano led an analysis with Chiamaka Okoli and me using Planck maps and a catalogue of locally brightest galaxies. Our unfinished manuscript had the title <em>Mystery of Missing Energy in Circumgalactic Media: Dust Contamination or Cooling Flows?</em> We were trying to understand a puzzling result: around lower-mass galaxies, the inferred tSZ signal became negative. Natacha pursued the signal through different masks, frequency maps, galaxy colours, pressure templates, and dust-cleaning tests. The negative feature was remarkably difficult to remove.</p>

<p>We never finished that paper. Chiamaka became ill, and Natacha eventually left Waterloo and moved on to other work. Scientific projects are usually described through the papers that reach publication, but that record is incomplete. Some ideas survive in drafts, calculations, and questions that remain open after the collaboration that first asked them can no longer continue.</p>

<p>Chiamaka was part of the beginning of this story. Her curiosity about the hidden structure of dark matter haloes naturally extended to the ordinary matter surrounding galaxies: matter that should be there, but whose observational signature was faint and ambiguous. I wish she could have seen where that question eventually led. Remembering her in this paper is not simply ceremonial. Her name belongs to the history of the problem.</p>

<p>The old draft did not contain the answer found in the new paper. It concentrated largely on dust, the distinction between red and blue galaxies, and the possibility that the negative signal reflected unusual gas physics or cooling. But it established the puzzle with unusual persistence: why did an apparently unphysical negative tSZ signal remain after so many checks?</p>

<p>Years later, Guandi returned to this class of measurement with different galaxy samples, newer Planck and ACT data, and a much more direct treatment of the microwave frequency information. His analysis showed that dust was only part of the foreground problem. Radio emission correlated with the galaxies had to be modelled explicitly. Alex helped connect that component-separated measurement to the unWISE galaxy population and to a conventional halo and electron-pressure model. Once the radio component was included, the negative signal disappeared.</p>

<p>This is why the credit in the new paper matters. Natacha and Chiamaka helped formulate the original puzzle. Guandi and Alex supplied the new data, analysis, and physical framework that resolved it. The new result is not simply the completion of the 2018 draft; it is a stronger and more modern answer to the question that draft left behind.</p>

<div class="writing-portraits" role="group" aria-label="Researchers behind the new result and its early history">
  <figure>
    <img src="/images/online/guandi-zhao.png" alt="Guandi Zhao" loading="lazy" decoding="async" />
    <figcaption><strong>Guandi Zhao</strong><span>Led the new multi-frequency analysis.</span></figcaption>
  </figure>
  <figure>
    <img src="/images/online/alex-krolewski.jpg" alt="Alex Krolewski" loading="lazy" decoding="async" />
    <figcaption><strong>Alex Krolewski</strong><span>Connected the unWISE samples to the halo interpretation.</span></figcaption>
  </figure>
  <figure>
    <img src="/media/2018/07/img_3950-e1531213584786.jpg" alt="Natacha Altamirano" loading="lazy" decoding="async" />
    <figcaption><strong>Natacha Altamirano</strong><span>Led the original investigation of the negative signal.</span></figcaption>
  </figure>
  <figure>
    <img src="/media/2015/07/26d8193-e1440385821548.jpg" alt="Chiamaka Okoli" loading="lazy" decoding="async" />
    <figcaption><strong>Chiamaka Okoli</strong><span>Early collaborator, remembered.</span></figcaption>
  </figure>
</div>

<h2>Learning to hear the signal</h2>

<p>There is a temptation, especially in public descriptions of cosmology, to present observations as if they are photographs of invisible things. But much of modern cosmology is closer to listening through a wall in a crowded room. The universe is speaking, but many voices arrive at once. The job is not only to hear a whisper. It is to know which other voices are harmonizing with it, which are mimicking it, and which are cancelling it in the analysis.</p>

<p>The hot gas around galaxies is faint. The radio emission is not the thing we are after, but it is not optional. The dust is not the target either, but it shapes the answer. The CMB is the backlight, but the shadow only becomes meaningful after we understand what else is projected onto the screen.</p>

<p>That is why I find this paper satisfying. It does not claim a dramatic overturning of cosmology. It does something quieter and, in the long run, more important: it clarifies the conditions under which a difficult measurement can be trusted.</p>

<p>If the result holds up across related catalogues, maps, and cleaning methods, it will help make CMB-galaxy cross-correlations a sharper tool for studying baryonic feedback, circumgalactic gas, and the missing-baryon problem. It also gives a warning for future high-resolution microwave surveys: more sensitivity is not enough. Better component separation, better foreground modelling, and better physical cross-checks will matter just as much.</p>

<p class="writing-closing">The missing baryons are not simply hiding in the dark. They are hiding behind other light.</p>

<p>And sometimes the first step to seeing them is admitting that the foreground is part of the story.</p>

<aside class="writing-links" aria-label="Related links">
  <h2>Related links</h2>
  <ul>
    <li><a href="https://arxiv.org/abs/2606.28099" target="_blank" rel="noreferrer">New paper: Thermal Sunyaev-Zel'dovich cross-correlations with unWISE galaxies ↗</a></li>
    <li><a href="/welcome/research/missing-baryons-of-the-universe/">Background: Missing Baryons of the Universe</a></li>
    <li><a href="/2019/06/18/farewell-to-dr-chiamaka-okoli/">Remembering Chiamaka: Farewell to Dr Chiamaka Okoli</a></li>
  </ul>
</aside>
</article>`,
  },
];
