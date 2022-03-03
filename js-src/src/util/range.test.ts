import range from "./range";

describe("range()", () => {
  it("works with 1 argument", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(-5)).toEqual([0, -1, -2, -3, -4]);
    expect(range(0)).toEqual([]);
  });
  it("works with 2 arguments", () => {
    expect(range(3, 7)).toEqual([3, 4, 5, 6]);
    expect(range(3, -3)).toEqual([3, 2, 1, 0, -1, -2]);
    expect(range(10, 10)).toEqual([]);
  });
  it("works with 3 arguments", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    expect(range(9, -9, -3)).toEqual([9, 6, 3, 0, -3, -6]);
    expect(range(9, -9, 1)).toEqual([]);
  });
});
