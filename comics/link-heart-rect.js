const paper = require('paper');

// Setup a dummy project (no real canvas needed for geometry ops)
paper.setup(new paper.Size(150, 150));

console.log("=== Paper.js Heart + Rect Linking Script ===\n");

// 1. Define the raw paths (outer only for subtraction/mask purposes)
const heartOuter = new paper.Path(`
  M 50 22 C 82 -14 142 50 50 95 C -42 50 18 -14 50 22 Z
`);

const heartInner = new paper.Path(`
  M 50 37 C 72 2 115 47 50 81 C -15 47 28 2 50 37 Z
`);

// Combine into compound path (with hole) - useful for visualization or export
const heart = new paper.CompoundPath({
  children: [heartOuter, heartInner],
  fillRule: 'evenodd'
});

const rectOuter = new paper.Path(`
  M 15 19 L 87 21 L 80 84.5 H 18 Z
`);

const rectInner = new paper.Path(`
  M 28 31 L 73.5 32.5 L 69 72 H 30 Z
`);

/*
const rect = new paper.Path(`
  M 15 19 L 87 21 L 73.5 32.5 L 28 31 Z
`)
*/

const rect = new paper.CompoundPath({
  children: [rectOuter, rectInner],
  fillRule: 'evenodd'
});

// 2. Apply transformations exactly as in your SVG
// Heart: rotate(10°) then translate(-3.2, 0) around center (50,50)
heart.pivot = new paper.Point(50, 50);
heart.rotate(10);
heart.translate(-3.2, 0);

// Pink rect: scale(1.2) then translate(38, 28.5) around center (50,50)
rect.pivot = new paper.Point(50, 50);
rect.scale(1.2);
rect.translate(45, 34);

console.log('big rect');
console.log(rect.pathData);

// 3. Find all intersection points
const intersections = heart.getIntersections(rect);
console.log(`Found ${intersections.length} intersection points:\n`);

intersections.forEach((hit, i) => {
  const pt = hit.point;
  console.log(`  ${i + 1}: (${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`);
});

// 4. Create the "linked" version: pink shape with heart cut out (like chain link / underpass)
const pinkLinked = rect.subtract(heart);
const rectLinked = heart.subtract(rect);

// Handle case where subtract might return multiple pieces
let linkedPaths;
let linkedRects;

if (pinkLinked instanceof paper.CompoundPath) {
  linkedPaths = pinkLinked.children;
} else {
  linkedPaths = [pinkLinked];
}
if (rectLinked instanceof paper.CompoundPath) {
  linkedRects = rectLinked.children;
} else {
  linedRects = [rectLinked];
}

console.log("\n=== Linked Pink Shape Path Data (ready for SVG) ===\n");

/*
linkedPaths.forEach((path, i) => {
  if (path.isEmpty()) return;
  console.log(`Path piece ${i + 1}:`);
  console.log(path.pathData);
  console.log('');
});
*/

// Optional: Export full SVG snippet you could paste back
console.log("=== Suggested SVG replacement for the pink part ===\n");
console.log(`<path fill="pink" d="${pinkLinked.pathData}" />`);

console.log("\n\n=== replace for heart pieces ===\n");
console.log(`<path fill="green" d="${rectLinked.pathData}" />`)

// Optional bonus: show bounding boxes for debugging
/*
console.log("\nHeart bounds:", heart.bounds.toString());
console.log("Original rect bounds:", rect.bounds.toString());
console.log("Linked pink bounds:", pinkLinked.bounds.toString());
*/

console.log("\nDone! Copy the pathData above into your SVG as needed.");
