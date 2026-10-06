# Blugene: corn to indigo

22-second silent scientific concept animation, 3840 × 2160, 30 fps, H.264 MP4.

The 16 kernel symbols represent plant-derived carbon sites. They are assembled into a trans-indigo graph using the atom layout of the supplied illustration. The supplied illustration had a misplaced double bond on the left benzene ring; the final animation corrects that ring to an alternating Kekule representation with valid carbon valences. Nitrogen and oxygen are drawn separately. This is an illustration of carbon origin, not a depiction of a chemical reaction mechanism, stoichiometric conversion, or the sequence of a biosynthetic pathway.

## Timing

- 0.0–2.4 s: maize source and title.
- 2.4–13.1 s: 16 kernels depart one at a time, travel along curved paths, and settle into their carbon sites. Bonds are drawn after their endpoints arrive.
- 13.1–16.3 s: complete graph, removal of maize source, and reframing.
- 16.3–22.0 s: completed indigo structure held for reading.

The diagram contains 16 C, 2 N, 2 O, and the 2 explicit N–H labels. The 8 aromatic hydrogens are implicit, consistent with C16H10N2O2. Its graph has 23 edges, of which 9 are double bonds.

Formula reference: [PubChem, Indigo, CID 10215](https://pubchem.ncbi.nlm.nih.gov/compound/10215). The displayed graph is the familiar neutral keto form. Validation in `verify.cjs` checks valences and the implied hydrogen count, and decodes selected frames from the finished MP4.

## Source files

- `scene.js` contains the fixed atom coordinates, bond orders, timings, easing, type, and draw functions.
- `render.cjs` uses a local Chromium browser's Canvas and WebCodecs APIs, and packages the H.264 samples into MP4.
- `index.html` loads the scene for deterministic rendering.
- `image_inputs/refined.jpg` is the supplied refined image, used for kernel appearance.
- `image_inputs/corn.png` is an AI-generated maize illustration used as a visual asset.

The renderer expects `image_inputs` next to `animation` and creates `outputs` at the same level. The Chrome executable and Playwright module paths in `render.cjs` reflect the production machine; update those paths on another machine. Run `node animation/render.cjs --preview` for still previews, `node animation/render.cjs` for 4K, or add `--1080` for 1920 × 1080.

No background music or narration is included, for use in scientific presentations.
