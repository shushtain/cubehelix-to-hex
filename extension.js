const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  // * Cubehelix to HEX
  const cubeHex = vscode.commands.registerCommand(
    "cubehelix-to-hex.cubeHex",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selections = editor.selections;

        editor.edit((editBuilder) => {
          selections.forEach((selection) => {
            const selectedText = document.getText(selection).trim();
            const patternCubehelix =
              /(cubehelix)?\s*\(\s*[.]?\d*[.]?\d*\s*%?\s*,\s*[.]?\d*[.]?\d*\s*%?\s*,\s*[.]?\d*[.]?\d*\s*%?\s*\)/;
            const patternHex = /#[0-9a-fA-F]{3,6}/;

            if (selectedText.search(patternCubehelix) >= 0) {
              const hex = cubehelixToHex(selectedText);
              editBuilder.replace(selection, hex);
            } else if (selectedText.search(patternHex) >= 0) {
              const cubehelix = hexToCubehelix(selectedText);
              editBuilder.replace(selection, cubehelix);
            }
          });
        });
      }
    }
  );

  context.subscriptions.push(cubeHex);
}

function cubehelixToHex(cubehelixString) {
  const A = -0.14861;
  const B = 1.78277;
  const C = -0.29227;
  const D = -0.90649;
  const E = 1.97294;

  let clr_in = cubehelixString.replace(/[a-zA-Z()%]/g, "");
  let coords = clr_in.split(",");
  for (let i = 0; i < coords.length; i++) {
    coords[i] = parseFloat(coords[i].trim());
  }

  let h = coords[0];
  let s = coords[1] / 100;
  let l = coords[2] / 100;

  h = ((h / 120) % 3) + 1;
  h = 2 * Math.PI * (h / 3 + 1);

  let a = s * l * (1 - l);

  let cosh = Math.cos(h);
  let sinh = Math.sin(h);

  let r = l + a * (A * cosh + B * sinh);
  let g = l + a * (C * cosh + D * sinh);
  let b = l + a * (E * cosh);

  r = Math.min(1, Math.max(0, r));
  g = Math.min(1, Math.max(0, g));
  b = Math.min(1, Math.max(0, b));

  let rhex = Math.round(r * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
  let ghex = Math.round(g * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
  let bhex = Math.round(b * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");

  return `#${rhex}${ghex}${bhex}`;
}

function hexToCubehelix(hexString) {
  const A = -0.14861;
  const B = 1.78277;
  const C = -0.29227;
  const D = -0.90649;
  const E = 1.97294;
  const ED = E * D;
  const EB = E * B;
  const BC_DA = B * C - D * A;

  let clr_in = hexString.replace("#", "");
  let coords = [];

  if (clr_in.length === 3) {
    coords.push(clr_in.charAt(0) + clr_in.charAt(0));
    coords.push(clr_in.charAt(1) + clr_in.charAt(1));
    coords.push(clr_in.charAt(2) + clr_in.charAt(2));
  } else {
    coords.push(clr_in.charAt(0) + clr_in.charAt(1));
    coords.push(clr_in.charAt(2) + clr_in.charAt(3));
    coords.push(clr_in.charAt(4) + clr_in.charAt(5));
  }

  for (let i = 0; i < coords.length; i++) {
    coords[i] = parseInt(coords[i], 16) / 255;
  }

  let r = coords[0];
  let g = coords[1];
  let b = coords[2];

  let l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
  let bl = b - l;
  let k = (E * (g - l) - C * bl) / D;

  let s;
  if (l == 0 || l == 1) {
    s = 0;
  } else {
    s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l));
  }

  let h;
  if (s == 0) {
    h = 0;
  } else {
    h = Math.atan2(k, bl) * (180 / Math.PI) - 120;
  }
  h = h % 360;
  if (h < 0) {
    h = 360 + h;
  }

  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `cubehelix(${h}, ${s}%, ${l}%)`;
}

// * DEACTIVATE
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
