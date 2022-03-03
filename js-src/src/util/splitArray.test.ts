import range from "./range";
import splitArray from "./splitArray";

describe("splitArray()", () => {
  it("works", () => {
    expect(splitArray(range(10), (x) => (x % 3) === 0)).toEqual([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
    expect(
      splitArray("this is a test".split(""), (str) => str === " ")
    ).toEqual("this is a test".split(" ").map((str) => str.split("")));
  });
  it("works with includeDlimiters=start", () => {
    expect(splitArray(range(10), (x) => x % 3 === 0, 'start')).toEqual([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9],
    ]);
  });
  it("works with includeDlimiters=end", () => {
    expect(splitArray(range(10), (x) => x % 3 === 0, 'end')).toEqual([
      [0],
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });
});
