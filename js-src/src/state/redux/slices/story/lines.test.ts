import linesSlice, { nonGlobalLinesSelectors } from "./lines";

describe("lines.ts", () => {
  describe("linesSlice", () => {
    describe("addLine()", () => {
      it("works", () => {
        let state = linesSlice.getInitialState();
        const action1 = linesSlice.actions.addLine({
          id: "foobar",
          lineKind: "c/story/line/basicLine",
          tags: [],
          text: "foobar foobar foobar",
        });
        state = linesSlice.reducer(state, action1);
        expect(nonGlobalLinesSelectors.selectById(state, "foobar")).toEqual({
          ...action1.payload,
          index: 0,
          meta: {},
        });
        const action2 = linesSlice.actions.addLine({
          id: "barfoo",
          lineKind: "c/story/line/basicLine",
          tags: ["abc", "wyz"],
          text: "barfoo barfoo barfoo",
          meta: {
            xyz: "abc",
          },
        });
        state = linesSlice.reducer(state, action2);
        expect(nonGlobalLinesSelectors.selectById(state, "barfoo")).toEqual({
          ...action2.payload,
          index: 1,
        });
      });
    });
    describe("setLineMetadata", () => {
      it("works", () => {
        const state = [
          linesSlice.actions.addLine({
            id: "foobar",
            lineKind: "c/story/line/basicLine",
            text: "foobar foobar foobar",
          }),
          linesSlice.actions.addLine({
            id: "barfoo",
            lineKind: "c/story/line/basicLine",
            text: "barfoo barfoo barfoo",
            meta: {
              foobar: "bizzbazz",
            },
          }),
        ].reduce(linesSlice.reducer, linesSlice.getInitialState());

        expect(
          nonGlobalLinesSelectors.selectById(state, "foobar")?.meta
        ).toEqual({});
        expect(
          nonGlobalLinesSelectors.selectById(state, "barfoo")?.meta
        ).toEqual({
          foobar: "bizzbazz",
        });

        const state2 = [
          linesSlice.actions.setLineMetadata({
            id: "foobar",
            meta: {
              abz: 123,
            },
          }),
          linesSlice.actions.setLineMetadata({
            id: "barfoo",
            meta: {
              foobar: null,
            },
          }),
        ].reduce(linesSlice.reducer, state);

        expect(
          nonGlobalLinesSelectors.selectById(state2, "foobar")?.meta
        ).toEqual({ abz: 123 });
        expect(
          nonGlobalLinesSelectors.selectById(state2, "barfoo")?.meta
        ).toEqual({});
      });
    });
  });
});
