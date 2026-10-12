/**
 * Picks the indices from 1..n to plot on the graph.
 * If n is at most maxPoints, all of them; otherwise a log-spaced selection, always including 1 and n.
 */
export function sampleIndices(n: number, maxPoints: number): number[] {
  if (n <= maxPoints) return Array.from({ length: n }, (_, i) => i + 1);

  const picked = new Set<number>([1, n]);
  const ratio = Math.log(n) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i++) {
    picked.add(Math.min(n, Math.max(1, Math.round(Math.exp(i * ratio)))));
  }
  return [...picked].sort((a, b) => a - b);
}
