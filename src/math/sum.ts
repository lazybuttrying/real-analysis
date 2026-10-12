/**
 * Kahan 보상 합산.
 * 항이 많은 부분합에서 일반 누적 합의 반올림 오차가 쌓이는 것을 줄인다.
 */
export class KahanSum {
  private sum = 0;
  private compensation = 0;

  add(x: number): void {
    const y = x - this.compensation;
    const t = this.sum + y;
    this.compensation = t - this.sum - y;
    this.sum = t;
  }

  get value(): number {
    return this.sum;
  }
}
