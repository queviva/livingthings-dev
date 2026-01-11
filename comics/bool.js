// bool.js
const paper = require('paper-jsdom-canvas');
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.log('Usage: node bool.js input.svg');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = 'output.svg';

const svgContent = fs.readFileSync(inputPath, 'utf8');

// Create paper scope
const scope = paper.createScope();
scope.importSVG(svgContent, {
  expandShapes: true,
  applyMatrix: true
});

const project = scope.project;
const root = project.activeLayer;

// Map id → item (only top-level items for simplicity)
const idMap = new Map();
root.children.forEach(item => {
  if (item.name) {
    idMap.set(item.name, item);
  }
});

// Collect all boolean operations (we process them in order)
const operations = [];

root.children.forEach(item => {
  if (!item.data || !item.data.bool) return;

  let boolData;
  try {
    boolData = JSON.parse(item.data.bool);
  } catch (e) {
    console.warn(`Invalid data-bool JSON on item ${item.name || '(no name)'}`);
    return;
  }

  const { op, with: targetId } = boolData;

  if (!['union', 'intersection', 'difference', 'xor'].includes(op)) {
    console.warn(`Unknown boolean operation: ${op}`);
    return;
  }

  const target = idMap.get(targetId);
  if (!target) {
    console.warn(`Target shape not found: ${targetId}`);
    return;
  }

  operations.push({ base: item, target, op });
});

// Execute booleans (important: do it in reverse if you want to preserve stacking order somewhat)
for (let i = operations.length - 1; i >= 0; i--) {
  const { base, target, op } = operations[i];

  let result;
  switch (op) {
    case 'union':
      result = base.unite(target);
      break;
    case 'intersection':
      result = base.intersect(target);
      break;
    case 'difference':
      result = base.subtract(target);
      break;
    case 'xor':
      result = base.exclude(target);
      break;
  }

  if (result) {
    // Try to keep original position & style of base
    result.position = base.position;
    result.insertAbove(base);

    base.remove();
    // Optional: also remove the other shape if you don't want to keep it
    // target.remove();
  }
}

// Export final result
const finalSvg = project.exportSVG({ asString: true, precision: 4, bounds: 'content' });
fs.writeFileSync(outputPath, finalSvg);

console.log(`Done. Output saved to: ${path.resolve(outputPath)}`);
scope.remove(); // cleanup