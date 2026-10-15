import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the power-series scene.
 * Imports nothing except types.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'exp-radius',
    statement: {
      ko: String.raw`\(\sum_{n=0}^{\infty} x^n/n!\)의 수렴반경이 \(\infty\)임을 비율 판정법으로 증명하세요.`,
      en: String.raw`Prove by the ratio test that \(\sum_{n=0}^{\infty} x^n/n!\) has radius of convergence \(\infty\).`,
    },
    display: [String.raw`\left\lvert\frac{a_{n+1}}{a_n}\right\rvert = \frac{1}{n+1} \to 0`],
    preset: { series: 'exp', x: 2, n: 20 },
    presetCaption: {
      ko: String.raw`\(x = 2\), \(N = 20\) — 항이 급격히 작아지며 \(S_{20}(2) \approx e^2\)에 모입니다.`,
      en: String.raw`\(x = 2\), \(N = 20\) — the terms shrink fast and \(S_{20}(2) \approx e^2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`항을 \(t_n = x^n/n!\)이라 두자. \(x \ne 0\)일 때 이웃한 항의 비율은 \(\left\lvert \frac{t_{n+1}}{t_n} \right\rvert = \frac{\lvert x\rvert}{n+1}\)이다.`,
          en: String.raw`Put \(t_n = x^n/n!\). For \(x \ne 0\) the ratio of consecutive terms is \(\left\lvert \frac{t_{n+1}}{t_n} \right\rvert = \frac{\lvert x\rvert}{n+1}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{\lvert x\rvert}{n+1} \to 0 < 1\)이므로, 비율 판정법으로 모든 \(x \ne 0\)에 대해 \(\sum \lvert t_n\rvert\)이 수렴한다. 즉 급수는 절대 수렴한다.`,
          en: String.raw`Since \(\frac{\lvert x\rvert}{n+1} \to 0 < 1\), the ratio test gives convergence of \(\sum \lvert t_n\rvert\) for every \(x \ne 0\): the series converges absolutely.`,
        },
        display: [String.raw`\left\lvert\frac{t_{n+1}}{t_n}\right\rvert = \frac{\lvert x\rvert}{n+1} \longrightarrow 0 < 1`],
      },
      {
        text: {
          ko: String.raw`\(x = 0\)에서는 급수가 \(1 + 0 + 0 + \cdots = 1\)이 되어 수렴한다.`,
          en: String.raw`At \(x = 0\) the series is \(1 + 0 + 0 + \cdots = 1\), which converges.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 급수는 모든 실수 \(x\)에서 절대 수렴하므로 수렴반경은 \(R = \infty\)이다. (Cauchy–Hadamard: \(\frac{1}{R} = \limsup \lvert 1/n!\rvert^{1/n} = 0\).)`,
          en: String.raw`Hence the series converges absolutely for every real \(x\), so the radius of convergence is \(R = \infty\). (Cauchy–Hadamard: \(\frac{1}{R} = \limsup \lvert 1/n!\rvert^{1/n} = 0\).)`,
        },
      },
    ],
  },
  {
    id: 'factorial-radius',
    statement: {
      ko: String.raw`\(\sum_{n=0}^{\infty} n!\,x^n\)의 수렴반경이 \(0\)임을 증명하세요.`,
      en: String.raw`Prove \(\sum_{n=0}^{\infty} n!\,x^n\) has radius of convergence \(0\).`,
    },
    display: [String.raw`\left\lvert\frac{(n+1)!\,x^{n+1}}{n!\,x^n}\right\rvert = (n+1)\lvert x\rvert \to \infty`],
    preset: { series: 'factorial', x: 0.5, n: 10 },
    presetCaption: {
      ko: String.raw`\(x = 0.5\), \(N = 10\) — 항이 커지기만 하며 부분합이 폭발합니다.`,
      en: String.raw`\(x = 0.5\), \(N = 10\) — the terms only grow, and the partial sums blow up.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`항을 \(t_n = n!\,x^n\)이라 두자. \(x \ne 0\)일 때 \(\left\lvert \frac{t_{n+1}}{t_n} \right\rvert = (n+1)\lvert x\rvert \to \infty\)이다.`,
          en: String.raw`Put \(t_n = n!\,x^n\). For \(x \ne 0\) we have \(\left\lvert \frac{t_{n+1}}{t_n} \right\rvert = (n+1)\lvert x\rvert \to \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`특히 \(n\)이 크면 \(\lvert t_{n+1}\rvert \ge 2\lvert t_n\rvert\)이므로 \(\lvert t_n\rvert\)은 \(0\)으로 가지 못하고 오히려 무한대로 커진다. 따라서 항이 \(0\)으로 가지 않으므로 급수는 발산한다(발산 판정법).`,
          en: String.raw`For large \(n\) we get \(\lvert t_{n+1}\rvert \ge 2\lvert t_n\rvert\), so \(\lvert t_n\rvert\) cannot tend to \(0\) and in fact grows without bound. Hence the series diverges by the divergence test.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x = 0\)에서는 급수가 \(1 + 0 + 0 + \cdots = 1\)이 되어 수렴한다.`,
          en: String.raw`At \(x = 0\) the series is \(1 + 0 + 0 + \cdots = 1\), which converges.`,
        },
      },
      {
        text: {
          ko: String.raw`급수는 \(x = 0\)에서만 수렴하므로 수렴반경은 \(R = 0\)이다.`,
          en: String.raw`The series converges only at \(x = 0\), so the radius of convergence is \(R = 0\).`,
        },
      },
    ],
  },
  {
    id: 'geom-endpoints',
    statement: {
      ko: String.raw`\(\sum_{n=0}^{\infty} x^n\)의 수렴반경이 \(1\)이고, 양 끝점 \(x=\pm 1\)에서 발산함을 증명하세요.`,
      en: String.raw`Prove \(\sum_{n=0}^{\infty} x^n\) has radius \(1\) and diverges at both endpoints \(x=\pm 1\).`,
    },
    display: [String.raw`R = 1,\quad 1^n \not\to 0,\quad (-1)^n \not\to 0`],
    preset: { series: 'geom', x: 1, n: 20 },
    presetCaption: {
      ko: String.raw`\(x = 1\), \(N = 20\) — 항이 항상 \(1\)이라 부분합이 \(21\)까지 직선으로 자랍니다.`,
      en: String.raw`\(x = 1\), \(N = 20\) — every term is \(1\), so the partial sums grow linearly to \(21\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`비율 판정법을 \(\lvert x\rvert^n\)에 적용하면 \(\frac{\lvert x\rvert^{n+1}}{\lvert x\rvert^n} = \lvert x\rvert\)이다. \(\lvert x\rvert < 1\)이면 수렴하고 \(\lvert x\rvert > 1\)이면 항이 무한대로 커져 발산하므로 수렴반경은 \(R = 1\)이다.`,
          en: String.raw`The ratio test on \(\lvert x\rvert^n\) gives \(\frac{\lvert x\rvert^{n+1}}{\lvert x\rvert^n} = \lvert x\rvert\). It converges for \(\lvert x\rvert < 1\) and diverges for \(\lvert x\rvert > 1\) (terms grow without bound), so the radius is \(R = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`끝점 \(x = 1\)에서는 항이 \(1^n = 1 \not\to 0\)이므로 발산 판정법으로 급수가 발산한다.`,
          en: String.raw`At the endpoint \(x = 1\) the terms are \(1^n = 1 \not\to 0\), so the series diverges by the divergence test.`,
        },
      },
      {
        text: {
          ko: String.raw`끝점 \(x = -1\)에서는 항이 \((-1)^n \not\to 0\)이므로 역시 발산 판정법으로 급수가 발산한다.`,
          en: String.raw`At the endpoint \(x = -1\) the terms are \((-1)^n \not\to 0\), so the series diverges by the divergence test as well.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 수렴반경은 \(1\)이며, 양 끝점 모두에서 발산한다 — 경계에서는 따로따로 따져야 한다.`,
          en: String.raw`Thus the radius is \(1\), and both endpoints diverge — the boundary must be decided case by case.`,
        },
      },
    ],
  },
];
