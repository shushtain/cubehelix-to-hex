const vscode = require("vscode");

const A = -0.14861;
const B = 1.78277;
const C = -0.29227;
const D = -0.90649;
const E = 1.97294;
const ED = E * D;
const EB = E * B;
const BC_DA = B * C - D * A;

const PATTERN_CUBEHELIX =
  /([.]?\d+(?:[.]\d*)?%?\s*[,\s]\s*){2}[.]?\d+(?:[.]\d*)?%?/;
const PATTERN_HEX = /#([0-9a-f]{3}){1,2}/i;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // * Cubehelix to HEX
  const cubeHex = vscode.commands.registerCommand(
    "cubehelix-to-hex.cubeHex",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selections = editor.selections;

      editor.edit((editBuilder) => {
        selections.forEach((selection) => {
          let selectedText = document.getText(selection).trim();

          if (PATTERN_CUBEHELIX.test(selectedText)) {
            try {
              const hex = cubehelixToHex(selectedText);
              editBuilder.replace(selection, hex);
            } catch (error) {
              vscode.window.showErrorMessage(error.message);
            }
          } else if (PATTERN_HEX.test(selectedText)) {
            try {
              const cubehelix = hexToCubehelix(selectedText);
              editBuilder.replace(selection, cubehelix);
            } catch (error) {
              vscode.window.showErrorMessage(error.message);
            }
          } else {
            vscode.window.showErrorMessage("No valid color values.");
          }
        });
      });
    }
  );

  context.subscriptions.push(cubeHex);
}

function cubehelixToHex(cubehelixString) {
  let clr_in = cubehelixString.replace(/[^\d,.%\s]/g, "").trim();
  let coords = clr_in.split(/[,\s]+/);

  if (coords.length !== 3) {
    throw new Error("Invalid Cubehelix format.");
  }

  let h_raw = coords[0];
  let s_raw = coords[1];
  let l_raw = coords[2];

  let h = parseFloat(h_raw.replace("%", "").trim());

  let s;
  if (s_raw.includes("%")) {
    s = parseFloat(s_raw.replace("%", "").trim()) / 100;
  } else {
    s = parseFloat(s_raw.trim());
  }

  let l;
  if (l_raw.includes("%")) {
    l = parseFloat(l_raw.replace("%", "").trim()) / 100;
  } else {
    l = parseFloat(l_raw.trim());
  }

  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    throw new Error("Invalid Cubehelix values.");
  }

  // lightness limits
  if (l <= 0) {
    return "#000000";
  }
  if (l >= 1) {
    return "#FFFFFF";
  }

  h = (Math.PI * (h + 120)) / 180;

  // saturation limits
  if (s <= 0) {
    h = 0;
  }

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
  if (!PATTERN_HEX.test(hexString)) {
    throw new Error("Invalid HEX format.");
  }

  const hex = hexString.replace("#", "");

  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0).repeat(2), 16) / 255;
    g = parseInt(hex.charAt(1).repeat(2), 16) / 255;
    b = parseInt(hex.charAt(2).repeat(2), 16) / 255;
  } else {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }

  let l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
  let bl = b - l;
  let k = (E * (g - l) - C * bl) / D;

  let s;
  if (l === 0 || l === 1) {
    s = 0;
  } else {
    s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l));
  }

  let h;
  if (s === 0) {
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

  if (h === 360) {
    h = 0;
  }

  return `cubehelix(${h}, ${s}%, ${l}%)`;
}

// * DEACTIVATE
function deactivate() {}

module.exports = {
  activate,
  deactivate,
  cubehelixToHex, // test
  hexToCubehelix, // test
  PATTERN_HEX, // test
};
