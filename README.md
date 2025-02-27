# Cubehelix to HEX

Convert selected color string between Cubehelix and HEX color spaces.

## Features

There is a single command "Cubehelix ⇄ HEX" which automatically recognizes selected color format (Cubehelix or HEX) and converts it to the opposite color space.

Valid Cubehelix formats:

- cubehelix(360, 100%, 100%)
- cubehelix(360, 100, 100)
- (360, 100%, 100%)
- (360, 100, 100)

Valid HEX formats:

- #FFFFFF
- #ffffff
- #FFF
- #fff

## Cubehelix?

Cubehelix colors are described by `hue: 0-360`, `saturation: 0-100+`, `lightness: 0-100`. Although max `saturation` for some colors can be close to `500`, the real value of this color space lies in colors with `saturation: 0-100`. As long as you are within this range, colors of any `hue` keep constant contrast between their `lightness` values.

![Color spaces](https://raw.githubusercontent.com/shushtain/cubehelix-to-hex/refs/heads/main/example1.jpg)

For example, a button with the background of `(240, 100, 30)` and the text of `(240, 100, 90)` will measure to the same color accessibility contrast as a button with the background of `(160, 50, 30)` and the text of `(160, 100, 90)`.

![Example](https://raw.githubusercontent.com/shushtain/cubehelix-to-hex/refs/heads/main/example2.jpg)

I typically set `saturation 110%` for signal (error, warning) colors. The clipping (which leads to contrast mutations) is minimal.

## Known Issues

...

## Release Notes

### 0.0.2

Fixed README.

### 0.0.1

Initial release.
