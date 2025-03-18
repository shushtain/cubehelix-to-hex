# Cubehelix to HEX

Convert selected color strings between Cubehelix and HEX color spaces.

> For more information about the Cubehelix color space, look for [Dave Green's Cubehelix](https://people.phy.cam.ac.uk/dag9/CUBEHELIX/#Paper). The specific implementation of Cubehelix for this extenstion is described below, after the features.

## Features

There is a single command "Cubehelix ⇄ HEX" which automatically recognizes selected color format (Cubehelix or HEX) and converts it to the opposite color space.

### Valid HEX formats

- `#FFFFFF`
- `#ffffff`
- `#FFF`
- `#fff`

### Valid Cubehelix formats

The extension with recognize any three positive numbers separated by commas and/or spaces. You can add `%` to the numbers, group them with parentheses, and name the group up to your liking. All drag is valid (except for alphas):

- `123 25.3 80`
- `50,120%,60%`
- `(355, 30%, 20%)`
- `cubehelix(0, 0%, 5%)`
- `hsl(25, 50%, 80%)`

Cubehelix specification doesn't care if the numbers are crazy, so better stick to something close to:

- `hue` : `0-360`
- `saturation` : `0-100+`
- `lightness` : `0-100`

## Cubehelix?

Cubehelix colors are described by `hue: 0-360`, `saturation: 0-100+`, `lightness: 0-100`. Although max `saturation` for some colors can be close to `500`, the real value of this color space lies in colors with `saturation: 0-100`. As long as you are within this range, colors of any `hue` keep constant contrast between their `lightness` values.

![Color spaces](https://raw.githubusercontent.com/shushtain/cubehelix-to-hex/refs/heads/main/example1.jpg)

For example, a button with the background of `(240, 100%, 30%)` and the text of `(240, 100%, 90%)` will measure to the same color accessibility contrast as a button with the background of `(160, 50%, 30%)` and the text of `(160, 100%, 90%)`.

![Example](https://raw.githubusercontent.com/shushtain/cubehelix-to-hex/refs/heads/main/example2.jpg)

I typically set `saturation 110%` for signal (error, warning) colors. The clipping (which leads to contrast mutations) is minimal.
