# 2026-11-17 jensen-face

Goal: Jensen Huang's face traced from a real photo, in our flat style.
Method: photo on a 20 px grid (assets/people/jensen-huang/grid.jpg on Expansion), read the points off the grid,
draw them in photo coordinates through one translate+scale (`photoSpace` in people/jensen.js).
Result: Loc "dit is prima" after the neck was added. Drawing moved to src/templates/toon-2d/people/jensen.js.
Render: `LabJensenFace` (grin + shock on paper).
