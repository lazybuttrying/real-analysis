/**
 * Composite Simpson's rule over [a, b] with the given number of panels
 * (rounded up to an even count). Pure computation: no DOM, d3, or three.
 *
 * Shared by the calculus scene models that integrate numerically
 * (change of variables, integration by parts); factored out of the
 * byte-identical copies those models used to carry.
 */
export function simpson(
  f: (x: number) => number,
  a: number,
  b: number,
  panels: number,
): number {
  const n = panels % 2 === 0 ? panels : panels + 1;
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (sum * h) / 3;
}
