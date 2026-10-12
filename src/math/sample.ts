/**
 * 1..n 에서 그래프에 그릴 인덱스를 고른다.
 * n 이 maxPoints 이하이면 전부, 크면 로그 간격으로 고르고 1과 n 은 항상 포함한다.
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
