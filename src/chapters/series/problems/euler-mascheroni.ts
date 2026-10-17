import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Euler-Mascheroni constant scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/euler-mascheroni.test.ts):
 *   H_10 = 2.9289682539682538, ln 10 = 2.302585093, gamma_10 = 0.6263831610
 *   H_50 = 4.499205338, ln 50 = 3.912023005, gamma_50 = 0.5871823329
 *   gamma_50 - gamma_51 = ln(51/50) - 1/51 = 0.0001947842
 *   H_100 = 5.187377518, ln 101 = 4.615120517, H_100 - ln 101 = 0.5722570008
 *   H_10 - ln 11 = 0.5310729812 (partial sum of d_k, k = 1..10)
 *   tail bound: sum_{k>=11} 1/(k(2k+1)) < 1/20 = 0.05
 */
export const eulerMascheroniProblems: readonly ProblemMeta[] = [
  {
    id: 'euler-mascheroni-decreasing',
    statement: {
      ko: String.raw`\(\gamma_n = H_n - \ln n\)이 감소수열이며 아래로 유계이므로 (따라서) 수렴함을 보이세요. 힌트: \(\frac{1}{n+1} < \ln(n+1) - \ln n < \frac{1}{n}\)을 이용하세요.`,
      en: String.raw`Show that \(\gamma_n = H_n - \ln n\) is decreasing and bounded below, hence convergent. Hint: use \(\frac{1}{n+1} < \ln(n+1) - \ln n < \frac{1}{n}\).`,
    },
    display: [String.raw`\gamma_{n+1} - \gamma_n = \frac{1}{n+1} - \bigl(\ln(n+1) - \ln n\bigr) < 0`],
    preset: { n: 50 },
    presetCaption: {
      ko: String.raw`\(n = 50\): \(H_{50} \approx 4.499205338\), \(\ln 50 \approx 3.912023005\), \(\gamma_{50} \approx 0.5871823329\) — 한 칸 내려가면 \(\gamma_{50} - \gamma_{51} = \ln(51/50) - \frac{1}{51} \approx 0.0001948 > 0\)만큼 감소합니다.`,
      en: String.raw`\(n = 50\): \(H_{50} \approx 4.499205338\), \(\ln 50 \approx 3.912023005\), \(\gamma_{50} \approx 0.5871823329\) — one step down drops by \(\gamma_{50} - \gamma_{51} = \ln(51/50) - \frac{1}{51} \approx 0.0001948 > 0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\gamma_{n+1} - \gamma_n = (H_{n+1} - \ln(n+1)) - (H_n - \ln n) = \frac{1}{n+1} - (\ln(n+1) - \ln n)\)입니다. 힌트의 왼쪽 부등식 \(\ln(n+1) - \ln n > \frac{1}{n+1}\)에 의해 이 차이는 음수이므로, \(\gamma_n\)은 (강)감소수열입니다.`,
          en: String.raw`\(\gamma_{n+1} - \gamma_n = (H_{n+1} - \ln(n+1)) - (H_n - \ln n) = \frac{1}{n+1} - (\ln(n+1) - \ln n)\). By the left half of the hint inequality, \(\ln(n+1) - \ln n > \frac{1}{n+1}\), so this difference is negative: \(\gamma_n\) is strictly decreasing.`,
        },
      },
      {
        text: {
          ko: String.raw`아래로의 유계는 \(\ln n\)을 쪼개면 보입니다: \(\gamma_n = H_n - \sum_{k=1}^{n-1}(\ln(k+1) - \ln k) = \frac{1}{n} + \sum_{k=1}^{n-1}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right)\)이고, 힌트의 오른쪽 부등식 \(\ln\left(1+\frac{1}{k}\right) < \frac{1}{k}\)에 의해 각 괄호는 양수이므로 \(\gamma_n > \frac{1}{n} > 0\)입니다.`,
          en: String.raw`The lower bound appears by splitting \(\ln n\): \(\gamma_n = H_n - \sum_{k=1}^{n-1}(\ln(k+1) - \ln k) = \frac{1}{n} + \sum_{k=1}^{n-1}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right)\), and each bracket is positive by the right half of the hint inequality, \(\ln\left(1+\frac{1}{k}\right) < \frac{1}{k}\). Hence \(\gamma_n > \frac{1}{n} > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`감소하면서 아래로 유계인 수열은 단조수렴정리에 의해 수렴합니다. 그 극한을 오일러-마스케로니 상수 \(\gamma := \lim_{n\to\infty} \gamma_n\)이라 하며, \(\gamma \ge 0\)입니다 (실제로는 \(\gamma \approx 0.5772\)입니다).`,
          en: String.raw`A decreasing sequence bounded below converges by the monotone convergence theorem. Its limit is the Euler–Mascheroni constant \(\gamma := \lim_{n\to\infty} \gamma_n\), with \(\gamma \ge 0\) (in fact \(\gamma \approx 0.5772\)).`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(n = 50\)): \(\gamma_{50} = 4.499205338 - 3.912023005 = 0.5871823329\), \(\gamma_{51} = \gamma_{50} - (\ln(51/50) - 1/51) \approx 0.5871823329 - 0.0001948 = 0.5869875\) — 캡션의 감소량 \(0.0001948\)과 일치합니다.`,
          en: String.raw`Numerical check (\(n = 50\)): \(\gamma_{50} = 4.499205338 - 3.912023005 = 0.5871823329\), and \(\gamma_{51} = \gamma_{50} - (\ln(51/50) - 1/51) \approx 0.5871823329 - 0.0001948 = 0.5869875\) — matching the caption's drop of \(0.0001948\).`,
        },
      },
    ],
  },
  {
    id: 'euler-mascheroni-series',
    statement: {
      ko: String.raw`\(\sum_{n=1}^{\infty}\left(\frac{1}{n} - \ln\left(1+\frac{1}{n}\right)\right) = \gamma\)임을 보이세요 (망원경 합).`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty}\left(\frac{1}{n} - \ln\left(1+\frac{1}{n}\right)\right) = \gamma\) (a telescoping sum).`,
    },
    display: [
      String.raw`\sum_{k=1}^{n}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right) = H_n - \ln(n+1) = \gamma_n - \ln\left(1+\frac{1}{n}\right)`,
    ],
    preset: { n: 100 },
    presetCaption: {
      ko: String.raw`\(n = 100\): 부분합 \(= H_{100} - \ln 101 \approx 5.187377518 - 4.615120517 = 0.5722570008\) — \(\gamma \approx 0.5772\)로 수렴해 갑니다.`,
      en: String.raw`\(n = 100\): partial sum \(= H_{100} - \ln 101 \approx 5.187377518 - 4.615120517 = 0.5722570008\) — converging toward \(\gamma \approx 0.5772\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부분합을 펼치면 \(\sum_{k=1}^{n} \ln\left(1+\frac{1}{k}\right) = \sum_{k=1}^{n}(\ln(k+1) - \ln k) = \ln(n+1)\)이 망원경처럼 상쇄되므로, \(\sum_{k=1}^{n}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right) = H_n - \ln(n+1)\)입니다.`,
          en: String.raw`Expanding the partial sum, \(\sum_{k=1}^{n} \ln\left(1+\frac{1}{k}\right) = \sum_{k=1}^{n}(\ln(k+1) - \ln k) = \ln(n+1)\) telescopes, so \(\sum_{k=1}^{n}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right) = H_n - \ln(n+1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(H_n - \ln(n+1) = \gamma_n - \ln\left(1+\frac{1}{n}\right)\)이고, 예제 1에서 \(\gamma_n \to \gamma\), \(\ln\left(1+\frac{1}{n}\right) \to 0\)이므로 부분합은 \(\gamma\)로 수렴합니다. 즉 급수는 \(\gamma\)로 수렴합니다.`,
          en: String.raw`Since \(H_n - \ln(n+1) = \gamma_n - \ln\left(1+\frac{1}{n}\right)\), with \(\gamma_n \to \gamma\) (problem 1) and \(\ln\left(1+\frac{1}{n}\right) \to 0\), the partial sums converge to \(\gamma\). Hence the series sums to \(\gamma\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 항 \(d_k := \frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\)는 힌트 부등식 \(\ln\left(1+\frac{1}{k}\right) < \frac{1}{k}\)에 의해 양수이므로, 이는 양항급수가 \(\gamma\)로 수렴한다는 뜻입니다 — 발산하는 조화급수와 \(\ln n\)의 차이가 수렴하는 이유가 바로 이 항들의 합이 유한하기 때문입니다.`,
          en: String.raw`Each term \(d_k := \frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\) is positive by \(\ln\left(1+\frac{1}{k}\right) < \frac{1}{k}\), so this says a series of positive terms sums to \(\gamma\) — this is exactly why the gap between the diverging harmonic series and \(\ln n\) converges: the total of these differences is finite.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(n = 100\)): \(H_{100} - \ln 101 \approx 5.187377518 - 4.615120517 = 0.5722570008\) — 캡션의 값과 일치하며, \(\gamma \approx 0.5772\)에 다가가고 있습니다 (차이 \(\approx 0.005\)는 꼬리 \(\sum_{k>100} d_k\)입니다).`,
          en: String.raw`Numerical check (\(n = 100\)): \(H_{100} - \ln 101 \approx 5.187377518 - 4.615120517 = 0.5722570008\) — matching the caption and approaching \(\gamma \approx 0.5772\) (the gap \(\approx 0.005\) is the tail \(\sum_{k>100} d_k\)).`,
        },
      },
    ],
  },
  {
    id: 'euler-mascheroni-bounds',
    statement: {
      ko: String.raw`\(0.5 < \gamma < 0.6\)임을 보이세요. 힌트: \(\gamma = \sum_{k=1}^{\infty} d_k\) (\(d_k = \frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\))의 처음 10개 항을 직접 계산하고, 꼬리는 적분 추정으로 엄밀하게 묶으세요.`,
      en: String.raw`Prove that \(0.5 < \gamma < 0.6\). Hint: compute the first 10 terms of \(\gamma = \sum_{k=1}^{\infty} d_k\) (\(d_k = \frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\)) directly and bound the tail rigorously with integral estimates.`,
    },
    display: [
      String.raw`\gamma = \sum_{k=1}^{\infty} d_k, \qquad d_k := \frac{1}{k} - \ln\left(1+\frac{1}{k}\right) > 0`,
      String.raw`\ln\left(1+\frac{1}{k}\right) = \int_k^{k+1}\frac{dx}{x} \ge \frac{1}{k+\frac12} \quad \Rightarrow \quad d_k \le \frac{1}{k(2k+1)} < \frac{1}{2k^2}`,
    ],
    preset: { n: 10 },
    presetCaption: {
      ko: String.raw`\(n = 10\): \(\sum_{k=1}^{10} d_k = H_{10} - \ln 11 \approx 0.5310729812\), 꼬리 \(< 0.05\) — 따라서 \(0.5311 < \gamma < 0.5811\).`,
      en: String.raw`\(n = 10\): \(\sum_{k=1}^{10} d_k = H_{10} - \ln 11 \approx 0.5310729812\), tail \(< 0.05\) — so \(0.5311 < \gamma < 0.5811\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`예제 2에서 \(\gamma = \sum_{k=1}^{\infty} d_k\)이며 모든 \(d_k > 0\)입니다. 처음 10개 항의 합은 망원경 합으로 \(\sum_{k=1}^{10} d_k = H_{10} - \ln 11 \approx 2.9289682539 - 2.3978952728 = 0.5310729812\)입니다. \(d_k > 0\)이므로 이 값이 이미 하한이 됩니다: \(\gamma > 0.5310729812 > 0.5\).`,
          en: String.raw`By problem 2, \(\gamma = \sum_{k=1}^{\infty} d_k\) with every \(d_k > 0\). The first 10 terms telescope to \(\sum_{k=1}^{10} d_k = H_{10} - \ln 11 \approx 2.9289682539 - 2.3978952728 = 0.5310729812\). Since \(d_k > 0\), this is already a lower bound: \(\gamma > 0.5310729812 > 0.5\).`,
        },
      },
      {
        text: {
          ko: String.raw`꼬리를 묶기 위해 \(d_k\)를 위에서 추정합니다. \(\ln\left(1+\frac{1}{k}\right) = \int_k^{k+1} \frac{dx}{x}\)이고, \(\frac{1}{x}\)의 볼록성에 의해 \(f(k+t) + f(k+1-t) \ge 2f(k+\tfrac12)\) (\(0 \le t \le 1\))이므로 적분하면 \(\int_k^{k+1} \frac{dx}{x} \ge \frac{1}{k+1/2} = \frac{2}{2k+1}\)입니다. 따라서 \(d_k \le \frac{1}{k} - \frac{2}{2k+1} = \frac{1}{k(2k+1)} < \frac{1}{2k^2}\)입니다.`,
          en: String.raw`To bound the tail from above, estimate \(d_k\) from above. Write \(\ln\left(1+\frac{1}{k}\right) = \int_k^{k+1} \frac{dx}{x}\); by convexity of \(\frac{1}{x}\), \(f(k+t) + f(k+1-t) \ge 2f(k+\tfrac12)\) for \(0 \le t \le 1\), so integrating gives \(\int_k^{k+1} \frac{dx}{x} \ge \frac{1}{k+1/2} = \frac{2}{2k+1}\). Hence \(d_k \le \frac{1}{k} - \frac{2}{2k+1} = \frac{1}{k(2k+1)} < \frac{1}{2k^2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(\sum_{k=11}^{\infty} d_k < \frac{1}{2}\sum_{k=11}^{\infty} \frac{1}{k^2} < \frac{1}{2}\sum_{k=11}^{\infty} \frac{1}{k(k-1)} = \frac{1}{2}\sum_{k=11}^{\infty}\left(\frac{1}{k-1} - \frac{1}{k}\right) = \frac{1}{2}\cdot\frac{1}{10} = 0.05\)입니다 (\(k \ge 2\)에서 \(\frac{1}{k^2} < \frac{1}{k(k-1)}\)이고 마지막 합은 망원경 합입니다).`,
          en: String.raw`Now \(\sum_{k=11}^{\infty} d_k < \frac{1}{2}\sum_{k=11}^{\infty} \frac{1}{k^2} < \frac{1}{2}\sum_{k=11}^{\infty} \frac{1}{k(k-1)} = \frac{1}{2}\sum_{k=11}^{\infty}\left(\frac{1}{k-1} - \frac{1}{k}\right) = \frac{1}{2}\cdot\frac{1}{10} = 0.05\) (using \(\frac{1}{k^2} < \frac{1}{k(k-1)}\) for \(k \ge 2\), and the last sum telescopes).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(0.5310729812 < \gamma < 0.5310729812 + 0.05 = 0.5810729812\)이므로, 확실히 \(0.5 < \gamma < 0.6\)입니다. 실제 값 \(\gamma \approx 0.5772\)도 이 구간 안에 들어갑니다.`,
          en: String.raw`Therefore \(0.5310729812 < \gamma < 0.5310729812 + 0.05 = 0.5810729812\), so certainly \(0.5 < \gamma < 0.6\). The true value \(\gamma \approx 0.5772\) lies inside this interval.`,
        },
      },
    ],
  },
];
