import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Weierstrass M-test scene.
 * Imports nothing except types. Every number below was verified:
 * tailBound(8) = pi^2/6 - sum_{k=1}^{8} 1/k^2 ~= 0.1175,
 * sum_{k=1}^{8} 1/k^2 ~= 1.5274, pi^2/6 ~= 1.6449.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'm-test-sine',
    statement: {
      ko: String.raw`모든 실수 \(x\)에 대해 급수 \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n^2}\)가 균등수렴함을 M-판정법으로 보이세요.`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n^2}\) converges uniformly for every real \(x\), by the M-test.`,
    },
    display: [
      String.raw`\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2} =: M_n, \qquad \sum_{n=1}^{\infty} M_n = \frac{\pi^2}{6}`,
    ],
    preset: { terms: 8 },
    presetCaption: {
      ko: String.raw`\(N=8\): 모든 \(x\)에서 오차 \(\le \sum_{k>8} 1/k^2 \approx 0.1175\) — 띠가 전체 구간에서 한꺼번에 좁아집니다.`,
      en: String.raw`\(N=8\): error \(\le \sum_{k>8} 1/k^2 \approx 0.1175\) for every \(x\) — the band tightens across the whole interval at once.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(n\)과 모든 \(x\)에 대해 \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2} =: M_n\)입니다 (\(|\sin(nx)| \le 1\)).`,
          en: String.raw`For each \(n\) and every \(x\), \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2} =: M_n\) (since \(|\sin(nx)| \le 1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\sum_{n=1}^{\infty} M_n = \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\)입니다 (바젤 문제).`,
          en: String.raw`\(\sum_{n=1}^{\infty} M_n = \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\) (the Basel problem).`,
        },
      },
      {
        text: {
          ko: String.raw`M-판정법에 따라 \(\sum \frac{\sin(nx)}{n^2}\)는 \(\mathbb{R}\) 전체에서 균등수렴합니다. \(N = 8\)에서는 꼬리 경계 \(\sum_{k>8} \frac{1}{k^2} = \frac{\pi^2}{6} - \sum_{k=1}^{8} \frac{1}{k^2} \approx 1.6449 - 1.5274 = 0.1175\)가 모든 \(x\)에 동시에 통합니다 — 캡션의 수치와 일치합니다.`,
          en: String.raw`By the M-test, \(\sum \frac{\sin(nx)}{n^2}\) converges uniformly on all of \(\mathbb{R}\). At \(N = 8\) the tail bound \(\sum_{k>8} \frac{1}{k^2} = \frac{\pi^2}{6} - \sum_{k=1}^{8} \frac{1}{k^2} \approx 1.6449 - 1.5274 = 0.1175\) works for every \(x\) at once — matching the caption's figure.`,
        },
      },
    ],
  },
  {
    id: 'm-test-exponential',
    statement: {
      ko: String.raw`\(\sum_{n=1}^{\infty} \frac{e^{-nx}}{n^2}\)가 \([0, \infty)\)에서 균등수렴함을 M-판정법으로 보이세요.`,
      en: String.raw`Show \(\sum_{n=1}^{\infty} \frac{e^{-nx}}{n^2}\) converges uniformly on \([0, \infty)\), by the M-test.`,
    },
    display: [
      String.raw`x \ge 0 \Rightarrow 0 < e^{-nx} \le 1, \qquad \left|\frac{e^{-nx}}{n^2}\right| \le \frac{1}{n^2} =: M_n`,
    ],
    preset: { terms: 8 },
    presetCaption: {
      ko: String.raw`\(N=8\): 구간 \([0, \infty)\) 전체에서 오차 \(\le \sum_{k>8} 1/k^2 \approx 0.1175\).`,
      en: String.raw`\(N=8\): error \(\le \sum_{k>8} 1/k^2 \approx 0.1175\) across all of \([0, \infty)\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x \ge 0\)일 때 \(-nx \le 0\)이므로 \(0 < e^{-nx} \le 1\)입니다. 따라서 \(\left|\frac{e^{-nx}}{n^2}\right| = \frac{e^{-nx}}{n^2} \le \frac{1}{n^2} =: M_n\)입니다.`,
          en: String.raw`For \(x \ge 0\), \(-nx \le 0\) gives \(0 < e^{-nx} \le 1\), so \(\left|\frac{e^{-nx}}{n^2}\right| = \frac{e^{-nx}}{n^2} \le \frac{1}{n^2} =: M_n\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\sum_{n=1}^{\infty} M_n = \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\)이므로, M-판정법으로 급수는 \([0, \infty)\)에서 균등수렴합니다.`,
          en: String.raw`Since \(\sum_{n=1}^{\infty} M_n = \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\), the M-test gives uniform convergence on \([0, \infty)\).`,
        },
      },
      {
        text: {
          ko: String.raw`마찬가지로 \(N = 8\)에서 꼬리 경계는 \(\frac{\pi^2}{6} - \sum_{k=1}^{8} \frac{1}{k^2} \approx 0.1175\)이며, 이는 \(x \ge 0\)인 모든 \(x\)에 동시에 적용됩니다.`,
          en: String.raw`Likewise, at \(N = 8\) the tail bound is \(\frac{\pi^2}{6} - \sum_{k=1}^{8} \frac{1}{k^2} \approx 0.1175\), applying simultaneously to every \(x \ge 0\).`,
        },
      },
    ],
  },
  {
    id: 'm-test-uniform-limit-continuous',
    statement: {
      ko: String.raw`각 \(f_n\)이 \(x_0\)에서 연속이고 \(f_n \to f\)가 균등수렴이면, \(f\)도 \(x_0\)에서 연속임을 증명하세요 (3-\(\varepsilon\) 논증).`,
      en: String.raw`Prove that if each \(f_n\) is continuous at \(x_0\) and \(f_n \to f\) uniformly, then \(f\) is continuous at \(x_0\) (the 3-\(\varepsilon\) argument).`,
    },
    display: [
      String.raw`|f(x)-f(x_0)| \le |f(x)-f_N(x)| + |f_N(x)-f_N(x_0)| + |f_N(x_0)-f(x_0)|`,
    ],
    preset: { terms: 8 },
    presetCaption: {
      ko: String.raw`\(N=8\): 부분합이 \(\pm 0.1175\) 밴드 안에서 한계함수에 균등하게 붙어 있습니다.`,
      en: String.raw`\(N=8\): the partial sum hugs the limit function uniformly inside the \(\pm 0.1175\) band.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어졌다고 하자. 균등수렴이므로 모든 \(x\)에 대해 \(|f(x) - f_N(x)| < \frac{\varepsilon}{3}\)인 \(N\)이 존재한다.`,
          en: String.raw`Let \(\varepsilon > 0\). Uniform convergence gives an \(N\) with \(|f(x) - f_N(x)| < \frac{\varepsilon}{3}\) for every \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f_N\)은 \(x_0\)에서 연속이므로, \(|x - x_0| < \delta\)일 때 \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\)이 되는 \(\delta > 0\)이 존재한다.`,
          en: String.raw`Since \(f_N\) is continuous at \(x_0\), there is \(\delta > 0\) such that \(|x - x_0| < \delta\) implies \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|x - x_0| < \delta\)이면 삼각부등식으로 \(|f(x) - f(x_0)| \le |f(x)-f_N(x)| + |f_N(x)-f_N(x_0)| + |f_N(x_0)-f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\). 따라서 \(f\)는 \(x_0\)에서 연속이다.`,
          en: String.raw`If \(|x - x_0| < \delta\), the triangle inequality gives \(|f(x) - f(x_0)| \le |f(x)-f_N(x)| + |f_N(x)-f_N(x_0)| + |f_N(x_0)-f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\). Hence \(f\) is continuous at \(x_0\).`,
        },
      },
    ],
  },
];
