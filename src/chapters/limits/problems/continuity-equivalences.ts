import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the continuity-equivalences scene
 * (Tao, Analysis I, Prop 9.4.7). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/continuity-equivalences.test.ts):
 *   square, eps = 0.3: maxDelta = 0.54 (analytic sqrt(0.3) = 0.5477...);
 *   jump, eps = 0.3: maxDelta = 0 (no delta works);
 *   square, eps = 0.3: preimage of (f(0)-eps, f(0)+eps) contains (-0.5, 0.5);
 *   jump, eps = 0.3: V = (0.7, 1.3), no interval around 0 in f^{-1}(V).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'epsdelta-implies-sequential',
    statement: {
      ko: String.raw`\(f\)가 \(x_0\)에서 \(\varepsilon\)-\(\delta\) 연속이면 수열 연속(sequence continuity)도 성립함을 완전히 증명하세요: \(x_n \to x_0\)인 모든 수열에 대해 \(f(x_n) \to f(x_0)\).`,
      en: String.raw`Prove completely that \(\varepsilon\)-\(\delta\) continuity of \(f\) at \(x_0\) implies sequential continuity: \(f(x_n) \to f(x_0)\) for every sequence \(x_n \to x_0\).`,
    },
    display: [
      String.raw`\forall\varepsilon>0\ \exists\delta>0:\ \lvert x-x_0\rvert<\delta \Rightarrow \lvert f(x)-f(x_0)\rvert<\varepsilon`,
      String.raw`x_n \to x_0 \ \Longrightarrow\  f(x_n) \to f(x_0)`,
    ],
    preset: { fn: 'square', view: 'epsdelta', eps: 0.3 },
    presetCaption: {
      ko: String.raw`\(f(x) = x^2\), \(\varepsilon = 0.3\): \(\delta_{\max} \approx 0.54\) (\(=\sqrt{0.3}\))가 모든 \(x\)를 띠 안에 가둡니다 — 이 \(\delta\)가 아래 증명의 핵심입니다.`,
      en: String.raw`\(f(x) = x^2\), \(\varepsilon = 0.3\): \(\delta_{\max} \approx 0.54\) (\(=\sqrt{0.3}\)) keeps every \(x\) inside the band — this \(\delta\) is the heart of the proof below.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \(x_0\)에서 \(\varepsilon\)-\(\delta\) 연속이라 가정합니다: 임의의 \(\varepsilon > 0\)에 대해, \(|x - x_0| < \delta\)이면 \(|f(x) - f(x_0)| < \varepsilon\)인 \(\delta > 0\)이 존재합니다.`,
          en: String.raw`Assume \(f\) is \(\varepsilon\)-\(\delta\) continuous at \(x_0\): for every \(\varepsilon > 0\) there is \(\delta > 0\) with \(|x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_n \to x_0\)인 수열과 \(\varepsilon > 0\)을 잡습니다. 이 \(\varepsilon\)에 대한 \(\delta\)를 위에서 가져오면, \(x_n \to x_0\)이므로 \(n > N \Rightarrow |x_n - x_0| < \delta\)인 \(N\)이 존재합니다.`,
          en: String.raw`Take a sequence \(x_n \to x_0\) and \(\varepsilon > 0\). Fetch the \(\delta\) for this \(\varepsilon\) from above; since \(x_n \to x_0\), there is \(N\) with \(n > N \Rightarrow |x_n - x_0| < \delta\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n > N\)인 모든 \(n\)에 대해 \(|f(x_n) - f(x_0)| < \varepsilon\)이므로, \(f(x_n) \to f(x_0)\)입니다. \(\varepsilon > 0\)이 임의였으므로 수열 연속이 성립합니다.`,
          en: String.raw`For all \(n > N\), \(|f(x_n) - f(x_0)| < \varepsilon\), so \(f(x_n) \to f(x_0)\). Since \(\varepsilon > 0\) was arbitrary, sequential continuity holds.`,
        },
      },
    ],
  },
  {
    id: 'sequential-implies-epsdelta',
    statement: {
      ko: String.raw`대우로 증명하세요: \(f\)가 \(x_0\)에서 \(\varepsilon\)-\(\delta\) 연속이 아니면, \(x_n \to x_0\)이지만 \(f(x_n) \not\to f(x_0)\)인 수열 \((x_n)\)을 만들 수 있습니다.`,
      en: String.raw`Prove by contrapositive: if \(f\) is not \(\varepsilon\)-\(\delta\) continuous at \(x_0\), one can build a sequence \((x_n)\) with \(x_n \to x_0\) but \(f(x_n) \not\to f(x_0)\).`,
    },
    display: [
      String.raw`\exists\varepsilon_0>0\ \forall\delta>0\ \exists x:\ \lvert x-x_0\rvert<\delta \text{ and } \lvert f(x)-f(x_0)\rvert \ge \varepsilon_0`,
      String.raw`\lvert x_n - x_0\rvert < \tfrac{1}{n}, \qquad \lvert f(x_n) - f(x_0)\rvert \ge \varepsilon_0`,
    ],
    preset: { fn: 'jump', view: 'sequential', eps: 0.3 },
    presetCaption: {
      ko: String.raw`점프 함수, \(\varepsilon = 0.3\): \(x_n = (-1)^n/n \to 0\)이지만 \(f(x_n)\)은 \(0\)과 \(1\) 근처를 오가며 \(f(0) = 1\)로 모이지 않습니다 — 아래 증명이 이 수열을 일반 형태로 만듭니다.`,
      en: String.raw`The jump function, \(\varepsilon = 0.3\): \(x_n = (-1)^n/n \to 0\), yet \(f(x_n)\) bounces near \(0\) and \(1\) and never settles at \(f(0) = 1\) — the proof below builds this sequence in general form.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \(x_0\)에서 \(\varepsilon\)-\(\delta\) 연속이 아니라고 가정합니다. 정의의 부정: 어떤 \(\varepsilon_0 > 0\)이 존재하여, 모든 \(\delta > 0\)에 대해 \(|x - x_0| < \delta\)이면서 \(|f(x) - f(x_0)| \ge \varepsilon_0\)인 \(x\)가 존재합니다.`,
          en: String.raw`Assume \(f\) is not \(\varepsilon\)-\(\delta\) continuous at \(x_0\). Negating the definition: some \(\varepsilon_0 > 0\) exists such that for every \(\delta > 0\) there is \(x\) with \(|x - x_0| < \delta\) and \(|f(x) - f(x_0)| \ge \varepsilon_0\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 자연수 \(n\)에 대해 \(\delta = 1/n\)을 대입해 \(x_n\)을 선택합니다: \(|x_n - x_0| < 1/n\)이고 \(|f(x_n) - f(x_0)| \ge \varepsilon_0\).`,
          en: String.raw`For each natural \(n\), plug in \(\delta = 1/n\) and pick \(x_n\): \(|x_n - x_0| < 1/n\) and \(|f(x_n) - f(x_0)| \ge \varepsilon_0\).`,
        },
      },
      {
        text: {
          ko: String.raw`조임 정리로 \(|x_n - x_0| < 1/n \to 0\)이므로 \(x_n \to x_0\)입니다.

그러나 모든 \(n\)에 대해 \(|f(x_n) - f(x_0)| \ge \varepsilon_0\)이므로 \(f(x_n) \not\to f(x_0)\)입니다 — \(f(x_n) \to f(x_0)\)라면 \(|f(x_n) - f(x_0)| < \varepsilon_0/2\)인 \(n\)이 있어야 하는데 모순입니다.

따라서 수열 연속이 깨집니다.`,
          en: String.raw`By the squeeze theorem, \(|x_n - x_0| < 1/n \to 0\), so \(x_n \to x_0\).

But \(|f(x_n) - f(x_0)| \ge \varepsilon_0\) for every \(n\), so \(f(x_n) \not\to f(x_0)\) — if \(f(x_n) \to f(x_0)\) there would have to be \(n\) with \(|f(x_n) - f(x_0)| < \varepsilon_0/2\), a contradiction. Hence sequential continuity fails.`,
        },
      },
    ],
  },
  {
    id: 'preimage-open-sets',
    statement: {
      ko: String.raw`\(f\)가 정의역 전체에서 연속일 때, 그리고 그때만, 모든 열린 집합의 역상 \(f^{-1}(V)\)가 열려 있음을 양방향 모두 완전히 증명하세요.`,
      en: String.raw`Prove completely in both directions that \(f\) is continuous on its whole domain if and only if the preimage \(f^{-1}(V)\) of every open set is open.`,
    },
    display: [
      String.raw`f \text{ continuous} \iff f^{-1}(V) \text{ open for every open } V`,
      String.raw`V = (f(x_0)-\varepsilon,\ f(x_0)+\varepsilon), \qquad U = f^{-1}(V) \ni x_0 \text{ open}`,
    ],
    preset: { fn: 'jump', view: 'preimage', eps: 0.3 },
    presetCaption: {
      ko: String.raw`점프 함수, \(\varepsilon = 0.3\): \(V = (0.7, 1.3)\)의 역상은 \(0\) 주변 구간을 포함하지 않습니다 (왼쪽에서는 \(|x| \approx 0.84\) 바깥만 해당) — 열린 집합의 역상이 열리지 않은 것입니다.`,
      en: String.raw`The jump function, \(\varepsilon = 0.3\): the preimage of \(V = (0.7, 1.3)\) contains no interval around \(0\) (on the left only \(|x| \approx 0.84\) and beyond qualifies) — the preimage of an open set is not open.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) \(f\)가 연속이고 \(V\)가 열려 있다고 둡니다. \(x_0 \in f^{-1}(V)\)라 하면 \(f(x_0) \in V\)이고, \(V\)가 열려 있으므로 \((f(x_0)-\varepsilon, f(x_0)+\varepsilon) \subset V\)인 \(\varepsilon > 0\)이 존재합니다.`,
          en: String.raw`(\(\Rightarrow\)) Let \(f\) be continuous and \(V\) open. Take \(x_0 \in f^{-1}(V)\); then \(f(x_0) \in V\), and since \(V\) is open there is \(\varepsilon > 0\) with \((f(x_0)-\varepsilon, f(x_0)+\varepsilon) \subset V\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_0\)에서의 연속성에 의해 \(|x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon\)인 \(\delta > 0\)이 존재합니다.

그러면 \((x_0-\delta, x_0+\delta)\)의 모든 \(x\)는 \(f(x) \in (f(x_0)-\varepsilon, f(x_0)+\varepsilon) \subset V\)를 만족하므로 \(x \in f^{-1}(V)\)입니다.

즉 \(x_0\)은 \(f^{-1}(V)\)의 내점이고, \(x_0\)이 임의였으므로 \(f^{-1}(V)\)는 열려 있습니다.`,
          en: String.raw`Continuity at \(x_0\) gives \(\delta > 0\) with \(|x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon\).

Then every \(x\) in \((x_0-\delta, x_0+\delta)\) satisfies \(f(x) \in (f(x_0)-\varepsilon, f(x_0)+\varepsilon) \subset V\), so \(x \in f^{-1}(V)\).

Thus \(x_0\) is an interior point of \(f^{-1}(V)\); \(x_0\) was arbitrary, so \(f^{-1}(V)\) is open.`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) 모든 열린 집합의 역상이 열려 있다고 둡니다.

\(x_0\)와 \(\varepsilon > 0\)에 대해 \(V = (f(x_0)-\varepsilon, f(x_0)+\varepsilon)\)은 열린 집합이므로 \(U = f^{-1}(V)\)는 열려 있고 \(x_0 \in U\)입니다.

따라서 \((x_0-\delta, x_0+\delta) \subset U\)인 \(\delta > 0\)이 존재하고, \(|x - x_0| < \delta\)이면 \(f(x) \in V\), 즉 \(|f(x) - f(x_0)| < \varepsilon\)입니다.

\(x_0\)가 임의였으므로 \(f\)는 연속입니다.`,
          en: String.raw`(\(\Leftarrow\)) Assume the preimage of every open set is open.

For \(x_0\) and \(\varepsilon > 0\), \(V = (f(x_0)-\varepsilon, f(x_0)+\varepsilon)\) is open, so \(U = f^{-1}(V)\) is open with \(x_0 \in U\).

Hence some \(\delta > 0\) has \((x_0-\delta, x_0+\delta) \subset U\), and \(|x - x_0| < \delta\) gives \(f(x) \in V\), i.e. \(|f(x) - f(x_0)| < \varepsilon\).

Since \(x_0\) was arbitrary, \(f\) is continuous.`,
        },
      },
    ],
  },
];
