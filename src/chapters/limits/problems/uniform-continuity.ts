import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'lipschitz-uniform',
    statement: {
      ko: String.raw`립시츠 함수(\(\lvert f(x)-f(y)\rvert \leq L\lvert x-y\rvert\)인 \(L\)이 존재)는 균등연속임을 증명하세요.`,
      en: String.raw`Prove a Lipschitz function (some \(L\) with \(\lvert f(x)-f(y)\rvert \leq L\lvert x-y\rvert\)) is uniformly continuous.`,
    },
    display: [String.raw`\delta = \varepsilon / L`],
    preset: { fn: 'linear', x: 2, eps: 0.5 },
    presetCaption: {
      ko: String.raw`\(f(x) = 2x\), \(x = 2\), \(\varepsilon = 0.5\) — 상수 \(L = 2\)인 립시츠 함수.`,
      en: String.raw`\(f(x) = 2x\), \(x = 2\), \(\varepsilon = 0.5\) — a Lipschitz function with \(L = 2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 상수 \(L \geq 0\)에 대해 립시츠라 하자. \(L = 0\)이면 \(f\)는 상수함수이므로 아무 \(\delta > 0\)나 된다. \(L > 0\)이라 하자.`,
          en: String.raw`Let \(f\) be Lipschitz with constant \(L \geq 0\). If \(L = 0\), then \(f\) is constant and any \(\delta > 0\) works. Assume \(L > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\delta = \varepsilon/L\)이라 둔다 — \(\delta\)는 \(\varepsilon\)에만 의존하고 \(x\)와는 무관하다.`,
          en: String.raw`Given \(\varepsilon > 0\), put \(\delta = \varepsilon/L\) — \(\delta\) depends on \(\varepsilon\) alone, never on \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\lvert x - y\rvert < \delta\)인 임의의 \(x, y\)에 대해 \(\lvert f(x) - f(y)\rvert \leq L\lvert x - y\rvert < L\delta = \varepsilon\)이다.`,
          en: String.raw`For any \(x, y\) with \(\lvert x - y\rvert < \delta\) we have \(\lvert f(x) - f(y)\rvert \leq L\lvert x - y\rvert < L\delta = \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 같은 \(\delta\)가 모든 점 \(x\)에서 통하므로 \(f\)는 균등연속이다.`,
          en: String.raw`Hence the same \(\delta\) works at every point \(x\), so \(f\) is uniformly continuous.`,
        },
      },
    ],
  },
  {
    id: 'square-interval',
    statement: {
      ko: String.raw`\(f(x)=x^2\)이 \([0,1]\)에서 균등연속임을 증명하세요.`,
      en: String.raw`Prove \(f(x)=x^2\) is uniformly continuous on \([0,1]\).`,
    },
    display: [String.raw`\lvert x^2-y^2\rvert = \lvert x-y\rvert\lvert x+y\rvert \leq 2\lvert x-y\rvert`],
    preset: { fn: 'square', x: 0.5, eps: 0.5 },
    presetCaption: {
      ko: String.raw`\(x = 0.5\), \(\varepsilon = 0.5\) — \([0,1]\) 안에서는 \(\delta = \varepsilon/2\) 하나로 충분하다.`,
      en: String.raw`\(x = 0.5\), \(\varepsilon = 0.5\) — on \([0,1]\) the single \(\delta = \varepsilon/2\) suffices.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x, y \in [0,1]\)이라 하자. \(\lvert x^2 - y^2\rvert = \lvert x - y\rvert \lvert x + y\rvert\)이고 \(x + y \leq 2\)이므로 \(\lvert x^2 - y^2\rvert \leq 2\lvert x - y\rvert\)이다 — 즉 \(x^2\)은 \([0,1]\)에서 상수 \(2\)인 립시츠 함수이다.`,
          en: String.raw`Let \(x, y \in [0,1]\). Then \(\lvert x^2 - y^2\rvert = \lvert x - y\rvert \lvert x + y\rvert\), and since \(x + y \leq 2\), we get \(\lvert x^2 - y^2\rvert \leq 2\lvert x - y\rvert\) — i.e. \(x^2\) is Lipschitz on \([0,1]\) with constant \(2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\delta = \varepsilon/2\)라 둔다 — \(x\)에 의존하지 않는다. \(\lvert x - y\rvert < \delta\)이면 \(\lvert x^2 - y^2\rvert \leq 2\lvert x - y\rvert < 2\delta = \varepsilon\)이다.`,
          en: String.raw`Given \(\varepsilon > 0\), put \(\delta = \varepsilon/2\) — independent of \(x\). If \(\lvert x - y\rvert < \delta\), then \(\lvert x^2 - y^2\rvert \leq 2\lvert x - y\rvert < 2\delta = \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f(x) = x^2\)은 \([0,1]\)에서 균등연속이다. — 유계 구간에서는 "기울기 인자" \(\lvert x + y\rvert\)가 제한되므로 하나의 \(\delta\)로 충분하다.`,
          en: String.raw`Hence \(f(x) = x^2\) is uniformly continuous on \([0,1]\). — on a bounded interval the "slope factor" \(\lvert x + y\rvert\) is capped, so one \(\delta\) suffices.`,
        },
      },
    ],
  },
  {
    id: 'square-not-uniform',
    statement: {
      ko: String.raw`\(f(x)=x^2\)이 \(\mathbb{R}\)에서 균등연속이 아님을 증명하세요.`,
      en: String.raw`Prove \(f(x)=x^2\) is not uniformly continuous on \(\mathbb{R}\).`,
    },
    display: [String.raw`x_n = n,\quad y_n = n + \delta/2`],
    preset: { fn: 'square', x: 3, eps: 0.5 },
    presetCaption: {
      ko: String.raw`\(x = 3\), \(\varepsilon = 0.5\) — 큰 \(x\)에서는 허용 \(\delta\)가 극히 작아진다.`,
      en: String.raw`\(x = 3\), \(\varepsilon = 0.5\) — at large \(x\) the admissible \(\delta\) shrinks to almost nothing.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon_0 = 1\)이라 하자. \(\delta > 0\)을 임의로 잡는다 — \(\varepsilon_0\)에만 의존하는 \(\delta\)라면 모든 점쌍에서 통해야 한다.`,
          en: String.raw`Take \(\varepsilon_0 = 1\). Let \(\delta > 0\) be arbitrary — a \(\delta\) depending only on \(\varepsilon_0\) would have to work for every pair of points.`,
        },
      },
      {
        text: {
          ko: String.raw`\(1/\delta < n\)인 정수 \(n\)을 잡고 \(x = n\), \(y = n + \delta/2\)라 두자. 그러면 \(\lvert x - y\rvert = \delta/2 < \delta\)이다.`,
          en: String.raw`Choose an integer \(n > 1/\delta\) and put \(x = n\), \(y = n + \delta/2\). Then \(\lvert x - y\rvert = \delta/2 < \delta\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(\lvert x^2 - y^2\rvert = \lvert y - x\rvert \lvert y + x\rvert = \frac{\delta}{2}\left(2n + \frac{\delta}{2}\right) = n\delta + \frac{\delta^2}{4} > 1 = \varepsilon_0\)이다 — \(n > 1/\delta\)이므로 \(n\delta > 1\)이기 때문이다.`,
          en: String.raw`But \(\lvert x^2 - y^2\rvert = \lvert y - x\rvert \lvert y + x\rvert = \frac{\delta}{2}\left(2n + \frac{\delta}{2}\right) = n\delta + \frac{\delta^2}{4} > 1 = \varepsilon_0\), since \(n > 1/\delta\) gives \(n\delta > 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 모든 점쌍에서 통하는 \(\delta\)는 존재하지 않으므로 \(f(x) = x^2\)은 \(\mathbb{R}\)에서 균등연속이 아니다. — 큰 \(x\)에서 필요한 \(\delta\)가 0으로 수렴하기 때문이다.`,
          en: String.raw`Hence no \(\delta\) works for all pairs, so \(f(x) = x^2\) is not uniformly continuous on \(\mathbb{R}\). — the required \(\delta\) tends to \(0\) as \(x\) grows.`,
        },
      },
    ],
  },
];
