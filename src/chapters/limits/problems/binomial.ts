import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'binomial-theorem',
    statement: {
      ko: String.raw`\(x, y\)가 수(실수 또는 복소수)이고 \(n \geq 0\)이 정수일 때, 이항정리 \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\)를 \(n\)에 대한 귀납법으로 증명하세요.`,
      en: String.raw`Let \(x, y\) be numbers (real or complex) and \(n \geq 0\) an integer. Prove the binomial theorem \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) by induction on \(n\).`,
    },
    display: [String.raw`(x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k`],
    preset: { n: 4 },
    presetCaption: {
      ko: String.raw`행 \(n = 4\): \(1,\ 4,\ 6,\ 4,\ 1\) — \((x+y)^4\) 전개식의 계수들.`,
      en: String.raw`Row \(n = 4\): \(1,\ 4,\ 6,\ 4,\ 1\) — the coefficients in the expansion of \((x+y)^4\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 귀납 단계에 쓸 파스칼 항등식 \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\) (\(1 \leq k \leq n\))를 확인합니다. 정의 \(\binom{n}{k}=\frac{n!}{k!(n-k)!}\)를 대입하면 \(\frac{n!}{k!(n-k)!}+\frac{n!}{(k-1)!(n-k+1)!}\)이고, \(\frac{n!}{(k-1)!(n-k)!}\)로 묶어내면 \(\frac{n!}{(k-1)!(n-k)!}\left(\frac1k+\frac1{n-k+1}\right) = \frac{n!}{(k-1)!(n-k)!}\cdot\frac{n+1}{k(n-k+1)} = \frac{(n+1)!}{k!(n+1-k)!} = \binom{n+1}{k}\)입니다.`,
          en: String.raw`First verify Pascal's identity \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\) (\(1 \leq k \leq n\)), which the induction step will use. Substituting \(\binom{n}{k}=\frac{n!}{k!(n-k)!}\) gives \(\frac{n!}{k!(n-k)!}+\frac{n!}{(k-1)!(n-k+1)!}\); factoring out \(\frac{n!}{(k-1)!(n-k)!}\) yields \(\frac{n!}{(k-1)!(n-k)!}\left(\frac1k+\frac1{n-k+1}\right) = \frac{n!}{(k-1)!(n-k)!}\cdot\frac{n+1}{k(n-k+1)} = \frac{(n+1)!}{k!(n+1-k)!} = \binom{n+1}{k}\).`,
        },
      },
      {
        text: {
          ko: String.raw`기저 \(n = 0\): 좌변은 \((x+y)^0 = 1\)이고, 우변은 \(k=0\)인 항 하나뿐이라 \(\binom{0}{0}x^0y^0 = 1\cdot 1\cdot 1 = 1\) — 성립합니다.`,
          en: String.raw`Base case \(n = 0\): the left side is \((x+y)^0 = 1\), and the right side has only the term \(k = 0\), giving \(\binom{0}{0}x^0y^0 = 1\cdot 1\cdot 1 = 1\) — it holds.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n\)에서 성립한다고 가정합니다. \((x+y)^{n+1} = (x+y)(x+y)^n\)에 귀납 가설을 대입하면 \(\sum_{k=0}^{n}\binom{n}{k}x^{n+1-k}y^k + \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^{k+1}\)을 얻습니다.`,
          en: String.raw`Assume the formula holds for \(n\). Then \((x+y)^{n+1} = (x+y)(x+y)^n\), and substituting the induction hypothesis gives \(\sum_{k=0}^{n}\binom{n}{k}x^{n+1-k}y^k + \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^{k+1}\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 번째 합에서 \(j = k+1\)로 치환하면 \(\sum_{j=1}^{n+1}\binom{n}{j-1}x^{n+1-j}y^j\)가 됩니다 (첫 번째 합의 \(k\)도 \(j\)로 다시 씁니다). \(1 \leq j \leq n\)에서 \(x^{n+1-j}y^j\)의 계수는 \(\binom{n}{j}+\binom{n}{j-1}\)이며, 파스칼 항등식으로 \(\binom{n+1}{j}\)가 됩니다. 경계항은 \(j=0\)에서 \(\binom{n}{0} = 1 = \binom{n+1}{0}\), \(j=n+1\)에서 \(\binom{n}{n} = 1 = \binom{n+1}{n+1}\)이므로 전체 합은 \(\sum_{j=0}^{n+1}\binom{n+1}{j}x^{n+1-j}y^j\) — 정확히 \(n+1\)에서의 공식입니다.`,
          en: String.raw`Reindexing the second sum with \(j = k+1\) gives \(\sum_{j=1}^{n+1}\binom{n}{j-1}x^{n+1-j}y^j\) (renaming \(k\) to \(j\) in the first sum as well). For \(1 \leq j \leq n\) the coefficient of \(x^{n+1-j}y^j\) is \(\binom{n}{j}+\binom{n}{j-1}\), which equals \(\binom{n+1}{j}\) by Pascal's identity. The boundary terms are \(\binom{n}{0} = 1 = \binom{n+1}{0}\) at \(j = 0\) and \(\binom{n}{n} = 1 = \binom{n+1}{n+1}\) at \(j = n+1\), so the whole sum is \(\sum_{j=0}^{n+1}\binom{n+1}{j}x^{n+1-j}y^j\) — exactly the formula for \(n+1\).`,
        },
      },
      {
        text: {
          ko: String.raw`기저와 귀납 단계로 모든 \(n \geq 0\)에서 이항정리가 성립합니다. 핵심은 파스칼 항등식입니다 — 이항계수의 점화식이 \((x+y)\)를 한 번 더 곱하는 귀납 단계와 정확히 맞아떨어집니다.`,
          en: String.raw`The base case and the inductive step give the binomial theorem for every \(n \geq 0\). The crux is Pascal's identity — the recurrence of the binomial coefficients meshes exactly with the inductive step of multiplying by one more \((x+y)\).`,
        },
      },
    ],
  },
  {
    id: 'row-sum',
    statement: {
      ko: String.raw`모든 정수 \(n \geq 0\)에 대해 \(\sum_{k=0}^{n}\binom{n}{k} = 2^n\)임을 증명하세요.`,
      en: String.raw`Prove that \(\sum_{k=0}^{n}\binom{n}{k} = 2^n\) for every integer \(n \geq 0\).`,
    },
    display: [String.raw`\sum_{k=0}^{n}\binom{n}{k} = 2^n`],
    preset: { n: 4 },
    presetCaption: {
      ko: String.raw`행 \(n = 4\)의 합: \(1+4+6+4+1 = 16 = 2^4\).`,
      en: String.raw`The sum of row \(n = 4\): \(1+4+6+4+1 = 16 = 2^4\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`이항정리에 \(x = 1\), \(y = 1\)을 대입합니다. 좌변은 \((1+1)^n = 2^n\)이 됩니다.`,
          en: String.raw`Substitute \(x = 1\), \(y = 1\) into the binomial theorem. The left side becomes \((1+1)^n = 2^n\).`,
        },
      },
      {
        text: {
          ko: String.raw`우변은 \(\sum_{k=0}^{n}\binom{n}{k}1^{n-k}1^k = \sum_{k=0}^{n}\binom{n}{k}\)입니다 (\(1\)의 거듭제곱은 \(1\)). 따라서 \(\sum_{k=0}^{n}\binom{n}{k} = 2^n\) — 파스칼 삼각형의 각 행의 합이 \(2\)의 거듭제곱이 되는 이유입니다.`,
          en: String.raw`The right side is \(\sum_{k=0}^{n}\binom{n}{k}1^{n-k}1^k = \sum_{k=0}^{n}\binom{n}{k}\) (powers of \(1\) are \(1\)). Hence \(\sum_{k=0}^{n}\binom{n}{k} = 2^n\) — this is why each row of Pascal's triangle sums to a power of \(2\).`,
        },
      },
    ],
  },
  {
    id: 'alternating-sum',
    statement: {
      ko: String.raw`모든 정수 \(n \geq 1\)에 대해 \(\sum_{k=0}^{n}(-1)^k\binom{n}{k} = 0\)임을 증명하세요.`,
      en: String.raw`Prove that \(\sum_{k=0}^{n}(-1)^k\binom{n}{k} = 0\) for every integer \(n \geq 1\).`,
    },
    display: [String.raw`\sum_{k=0}^{n}(-1)^k\binom{n}{k} = 0 \quad (n \geq 1)`],
    preset: { n: 4 },
    presetCaption: {
      ko: String.raw`행 \(n = 4\): \(1-4+6-4+1 = 0\) — 부호를 번갈아 붙이면 합이 사라진다.`,
      en: String.raw`Row \(n = 4\): \(1-4+6-4+1 = 0\) — alternating signs cancel the sum.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`이항정리에 \(x = 1\), \(y = -1\)을 대입합니다. 좌변은 \((1+(-1))^n = 0^n\)인데, \(n \geq 1\)이므로 \(0^n = 0\)입니다 (\(n = 0\)은 \(0^0\)이 관례상 \(1\)이므로 제외합니다).`,
          en: String.raw`Substitute \(x = 1\), \(y = -1\) into the binomial theorem. The left side is \((1+(-1))^n = 0^n\), and \(0^n = 0\) since \(n \geq 1\) (\(n = 0\) is excluded because \(0^0\) is conventionally \(1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`우변은 \(\sum_{k=0}^{n}\binom{n}{k}1^{n-k}(-1)^k = \sum_{k=0}^{n}(-1)^k\binom{n}{k}\)입니다. 따라서 \(\sum_{k=0}^{n}(-1)^k\binom{n}{k} = 0\) — 파스칼 삼각형의 각 행에 부호를 번갈아 붙이면 합이 \(0\)이 됩니다.`,
          en: String.raw`The right side is \(\sum_{k=0}^{n}\binom{n}{k}1^{n-k}(-1)^k = \sum_{k=0}^{n}(-1)^k\binom{n}{k}\). Hence \(\sum_{k=0}^{n}(-1)^k\binom{n}{k} = 0\) — alternating signs cancel every row of Pascal's triangle to \(0\).`,
        },
      },
    ],
  },
];
