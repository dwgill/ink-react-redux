import { ArrayPredicate } from "./types";

export default function splitArray<T>(
  arr: T[],
  delimiterPredicate: ArrayPredicate<T>,
  includeDlimiters: false | "start" | "end" = false
) {
  let slices = [];
  let sliceStart = 0;
  const startOffset = includeDlimiters === "start" ? 0 : 1;
  const endOffset = includeDlimiters === "end" ? 1 : 0;

  for (let index = 0; index < arr.length; index++) {
    if (delimiterPredicate(arr[index], index, arr)) {
      const sliceEnd = index + endOffset;
      if (sliceEnd !== sliceStart) {
        slices.push(arr.slice(sliceStart, sliceEnd));
      }
      sliceStart = index + startOffset;
    }
  }
  if (sliceStart !== arr.length) {
    slices.push(arr.slice(sliceStart, arr.length));
  }
  return slices;
}
