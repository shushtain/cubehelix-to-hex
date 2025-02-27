// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // * Cubehelix to HEX
  const cubeHex = vscode.commands.registerCommand(
    "cubehelix-to-hex.cubeHex",
    function () {
      const editor = vscode.window.activeTextEditor;
      const A = -0.14861;
      const B = 1.78277;
      const C = -0.29227;
      const D = -0.90649;
      const E = 1.97294;
      const ED = E * D;
      const EB = E * B;
      const BC_DA = B * C - D * A;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection).trim();
        const patternCubehelix =
          /(cubehelix)?\s*\(\s*[.]?\d*[.]?\d*\s*%?\s*,\s*[.]?\d*[.]?\d*\s*%?\s*,\s*[.]?\d*[.]?\d*\s*%?\s*\)/;
        const patternHex = /#[0-9a-fA-F]{3,6}/;
        if (selectedText.search(patternCubehelix) >= 0) {
          let clr_in = selectedText.replace(/[a-zA-Z()%]/g, "");
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

          if (r < 0) {
            r = 0;
          } else if (r > 1) {
            r = 1;
          }

          if (g < 0) {
            g = 0;
          } else if (g > 1) {
            g = 1;
          }

          if (b < 0) {
            b = 0;
          } else if (b > 1) {
            b = 1;
          }

          let rhex = Math.round(r * 255)
            .toString(16)
            .toUpperCase();
          let ghex = Math.round(g * 255)
            .toString(16)
            .toUpperCase();
          let bhex = Math.round(b * 255)
            .toString(16)
            .toUpperCase();

          if (rhex.length == 1) {
            rhex = "0" + rhex;
          }

          if (ghex.length == 1) {
            ghex = "0" + ghex;
          }

          if (bhex.length == 1) {
            bhex = "0" + bhex;
          }

          let hex = `#${rhex}${ghex}${bhex}`;

          editor.edit((editBuilder) => {
            editBuilder.replace(selection, hex);
          });
        } else if (selectedText.search(patternHex) >= 0) {
          let clr_in = selectedText.replace("#", "");
          let coords = [];

          if (clr_in.length == 3) {
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

          let cubehelix = `cubehelix(${h}, ${s}, ${l})`;

          editor.edit((editBuilder) => {
            editBuilder.replace(selection, cubehelix);
          });
        }
      }
    }
  );

  context.subscriptions.push(cubeHex);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
