/**
 * Kahan compensated summation.
 * Reduces the rounding error that accumulates in a plain running total over many terms, as in partial sums.
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
