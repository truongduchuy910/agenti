const { watch } = require("../dist");

describe("Agent AI", () => {
  let watchers = [];
  afterAll(() => {
    watchers.map((one) => one.close());
  });

  test("add README should match name", () => {
    watchers = watch({
      projects: ["."],
      wildcards: [
        {
          name: "resource",
          condition: "README.md",
          processor: async (data) => {
            expect(data.parse.name).toBe("README");
          },
        },
      ],
    });
  });
});
