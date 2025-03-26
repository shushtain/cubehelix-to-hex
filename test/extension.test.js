const assert = require("assert");
const { cubehelixToHex, hexToCubehelix, PATTERN_HEX } = require("../extension");

suite("Cubehelix to HEX Conversion Tests", () => {
  test("Cubehelix to HEX conversions", () => {
    const testCases = [
      // Testing "0, 100%, 50%" variations
      {
        input: "0, 100%, 50%",
        expected: "#E75741",
      },
      {
        input: "cubehelix(0,100%,50%)",
        expected: "#E75741",
      },
      {
        input: "(0 100% 50%)",
        expected: "#E75741",
      },
      {
        input: "0 1 .5",
        expected: "#E75741",
      },

      // Testing "120, 80%, 60%" variations
      {
        input: "120, 80%, 60%",
        expected: "#51C769",
      },
      {
        input: "hsl(120 80% 60%)",
        expected: "#51C769",
      },
      {
        input: "120,.8,.6",
        expected: "#51C769",
      },

      // Testing "240, 100%, 30%" variations
      {
        input: "240, 100%, 30%",
        expected: "#453DB6",
      },
      {
        input: "(240 1 .3)",
        expected: "#453DB6",
      },
      {
        input: "cubehelix(240,100%,30%)",
        expected: "#453DB6",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = cubehelixToHex(input);
      assert.strictEqual(result, expected, `Failed converting ${input}`);
    });
  });

  test("HEX to Cubehelix conversions", () => {
    const testCases = [
      // Uppercase variations
      {
        input: "#000000",
        expected: "cubehelix(0, 0%, 0%)",
      },
      {
        input: "#FFFFFF",
        expected: "cubehelix(0, 0%, 100%)",
      },
      {
        input: "#FF0000",
        expected: "cubehelix(352, 195%, 30%)",
      },
      // Lowercase variations
      {
        input: "#ff0000",
        expected: "cubehelix(352, 195%, 30%)",
      },
      {
        input: "#ffffff",
        expected: "cubehelix(0, 0%, 100%)",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = hexToCubehelix(input);
      assert.strictEqual(result, expected, `Failed converting ${input}`);
    });
  });

  test("Multiple selections conversions", () => {
    // Simulate multiple selections
    const selections = [
      {
        inputs: ["0, 100%, 50%", "120, 80%, 60%", "240, 100%, 30%"],
        expected: ["#E75741", "#51C769", "#453DB6"],
      },
      {
        inputs: ["#E75741", "#51C769", "#453DB6"],
        expected: [
          "cubehelix(0, 100%, 50%)",
          "cubehelix(120, 80%, 60%)",
          "cubehelix(240, 100%, 30%)",
        ],
      },
      {
        inputs: ["0 1 .5", "#51C769", "240, 100%, 30%"],
        expected: ["#E75741", "cubehelix(120, 80%, 60%)", "#453DB6"],
      },
    ];

    selections.forEach(({ inputs, expected }) => {
      inputs.forEach((input, index) => {
        const result = PATTERN_HEX.test(input)
          ? hexToCubehelix(input)
          : cubehelixToHex(input);
        assert.strictEqual(
          result,
          expected[index],
          `Failed converting multiple selection: ${input}`
        );
      });
    });
  });
});
