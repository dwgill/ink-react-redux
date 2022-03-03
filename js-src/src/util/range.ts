function range(stop: number): number[];
function range(start: number, stop: number): number[];
function range(start: number, stop: number, step: number): number[];
function range(start: number, stop?: number, step?: number): number[] {
  if (start == null) {
    start = 0;
  }
  if (stop == null) {
    stop = start;
    start = 0;
  }
  if (step == null) {
    step = stop < start ? -1 : 1;
  }

  let index = -1;
  let length = Math.max(Math.ceil((stop - start) / step), 0);
  let result: number[] = new Array(length);

  while (length--) {
    result[++index] = start;
    start += step;
  }
  return result;
}

export default range;
