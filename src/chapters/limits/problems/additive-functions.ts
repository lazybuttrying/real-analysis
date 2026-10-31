import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the additive-functions scene.
 * Imports nothing except types.
 */
export const additiveFunctionsProblems: readonly ProblemMeta[] = [
  {
    id: 'additive-rational-scaling',
    statement: {
      ko: String.raw`덧셈 함수 \(f(x + y) = f(x) + f(y)\)를 모든 실수에서 만족하는 함수 \(f\)에 대해, 모든 유리수 \(q\)와 모든 실수 \(x\)에서 \(f(qx) = qf(x)\)임을 완전히 증명하세요.`,
      en: String.raw`For a function \(f\) satisfying \(f(x + y) = f(x) + f(y)\) for all reals, prove completely that \(f(qx) = qf(x)\) for every rational \(q\) and every real \(x\).`,
    },
    display: [String.raw`f(qx) = qf(x), \qquad q \in \mathbb{Q}`],
    preset: { t: 1.41 },
    presetCaption: {
      ko: String.raw`유리수 배는 함숫값을 그대로 따라갑니다.`,
      en: String.raw`Rational scaling passes straight through the function.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`자연수 배: \(f(0) = f(0 + 0) = 2f(0)\)이라 \(f(0) = 0\)입니다. 귀납법으로 \(f(nx) = nf(x)\)입니다. 또 \(0 = f(0) = f(x + (-x)) = f(x) + f(-x)\)라 \(f(-x) = -f(x)\)이고, 음의 정수 배도 성립합니다.`,
          en: String.raw`Integer multiples: \(f(0) = f(0 + 0) = 2f(0)\), so \(f(0) = 0\). Induction gives \(f(nx) = nf(x)\) for natural \(n\). Also \(0 = f(0) = f(x + (-x)) = f(x) + f(-x)\), so \(f(-x) = -f(x)\), covering negative integers.`,
        },
      },
      {
        text: {
          ko: String.raw`역수 배: \(n \ge 1\)에 대해 \(f(x) = f\!\left(n \cdot \frac{x}{n}\right) = n f\!\left(\frac{x}{n}\right)\)이므로 \(f\!\left(\frac{x}{n}\right) = \frac{1}{n} f(x)\)입니다.`,
          en: String.raw`Reciprocals: for \(n \ge 1\), \(f(x) = f\!\left(n \cdot \frac{x}{n}\right) = n f\!\left(\frac{x}{n}\right)\), hence \(f\!\left(\frac{x}{n}\right) = \frac{1}{n} f(x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(q = \frac{p}{n}\) 꼴로 합치면 \(f(qx) = p f\!\left(\frac{x}{n}\right) = \frac{p}{n} f(x) = qf(x)\)입니다. 특히 \(x = 1\)이면 \(f(q) = qf(1)\)로, 유리수 위에서는 함수가 완전히 고정됩니다.`,
          en: String.raw`Combining with \(q = \frac{p}{n}\): \(f(qx) = p f\!\left(\frac{x}{n}\right) = \frac{p}{n} f(x) = qf(x)\). With \(x = 1\), \(f(q) = qf(1)\): on the rationals the function is completely pinned.`,
        },
      },
    ],
  },
  {
    id: 'additive-continuous-linear',
    statement: {
      ko: String.raw`덧셈 함수 \(f\)가 단 한 점 \(x_0\)에서 연속이면, \(c = f(1)\)에 대해 모든 실수 \(x\)에서 \(f(x) = cx\)임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that if an additive function \(f\) is continuous at a single point \(x_0\), then \(f(x) = cx\) for every real \(x\), where \(c = f(1)\).`,
    },
    display: [String.raw`f \text{ additive } + \text{continuous at one point} \ \Longrightarrow \ f(x) = cx`],
    preset: { t: 1.41 },
    presetCaption: {
      ko: String.raw`연속성이 자유를 없애 직선만 남깁니다.`,
      en: String.raw`Continuity removes the freedom and leaves only the line.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`연속성이 \(0\)으로 이동합니다: \(f(x_0 + h) - f(x_0) = f(h)\)이므로, \(h \to 0\)일 때 왼쪽이 \(0\)으로 가는 것이 \(x_0\)에서의 연속성이고, 이는 곧 \(f(h) \to 0 = f(0)\), 즉 \(0\)에서의 연속성입니다. 같은 식으로 모든 점에서 연속이 됩니다.`,
          en: String.raw`Continuity moves to \(0\): \(f(x_0 + h) - f(x_0) = f(h)\), so the left side tending to \(0\) as \(h \to 0\) — continuity at \(x_0\) — says exactly \(f(h) \to 0 = f(0)\), continuity at \(0\). The same identity gives continuity everywhere.`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 실수 \(x\)에 수렴하는 유리수 수열 \(q_n \to x\)를 잡습니다. 앞 문제로 \(f(q_n) = cq_n\)이고, 연속성으로 \(f(q_n) \to f(x)\)입니다. 한편 \(cq_n \to cx\)입니다. 극한은 유일하므로 \(f(x) = cx\)입니다.`,
          en: String.raw`Take a rational sequence \(q_n \to x\) for an arbitrary real \(x\). The previous problem gives \(f(q_n) = cq_n\), and continuity gives \(f(q_n) \to f(x)\). But \(cq_n \to cx\). Limits are unique, so \(f(x) = cx\).`,
        },
      },
    ],
  },
  {
    id: 'additive-bounded-linear',
    statement: {
      ko: String.raw`덧셈 함수 \(f\)가 어떤 구간 \((-\delta, \delta)\)에서 유계이면 \(f\)는 연속이고, 따라서 \(f(x) = cx\) 꼴임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that if an additive function \(f\) is bounded on some interval \((-\delta, \delta)\), then \(f\) is continuous, and hence of the form \(f(x) = cx\).`,
    },
    display: [String.raw`|f| \le M \text{ on } (-\delta, \delta) \ \Longrightarrow \ f(x) = cx`],
    preset: { t: 0.5 },
    presetCaption: {
      ko: String.raw`작은 구간에서의 유계만으로 전체가 직선이 됩니다.`,
      en: String.raw`Boundedness on one small interval forces the whole graph to be a line.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(|f| \le M\)이라 하자. \(|h| < \frac{\delta}{n}\)이면 \(nh \in (-\delta, \delta)\)라 \(|f(nh)| \le M\)입니다. 그런데 \(f(nh) = nf(h)\)이므로 \(|f(h)| \le \frac{M}{n}\)입니다.`,
          en: String.raw`Say \(|f| \le M\) on the interval. If \(|h| < \frac{\delta}{n}\) then \(nh \in (-\delta, \delta)\), so \(|f(nh)| \le M\). But \(f(nh) = nf(h)\), hence \(|f(h)| \le \frac{M}{n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\frac{M}{n} < \varepsilon\)인 \(n\)을 골라 \(\eta = \frac{\delta}{n}\)으로 둡니다. \(|h| < \eta\)이면 \(|f(h) - f(0)| = |f(h)| \le \frac{M}{n} < \varepsilon\)라 \(f\)는 \(0\)에서 연속입니다.`,
          en: String.raw`Given \(\varepsilon > 0\), choose \(n\) with \(\frac{M}{n} < \varepsilon\) and set \(\eta = \frac{\delta}{n}\). Then \(|h| < \eta\) gives \(|f(h) - f(0)| = |f(h)| \le \frac{M}{n} < \varepsilon\): \(f\) is continuous at \(0\).`,
        },
      },
      {
        text: {
          ko: String.raw`앞 문제에 의해 \(f(x) = cx\)입니다. 즉 조금이라도 얌전하면 괴물 같은 덧셈 함수는 존재할 수 없습니다.`,
          en: String.raw`By the previous problem, \(f(x) = cx\). Even a whisper of good behaviour rules out the monstrous additive functions.`,
        },
      },
    ],
  },
];
