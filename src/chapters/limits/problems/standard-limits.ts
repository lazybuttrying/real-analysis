import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the standard-limits scene
 * (Tao, Analysis I, Props 6.5.2/6.5.3). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/standard-limits.test.ts):
 *   0.5^60 = 8.673617379884035e-19 < 1e-18;
 *   2^(1/60) = 1.0116193982758447, within 0.02 of 1;
 *   60^(1/60) = 1.0706149..., t_60 = 0.0706 <= sqrt(2/59) = 0.1841.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'power-to-zero',
    statement: {
      ko: String.raw`\(|x| < 1\)이면 \(x^n \to 0\)임을 \(\varepsilon\)-\(N\) 논법으로 완전히 증명하세요. 힌트: \(r = 1/|x| > 1\)이라 두고 \(r = 1 + h\)로 쓴 뒤 Bernoulli 부등식 \((1+h)^n \ge 1 + nh\)를 이용하세요.`,
      en: String.raw`Prove completely by the \(\varepsilon\)-\(N\) argument that \(x^n \to 0\) when \(|x| < 1\). Hint: put \(r = 1/|x| > 1\), write \(r = 1 + h\), and use Bernoulli's inequality \((1+h)^n \ge 1 + nh\).`,
    },
    display: [
      String.raw`r = \frac{1}{\lvert x\rvert} > 1, \quad r = 1 + h, \quad \lvert x\rvert^n \le \frac{1}{1 + nh} \to 0`,
    ],
    preset: { kind: 'power', x: 0.5, n: 20 },
    presetCaption: {
      ko: String.raw`\(x = 0.5\), \(n = 20\): 점들이 \(0\)을 향해 가라앉습니다 — \(0.5^{20} \approx 9.54\times 10^{-7}\), \(0.5^{60} \approx 8.67\times 10^{-19}\).`,
      en: String.raw`\(x = 0.5\), \(n = 20\): the dots sink toward \(0\) — \(0.5^{20} \approx 9.54\times 10^{-7}\), \(0.5^{60} \approx 8.67\times 10^{-19}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x = 0\)이면 자명하므로 \(0 < |x| < 1\)이라 둡니다. \(r = 1/|x|\)라 두면 \(r > 1\)이므로 \(r = 1 + h\) (\(h > 0\))로 쓸 수 있습니다.`,
          en: String.raw`The case \(x = 0\) is trivial, so assume \(0 < |x| < 1\). Put \(r = 1/|x|\); then \(r > 1\), so \(r = 1 + h\) with \(h > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`Bernoulli 부등식 \((1+h)^n \ge 1 + nh\) (\(h > -1\))를 증명합니다: \(n = 1\)에서 등호이고, \((1+h)^n \ge 1 + nh\)라 가정하면 \((1+h)^{n+1} = (1+h)^n(1+h) \ge (1+nh)(1+h) = 1 + (n+1)h + nh^2 \ge 1 + (n+1)h\)이므로 귀납법으로 성립합니다. 따라서 \(|x|^n = 1/r^n = 1/(1+h)^n \le 1/(1+nh)\)입니다.`,
          en: String.raw`Bernoulli's inequality \((1+h)^n \ge 1 + nh\) (for \(h > -1\)): equality at \(n = 1\), and if \((1+h)^n \ge 1 + nh\) then \((1+h)^{n+1} = (1+h)^n(1+h) \ge (1+nh)(1+h) = 1 + (n+1)h + nh^2 \ge 1 + (n+1)h\), so induction gives it. Hence \(|x|^n = 1/r^n = 1/(1+h)^n \le 1/(1+nh)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 Archimedes 성질에 의해 \(N > (1/\varepsilon - 1)/h\)인 자연수 \(N\)을 잡을 수 있습니다. \(n > N\)이면 \(nh > 1/\varepsilon - 1\)이므로 \(1 + nh > 1/\varepsilon\), 즉 \(1/(1+nh) < \varepsilon\)입니다. 따라서 \(|x^n - 0| = |x|^n \le 1/(1+nh) < \varepsilon\) — \(x^n \to 0\)입니다.`,
          en: String.raw`Given \(\varepsilon > 0\), the Archimedean property gives a natural \(N > (1/\varepsilon - 1)/h\). For \(n > N\), \(nh > 1/\varepsilon - 1\), so \(1 + nh > 1/\varepsilon\), i.e. \(1/(1+nh) < \varepsilon\). Hence \(|x^n - 0| = |x|^n \le 1/(1+nh) < \varepsilon\) — \(x^n \to 0\).`,
        },
      },
    ],
  },
  {
    id: 'root-to-one',
    statement: {
      ko: String.raw`\(x > 1\)이면 \(x^{1/n} \to 1\)임을 완전히 증명하세요. 힌트: \(t_n = x^{1/n} - 1 \ge 0\)이라 두고 \(x = (1+t_n)^n\)에 Bernoulli 부등식을 적용하세요.`,
      en: String.raw`Prove completely that \(x^{1/n} \to 1\) when \(x > 1\). Hint: put \(t_n = x^{1/n} - 1 \ge 0\) and apply Bernoulli's inequality to \(x = (1+t_n)^n\).`,
    },
    display: [
      String.raw`t_n = x^{1/n} - 1 \ge 0, \qquad x = (1+t_n)^n \ge 1 + nt_n, \qquad 0 \le t_n \le \frac{x-1}{n} \to 0`,
    ],
    preset: { kind: 'root', x: 2, n: 20 },
    presetCaption: {
      ko: String.raw`\(x = 2\), \(n = 20\): \(2^{1/n}\)이 위에서 \(1\)로 내려옵니다 — \(2^{1/20} \approx 1.0353\), \(2^{1/60} \approx 1.0116\).`,
      en: String.raw`\(x = 2\), \(n = 20\): \(2^{1/n}\) descends to \(1\) from above — \(2^{1/20} \approx 1.0353\), \(2^{1/60} \approx 1.0116\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(t_n = x^{1/n} - 1\)이라 둡니다. \(x > 1\)이므로 \(x^{1/n} > 1\)이고 \(t_n \ge 0\)입니다. 정의에 의해 \(x = (1 + t_n)^n\)입니다.`,
          en: String.raw`Put \(t_n = x^{1/n} - 1\). Since \(x > 1\), \(x^{1/n} > 1\) and \(t_n \ge 0\). By definition \(x = (1 + t_n)^n\).`,
        },
      },
      {
        text: {
          ko: String.raw`Bernoulli 부등식(문제 1)에 의해 \((1+t_n)^n \ge 1 + nt_n\)이므로 \(x \ge 1 + nt_n\), 즉 \(0 \le t_n \le (x-1)/n\)입니다.`,
          en: String.raw`By Bernoulli's inequality (problem 1), \((1+t_n)^n \ge 1 + nt_n\), so \(x \ge 1 + nt_n\), i.e. \(0 \le t_n \le (x-1)/n\).`,
        },
      },
      {
        text: {
          ko: String.raw`상한 \((x-1)/n \to 0\)인 근거: Archimedes 성질에 의해 \(\frac{1}{n} \to 0\)입니다 (임의의 \(\varepsilon' > 0\)에 대해 \(N > 1/\varepsilon'\)인 \(N\)을 택하면 \(n > N\)일 때 \(\frac{1}{n} < \varepsilon'\)). 고정된 상수 \((x-1)\)를 곱해도 극한은 \(0\)이므로 \((x-1)/n \to 0\)이고, 조임 정리(squeeze theorem)에 의해 \(t_n \to 0\)입니다. 즉 \(x^{1/n} = 1 + t_n \to 1\)입니다. (\(\varepsilon\)-\(N\) 형태로 쓰면: \(N > (x-1)/\varepsilon\)인 \(N\)에 대해 \(n > N \Rightarrow |x^{1/n} - 1| = t_n \le (x-1)/n < \varepsilon\).)`,
          en: String.raw`Ground for the bound \((x-1)/n \to 0\): \(\frac{1}{n} \to 0\) by the Archimedean property (given \(\varepsilon' > 0\), pick \(N > 1/\varepsilon'\); then \(n > N\) gives \(\frac{1}{n} < \varepsilon'\)). Multiplying by the fixed constant \((x-1)\) keeps the limit \(0\), so \((x-1)/n \to 0\), and the squeeze theorem gives \(t_n \to 0\), i.e. \(x^{1/n} = 1 + t_n \to 1\). (In \(\varepsilon\)-\(N\) form: for \(N > (x-1)/\varepsilon\), \(n > N \Rightarrow |x^{1/n} - 1| = t_n \le (x-1)/n < \varepsilon\).)`,
        },
      },
    ],
  },
  {
    id: 'nth-root-of-n',
    statement: {
      ko: String.raw`\(n^{1/n} \to 1\)임을 완전히 증명하세요. 힌트: \(t_n = n^{1/n} - 1\)이라 두고 이항정리에서 \(\binom{n}{2}t_n^2\) 항만 남기세요.`,
      en: String.raw`Prove completely that \(n^{1/n} \to 1\). Hint: put \(t_n = n^{1/n} - 1\) and keep only the \(\binom{n}{2}t_n^2\) term of the binomial expansion.`,
    },
    display: [
      String.raw`t_n = n^{1/n} - 1, \qquad n = (1+t_n)^n \ge \binom{n}{2}t_n^2, \qquad 0 \le t_n \le \sqrt{\frac{2}{n-1}} \to 0`,
    ],
    preset: { kind: 'root', x: 2, n: 60 },
    presetCaption: {
      ko: String.raw`\(x = 2\), \(n = 60\): \(2^{1/k} \to 1\)을 보여줍니다. 아래 증명은 같은 이항 트릭을 \(x = n\)에 적용해 \(t_n \le \sqrt{2/(n-1)}\)을 얻습니다 (\(n = 60\)에서 상한 \(0.1841\), 실제 \(t_{60} \approx 0.0706\)).`,
      en: String.raw`\(x = 2\), \(n = 60\): shows \(2^{1/k} \to 1\). The proof below applies the same binomial trick with \(x = n\) to get \(t_n \le \sqrt{2/(n-1)}\) (at \(n = 60\) the bound is \(0.1841\), the actual \(t_{60} \approx 0.0706\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(t_n = n^{1/n} - 1\)이라 둡니다. \(n \ge 1\)이므로 \(t_n \ge 0\)이고, 정의에 의해 \(n = (1+t_n)^n\)입니다. \(n = 1\)인 경우는 자명합니다 (\(1^{1/1} = 1\), 즉 \(t_1 = 0\)); 아래의 상한 \(\sqrt{2/(n-1)}\)은 \(n - 1\)로 나누므로 \(n \ge 2\)를 가정합니다.`,
          en: String.raw`Put \(t_n = n^{1/n} - 1\). Since \(n \ge 1\), \(t_n \ge 0\), and by definition \(n = (1+t_n)^n\). The case \(n = 1\) is trivial (\(1^{1/1} = 1\), i.e. \(t_1 = 0\)); the bound \(\sqrt{2/(n-1)}\) below divides by \(n - 1\), so assume \(n \ge 2\) from now on.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n \ge 2\)일 때 이항정리로 \((1+t_n)^n = \sum_{k=0}^{n}\binom{n}{k}t_n^k \ge \binom{n}{2}t_n^2\)입니다 (버린 항들이 모두 음이 아니므로). 즉 \(n \ge \frac{n(n-1)}{2}t_n^2\)입니다.`,
          en: String.raw`For \(n \ge 2\), the binomial theorem gives \((1+t_n)^n = \sum_{k=0}^{n}\binom{n}{k}t_n^k \ge \binom{n}{2}t_n^2\) (the dropped terms are all nonnegative). So \(n \ge \frac{n(n-1)}{2}t_n^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변을 \(n > 0\)으로 나누면 \(1 \ge \frac{n-1}{2}t_n^2\), 즉 (\(n \ge 2\)에서) \(0 \le t_n \le \sqrt{2/(n-1)}\)입니다. 상한이 \(0\)으로 가는 근거: 임의의 \(\varepsilon > 0\)에 대해 Archimedes 성질로 \(N > 1 + 2/\varepsilon^2\)인 \(N\)을 택하면 \(n > N\)일 때 \(\frac{2}{n-1} < \varepsilon^2\), 즉 \(\sqrt{2/(n-1)} < \varepsilon\)입니다. 따라서 \(\sqrt{2/(n-1)} \to 0\)이고 조임 정리로 \(t_n \to 0\), 즉 \(n^{1/n} = 1 + t_n \to 1\)입니다. 수치 확인: \(n = 60\)에서 상한은 \(\sqrt{2/59} \approx 0.1841\)이고 실제 \(60^{1/60} - 1 \approx 0.0706\)으로 그 안에 들어갑니다.`,
          en: String.raw`Dividing by \(n > 0\) gives \(1 \ge \frac{n-1}{2}t_n^2\), i.e. (for \(n \ge 2\)) \(0 \le t_n \le \sqrt{2/(n-1)}\). Ground for the bound tending to \(0\): given \(\varepsilon > 0\), the Archimedean property gives \(N > 1 + 2/\varepsilon^2\); then \(n > N\) gives \(\frac{2}{n-1} < \varepsilon^2\), i.e. \(\sqrt{2/(n-1)} < \varepsilon\). Hence \(\sqrt{2/(n-1)} \to 0\), and the squeeze theorem gives \(t_n \to 0\), i.e. \(n^{1/n} = 1 + t_n \to 1\). Numerical check: at \(n = 60\) the bound is \(\sqrt{2/59} \approx 0.1841\) and the actual \(60^{1/60} - 1 \approx 0.0706\) sits inside it.`,
        },
      },
    ],
  },
];
