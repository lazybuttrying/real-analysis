import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the contraction mapping scene.
 * Imports nothing except types. Imported by the chapter's meta.ts.
 *
 * Every number below was verified against src/chapters/limits/models/contraction.ts:
 * both maps share q = 1/2, and with x_0 = 1 the first Picard step is 1/2, so the
 * a-priori bound q^n/(1-q) * d(x_1, x_0) equals 2^{-n}. At n = 8: 1/256 = 0.00390625.
 * Affine iterates from x_0 = 1 satisfy x_n = 2 - 2^{-n} (so |x_8 - 2| = 1/256,
 * meeting the bound exactly); half-map iterates satisfy x_n = 2^{-n}.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'picard-cauchy',
    statement: {
      ko: String.raw`수축사상 \(T\) (\(d(Tx,Ty) \le q\,d(x,y)\), \(q<1\))의 피카르 반복 \(x_{n+1} = Tx_n\)에 대해 \(m>n\)일 때 \(d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1)\)임을 보이고, \((x_n)\)이 코시수열임을 증명하세요.`,
      en: String.raw`For the Picard iterates \(x_{n+1} = Tx_n\) of a contraction \(T\) (\(d(Tx,Ty) \le q\,d(x,y)\), \(q<1\)), show \(d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1)\) for \(m>n\), and prove \((x_n)\) is Cauchy.`,
    },
    display: [
      String.raw`d(x_{k+1},x_{k+2}) \le q\,d(x_k,x_{k+1}) \le q^{k+1}\,d(x_0,x_1)`,
      String.raw`d(x_n,x_m) \le \sum_{k=n}^{m-1} d(x_k,x_{k+1}) \le \frac{q^n}{1-q}\,d(x_0,x_1)`,
    ],
    preset: { map: 'affine', n: 8, x0: 1 },
    presetCaption: {
      ko: String.raw`\(n=8\): 코시 꼬리 상한 \(2^{-8} \approx 0.0039\) — \(m>8\)인 모든 \(x_m\)이 이 안에 들어옵니다.`,
      en: String.raw`\(n=8\): the Cauchy tail bound \(2^{-8} \approx 0.0039\) — every \(x_m\) with \(m>8\) lands inside it.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`한 걸음씩 조입니다: \(d(x_{k+1},x_{k+2}) = d(Tx_k,Tx_{k+1}) \le q\,d(x_k,x_{k+1})\)이므로, 귀납법으로 모든 \(k\)에 대해 \(d(x_k,x_{k+1}) \le q^k\,d(x_0,x_1)\)입니다.`,
          en: String.raw`Squeeze one step at a time: \(d(x_{k+1},x_{k+2}) = d(Tx_k,Tx_{k+1}) \le q\,d(x_k,x_{k+1})\), so by induction \(d(x_k,x_{k+1}) \le q^k\,d(x_0,x_1)\) for every \(k\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(m>n\)이면 삼각부등식을 연달아 적용해 \(d(x_n,x_m) \le \sum_{k=n}^{m-1} d(x_k,x_{k+1}) \le \left(\sum_{k=n}^{m-1} q^k\right) d(x_0,x_1)\)입니다. 합을 \(\infty\)까지 늘리면 기하급수 꼬리 \(\sum_{k=n}^{\infty} q^k = \frac{q^n}{1-q}\)가 나오므로 \(d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1)\)입니다.`,
          en: String.raw`For \(m>n\), chaining the triangle inequality gives \(d(x_n,x_m) \le \sum_{k=n}^{m-1} d(x_k,x_{k+1}) \le \left(\sum_{k=n}^{m-1} q^k\right) d(x_0,x_1)\). Extending the sum to \(\infty\) yields the geometric tail \(\sum_{k=n}^{\infty} q^k = \frac{q^n}{1-q}\), so \(d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`우변은 \(m\)과 무관하게 \(n \to \infty\)일 때 \(0\)으로 가므로 \((x_n)\)은 코시수열입니다. \(q = 1/2\), \(x_0 = 1\)이면 \(d(x_1,x_0) = 1/2\)이므로 상한은 \(2^{-n}\)이 되고, \(n = 8\)에서 \(\frac{1}{256} \approx 0.0039\) — 캡션의 수치와 일치합니다.`,
          en: String.raw`The right side tends to \(0\) as \(n \to \infty\), independently of \(m\), so \((x_n)\) is Cauchy. With \(q = 1/2\) and \(x_0 = 1\), \(d(x_1,x_0) = 1/2\) makes the bound \(2^{-n}\); at \(n = 8\) it is \(\frac{1}{256} \approx 0.0039\) — matching the caption's figure.`,
        },
      },
    ],
  },
  {
    id: 'half-no-fixed-point',
    statement: {
      ko: String.raw`\(T(x) = x/2\)가 \((0,1]\) 위에서 \(q = 1/2\)인 수축사상이지만, \((0,1]\) 안에는 고정점이 없음을 보이세요. 완비성이 왜 필수적인지 설명합니다.`,
      en: String.raw`Show that \(T(x) = x/2\) is a contraction with \(q = 1/2\) on \((0,1]\), yet has no fixed point in \((0,1]\). This is why completeness is essential.`,
    },
    display: [
      String.raw`|T(x) - T(y)| = \tfrac12|x - y|, \qquad T\big((0,1]\big) \subset (0,1]`,
      String.raw`x_0 = 1 \Rightarrow x_n = 2^{-n} \to 0 \notin (0,1]`,
    ],
    preset: { map: 'half', n: 8, x0: 1 },
    presetCaption: {
      ko: String.raw`\(n=8\): \(x_8 = 2^{-8} \approx 0.0039\) — 반복값이 빠져 있는 극한 \(0\)으로 빨려듭니다.`,
      en: String.raw`\(n=8\): \(x_8 = 2^{-8} \approx 0.0039\) — the iterates drain toward the missing limit \(0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(|T(x) - T(y)| = \left|\frac{x}{2} - \frac{y}{2}\right| = \frac12|x - y|\)이므로 \(T\)는 \(q = 1/2\)인 수축사상입니다. 또한 \(x \in (0,1]\)이면 \(T(x) = x/2 \in (0, 1/2] \subset (0,1]\)이므로 \(T\)는 \((0,1]\)을 자기 자신으로 보냅니다.`,
          en: String.raw`Since \(|T(x) - T(y)| = \left|\frac{x}{2} - \frac{y}{2}\right| = \frac12|x - y|\), \(T\) is a contraction with \(q = 1/2\). And \(x \in (0,1]\) gives \(T(x) = x/2 \in (0, 1/2] \subset (0,1]\), so \(T\) maps \((0,1]\) into itself.`,
        },
      },
      {
        text: {
          ko: String.raw`고정점은 \(x = x/2\), 즉 \(x = 0\)을 만족해야 하지만 \(0 \notin (0,1]\)입니다. 따라서 \(T\)는 \((0,1]\) 안에 고정점을 하나도 갖지 않습니다.`,
          en: String.raw`A fixed point would satisfy \(x = x/2\), i.e. \(x = 0\), but \(0 \notin (0,1]\). Hence \(T\) has no fixed point in \((0,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_0 = 1\)에서 시작하면 \(x_n = 2^{-n}\): \(1, \frac12, \frac14, \dots\)입니다. 이 수열은 첫 번째 문제의 기하 상한을 만족하므로 코시수열이지만, 그 극한 \(0\)은 공간 밖에 있습니다. 완비성이 빠지면 코시수열이 "도착할 곳"을 잃고 정리 전체가 무너집니다 — \(n = 8\)에서 \(x_8 = \frac{1}{256} \approx 0.0039\)로, 캡션의 수치와 일치합니다.`,
          en: String.raw`Starting from \(x_0 = 1\) gives \(x_n = 2^{-n}\): \(1, \frac12, \frac14, \dots\). This sequence satisfies the geometric bound from the first problem, so it is Cauchy — but its limit \(0\) lies outside the space. Without completeness a Cauchy sequence loses its "place to land" and the whole theorem collapses; at \(n = 8\), \(x_8 = \frac{1}{256} \approx 0.0039\), matching the caption's figure.`,
        },
      },
    ],
  },
  {
    id: 'error-bound-uniqueness',
    statement: {
      ko: String.raw`완비 거리공간에서 수축사상의 고정점 \(x^*\)에 대해 오차 상한 \(d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)\)을 유도하고, 고정점이 최대 하나임을 증명하세요.`,
      en: String.raw`On a complete metric space, derive the error bound \(d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)\) for the fixed point \(x^*\) of a contraction, and prove there is at most one fixed point.`,
    },
    display: [
      String.raw`d(x_n,x^*) = \lim_{m \to \infty} d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_1,x_0)`,
      String.raw`|x^* - y^*| = |Tx^* - Ty^*| \le q|x^* - y^*| \Rightarrow x^* = y^*`,
    ],
    preset: { map: 'affine', n: 8, x0: 1 },
    presetCaption: {
      ko: String.raw`\(n=8\): \(|x_8 - 2| = 1/256 \approx 0.0039\) — 상한과 정확히 일치합니다.`,
      en: String.raw`\(n=8\): \(|x_8 - 2| = 1/256 \approx 0.0039\) — matches the bound exactly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`완비성에 의해 코시수열 \((x_n)\)은 공간 안의 점 \(x^*\)로 수렴합니다. 수축사상은 \(|Tx - Ty| \le q|x - y|\)이므로 연속이고, 따라서 \(Tx^* = T(\lim x_n) = \lim Tx_n = \lim x_{n+1} = x^*\) — \(x^*\)는 고정점입니다.`,
          en: String.raw`Completeness makes the Cauchy sequence \((x_n)\) converge to a point \(x^*\) inside the space. A contraction is continuous since \(|Tx - Ty| \le q|x - y|\), so \(Tx^* = T(\lim x_n) = \lim Tx_n = \lim x_{n+1} = x^*\) — \(x^*\) is a fixed point.`,
        },
      },
      {
        text: {
          ko: String.raw`첫 번째 문제의 부등식에서 \(m \to \infty\)으로 보내면 (\(d(x_1,x_0) = d(x_0,x_1)\)이므로) 오차 상한 \(d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)\)을 얻습니다. \(T(x) = x/2 + 1\), \(q = 1/2\), \(x_0 = 1\)이면 상한은 \(\frac{(1/2)^8}{1/2}\cdot\frac12 = \frac{1}{256} \approx 0.0039\)이고, 실제 반복값 \(x_8 = 2 - 2^{-8} = 1.99609375\)는 오차 \(|x_8 - 2| = \frac{1}{256}\)으로 상한과 정확히 일치합니다.`,
          en: String.raw`Letting \(m \to \infty\) in the first problem's estimate (and \(d(x_1,x_0) = d(x_0,x_1)\)) gives the error bound \(d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)\). For \(T(x) = x/2 + 1\) with \(q = 1/2\) and \(x_0 = 1\), the bound is \(\frac{(1/2)^8}{1/2}\cdot\frac12 = \frac{1}{256} \approx 0.0039\), and the actual iterate \(x_8 = 2 - 2^{-8} = 1.99609375\) has error \(|x_8 - 2| = \frac{1}{256}\), matching the bound exactly.`,
        },
      },
      {
        text: {
          ko: String.raw`유일성: \(x^*\), \(y^*\)가 모두 고정점이라 가정하면 \(|x^* - y^*| = |Tx^* - Ty^*| \le q|x^* - y^*|\)입니다. \(q < 1\)이므로 \(|x^* - y^*| = 0\), 즉 \(x^* = y^*\)를 강제합니다.`,
          en: String.raw`Uniqueness: if \(x^*\) and \(y^*\) are both fixed points, \(|x^* - y^*| = |Tx^* - Ty^*| \le q|x^* - y^*|\). Since \(q < 1\), this forces \(|x^* - y^*| = 0\), i.e. \(x^* = y^*\).`,
        },
      },
    ],
  },
];
