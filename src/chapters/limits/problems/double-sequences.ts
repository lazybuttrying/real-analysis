import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the double-sequences scene. Imports
 * nothing except types. Every number below was verified against the
 * model (tests/double-sequences.test.ts): for a_{m,n} = m/(m+n) the
 * diagonal is constantly 1/2 and a(k, k^2) = 1/(1+k); for
 * a_{m,n} = (-1)^n / m the absolute value is exactly 1/m for all n, and
 * its even/odd rows are the constants 1/m and -1/m.
 */
export const doubleSequencesProblems: readonly ProblemMeta[] = [
  {
    id: 'ratio-iterated-limits-differ',
    statement: {
      ko: String.raw`이중수열 \(a_{m,n} = \frac{m}{m+n}\)에 대해 다음을 완전히 증명하세요.

(i) 각 \(m\)을 고정하면 \(\lim_{n\to\infty} a_{m,n} = 0\)이고, 따라서 반복극한 \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = 0\)입니다.

(ii) 각 \(n\)을 고정하면 \(\lim_{m\to\infty} a_{m,n} = 1\)이고, 따라서 반복극한 \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = 1\)입니다.

(iii) 그럼에도 이중극한 \(\lim_{m,n\to\infty} a_{m,n}\) (Pringsheim 극한)은 존재하지 않습니다.`,
      en: String.raw`For the double sequence \(a_{m,n} = \frac{m}{m+n}\), prove completely:

(i) For each fixed \(m\), \(\lim_{n\to\infty} a_{m,n} = 0\), so the iterated limit \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = 0\).

(ii) For each fixed \(n\), \(\lim_{m\to\infty} a_{m,n} = 1\), so the iterated limit \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = 1\).

(iii) Nevertheless the double limit \(\lim_{m,n\to\infty} a_{m,n}\) (the Pringsheim limit) does not exist.`,
    },
    display: [
      String.raw`\lim_{n\to\infty} \frac{m}{m+n} = 0 \quad (m \text{ fixed}), \qquad \lim_{m\to\infty} \frac{m}{m+n} = 1 \quad (n \text{ fixed})`,
      String.raw`a_{k,k} = \frac{1}{2}, \qquad a_{k,k^2} = \frac{1}{1+k} \to 0`,
    ],
    preset: { example: 'ratio', k: 12 },
    presetCaption: {
      ko: String.raw`\(a_{m,n} = \frac{m}{m+n}\): 행 고정 극한은 모두 \(0\), 열 고정 극한은 모두 \(1\) — 대각선은 늘 \(\frac{1}{2}\)에 머뭅니다.`,
      en: String.raw`\(a_{m,n} = \frac{m}{m+n}\): every row limit is \(0\), every column limit is \(1\) — and the diagonal sits at \(\frac{1}{2}\) forever.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(i) \(m\)을 고정합니다. \(m + n > n\)이므로

\(0 < a_{m,n} = \frac{m}{m+n} < \frac{m}{n}\).

\(\varepsilon > 0\)이 주어지면 \(N > \frac{m}{\varepsilon}\)로 잡습니다. \(n > N\)이면 \(\frac{m}{n} < \varepsilon\)이라서 \(|a_{m,n} - 0| < \varepsilon\)입니다.

따라서 모든 \(m\)에 대해 \(\lim_{n\to\infty} a_{m,n} = 0\)이고, 안쪽 극한이 상수 \(0\)이므로 \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = \lim_{m\to\infty} 0 = 0\)입니다.`,
          en: String.raw`(i) Fix \(m\). Since \(m + n > n\),

\(0 < a_{m,n} = \frac{m}{m+n} < \frac{m}{n}\).

Given \(\varepsilon > 0\), take \(N > \frac{m}{\varepsilon}\). For \(n > N\), \(\frac{m}{n} < \varepsilon\), so \(|a_{m,n} - 0| < \varepsilon\).

Hence \(\lim_{n\to\infty} a_{m,n} = 0\) for every \(m\), and since the inner limit is the constant \(0\), \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = \lim_{m\to\infty} 0 = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`(ii) \(n\)을 고정합니다. \(a_{m,n} = \frac{m}{m+n} = 1 - \frac{n}{m+n}\)이므로

\(|a_{m,n} - 1| = \frac{n}{m+n} < \frac{n}{m}\).

\(\varepsilon > 0\)이 주어지면 \(N > \frac{n}{\varepsilon}\)로 잡습니다. \(m > N\)이면 \(\frac{n}{m} < \varepsilon\)이라서 \(|a_{m,n} - 1| < \varepsilon\)입니다.

따라서 모든 \(n\)에 대해 \(\lim_{m\to\infty} a_{m,n} = 1\)이고, \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = \lim_{n\to\infty} 1 = 1\)입니다.`,
          en: String.raw`(ii) Fix \(n\). Since \(a_{m,n} = \frac{m}{m+n} = 1 - \frac{n}{m+n}\),

\(|a_{m,n} - 1| = \frac{n}{m+n} < \frac{n}{m}\).

Given \(\varepsilon > 0\), take \(N > \frac{n}{\varepsilon}\). For \(m > N\), \(\frac{n}{m} < \varepsilon\), so \(|a_{m,n} - 1| < \varepsilon\).

Hence \(\lim_{m\to\infty} a_{m,n} = 1\) for every \(n\), and \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = \lim_{n\to\infty} 1 = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`(iii) 이중극한 \(L\)이 존재한다고 가정하고 모순을 이끌어 냅니다. \(\varepsilon = \frac{1}{8}\)에 대해, 어떤 \(N\)이 존재해서 \(m, n > N\)이면 \(|a_{m,n} - L| < \frac{1}{8}\)입니다.

대각선 위의 점 \((k, k)\) (\(k > N\))에서는 \(a_{k,k} = \frac{k}{k+k} = \frac{1}{2}\)이므로 \(\left|\frac{1}{2} - L\right| < \frac{1}{8}\), 즉 \(L > \frac{3}{8}\)입니다.

한편 점 \((k, k^2)\) (\(k > \max(N, 8)\))에서는 \(a_{k,k^2} = \frac{k}{k+k^2} = \frac{1}{1+k} < \frac{1}{9} < \frac{1}{8}\)이고 \(|a_{k,k^2} - L| < \frac{1}{8}\)이므로 \(L < \frac{1}{8} + \frac{1}{8} = \frac{1}{4}\)입니다.

\(\frac{1}{4} < \frac{3}{8}\)이라 두 결론이 충돌합니다. 따라서 이중극한은 존재하지 않습니다.

참고: (i)과 (ii)의 반복극한이 서로 다르다는 것만으로도, 문제 2 정리의 대우에 의해 이중극한의 부재가 따라 나옵니다.`,
          en: String.raw`(iii) Suppose a double limit \(L\) existed. For \(\varepsilon = \frac{1}{8}\) there is \(N\) with \(|a_{m,n} - L| < \frac{1}{8}\) whenever \(m, n > N\).

At the diagonal points \((k, k)\) with \(k > N\), \(a_{k,k} = \frac{k}{k+k} = \frac{1}{2}\), so \(\left|\frac{1}{2} - L\right| < \frac{1}{8}\), giving \(L > \frac{3}{8}\).

At the points \((k, k^2)\) with \(k > \max(N, 8)\), \(a_{k,k^2} = \frac{k}{k+k^2} = \frac{1}{1+k} < \frac{1}{9} < \frac{1}{8}\), and \(|a_{k,k^2} - L| < \frac{1}{8}\), giving \(L < \frac{1}{8} + \frac{1}{8} = \frac{1}{4}\).

Since \(\frac{1}{4} < \frac{3}{8}\), the two conclusions collide. Hence no double limit exists.

Remark: the mere fact that the iterated limits in (i) and (ii) differ already forces this, by the contrapositive of the theorem in Problem 2.`,
        },
      },
    ],
  },
  {
    id: 'iterated-limits-theorem',
    statement: {
      ko: String.raw`다음 정리를 완전히 증명하세요.

이중수열 \(a_{m,n}\)이 Pringsheim 의미로 \(L\)에 수렴하고 (즉 모든 \(\varepsilon > 0\)에 대해 \(m, n > N\)이면 \(|a_{m,n} - L| < \varepsilon\)인 \(N\)이 존재하고), 각 고정된 \(m\)마다 안쪽 극한 \(b_m = \lim_{n\to\infty} a_{m,n}\)이 존재하면, \(\lim_{m\to\infty} b_m = L\)입니다.

결론: 이중극한이 존재하고 두 반복극한이 모두 존재하면, 두 반복극한은 이중극한과 같습니다.`,
      en: String.raw`Prove the following theorem completely.

If a double sequence \(a_{m,n}\) converges to \(L\) in the Pringsheim sense (for every \(\varepsilon > 0\) there is \(N\) with \(|a_{m,n} - L| < \varepsilon\) whenever \(m, n > N\)), and for each fixed \(m\) the inner limit \(b_m = \lim_{n\to\infty} a_{m,n}\) exists, then \(\lim_{m\to\infty} b_m = L\).

Conclude: when the double limit exists and both iterated limits exist, both iterated limits equal the double limit.`,
    },
    display: [
      String.raw`m, n > N \implies |a_{m,n} - L| < \frac{\varepsilon}{2}, \qquad |b_m - L| \le \frac{\varepsilon}{2} < \varepsilon \quad (m > N)`,
    ],
    preset: { example: 'vanishing', k: 12 },
    presetCaption: {
      ko: String.raw`\(a_{m,n} = \frac{(-1)^n}{m}\): 이중극한은 \(0\)이고, \(m\) 방향 안쪽 극한이 존재하는 순서에서는 반복극한도 \(0\) — 정리가 예측하는 그대로입니다.`,
      en: String.raw`\(a_{m,n} = \frac{(-1)^n}{m}\): the double limit is \(0\), and in the order where the inner limits exist the iterated limit is \(0\) too — exactly as the theorem predicts.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)을 고정합니다. 이중극한의 정의를 \(\frac{\varepsilon}{2}\)에 적용하면, 어떤 \(N\)이 존재해서

\(m, n > N \implies |a_{m,n} - L| < \frac{\varepsilon}{2}\)

를 만족합니다.`,
          en: String.raw`Fix \(\varepsilon > 0\). Applying the definition of the double limit with \(\frac{\varepsilon}{2}\) gives an \(N\) such that

\(m, n > N \implies |a_{m,n} - L| < \frac{\varepsilon}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(m > N\)을 고정합니다. 모든 \(n > N\)에 대해 \(|a_{m,n} - L| < \frac{\varepsilon}{2}\)입니다.

\(|b_m - L| \le \frac{\varepsilon}{2}\)임을 보입니다. 반대로 \(|b_m - L| > \frac{\varepsilon}{2}\)라 가정하고 \(\delta = |b_m - L| - \frac{\varepsilon}{2} > 0\)으로 둡니다.

\(a_{m,n} \to b_m\) (\(n \to \infty\))이므로, 충분히 큰 \(n\) (특히 \(n > N\)인 \(n\))에 대해 \(|a_{m,n} - b_m| < \delta\)입니다.

그러면 \(|a_{m,n} - L| \ge |b_m - L| - |a_{m,n} - b_m| > |b_m - L| - \delta = \frac{\varepsilon}{2}\)가 되어 앞 단계와 모순됩니다.

따라서 \(|b_m - L| \le \frac{\varepsilon}{2} < \varepsilon\)입니다.`,
          en: String.raw`Now fix \(m > N\). For every \(n > N\), \(|a_{m,n} - L| < \frac{\varepsilon}{2}\).

We show \(|b_m - L| \le \frac{\varepsilon}{2}\). Suppose instead \(|b_m - L| > \frac{\varepsilon}{2}\), and put \(\delta = |b_m - L| - \frac{\varepsilon}{2} > 0\).

Since \(a_{m,n} \to b_m\) as \(n \to \infty\), for all large \(n\) (in particular some \(n > N\)) we have \(|a_{m,n} - b_m| < \delta\).

Then \(|a_{m,n} - L| \ge |b_m - L| - |a_{m,n} - b_m| > |b_m - L| - \delta = \frac{\varepsilon}{2}\), contradicting the previous step.

Hence \(|b_m - L| \le \frac{\varepsilon}{2} < \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`즉 모든 \(m > N\)에 대해 \(|b_m - L| < \varepsilon\)입니다.

\(\varepsilon > 0\)은 임의였으므로 \(\lim_{m\to\infty} b_m = L\), 즉 \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = L\)입니다.

역할을 바꾼 같은 논증으로, 각 \(n\)마다 \(\lim_{m\to\infty} a_{m,n}\)이 존재하면 \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = L\)입니다.

따라서 이중극한이 존재하고 두 반복극한이 모두 존재하면 셋은 모두 같습니다.`,
          en: String.raw`That is, \(|b_m - L| < \varepsilon\) for every \(m > N\).

Since \(\varepsilon > 0\) was arbitrary, \(\lim_{m\to\infty} b_m = L\): that is, \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n} = L\).

The symmetric argument shows that if \(\lim_{m\to\infty} a_{m,n}\) exists for each \(n\), then \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = L\).

Therefore, when the double limit exists and both iterated limits exist, all three agree.`,
        },
      },
    ],
  },
  {
    id: 'double-limit-without-iterated',
    statement: {
      ko: String.raw`이중수열 \(a_{m,n} = \frac{(-1)^n}{m}\)에 대해 다음을 완전히 증명하세요.

(i) 이중극한 \(\lim_{m,n\to\infty} a_{m,n} = 0\)이 존재합니다.

(ii) 그러나 각 고정된 \(m\)마다 \(\lim_{n\to\infty} a_{m,n}\)은 존재하지 않으므로, 반복극한 \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n}\)은 존재하지 않습니다.

(iii) 다른 순서의 반복극한 \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n}\)은 존재하고 \(0\)과 같습니다.`,
      en: String.raw`For the double sequence \(a_{m,n} = \frac{(-1)^n}{m}\), prove completely:

(i) The double limit \(\lim_{m,n\to\infty} a_{m,n} = 0\) exists.

(ii) But for each fixed \(m\), \(\lim_{n\to\infty} a_{m,n}\) does not exist, so the iterated limit \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n}\) does not exist.

(iii) The other iterated limit \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n}\) does exist and equals \(0\).`,
    },
    display: [
      String.raw`|a_{m,n}| = \frac{1}{m}, \qquad a_{m,2j} = \frac{1}{m}, \qquad a_{m,2j+1} = -\frac{1}{m}`,
    ],
    preset: { example: 'vanishing', k: 8 },
    presetCaption: {
      ko: String.raw`\(a_{m,n} = \frac{(-1)^n}{m}\): 행마다 \(\pm\frac{1}{m}\) 사이를 영원히 진동하지만, 행 번호가 커지면 진폭 자체가 \(0\)으로 죽습니다.`,
      en: String.raw`\(a_{m,n} = \frac{(-1)^n}{m}\): each row oscillates between \(\pm\frac{1}{m}\) forever, but the amplitude itself dies to \(0\) as the row index grows.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(i) 모든 \(m, n\)에 대해 \(|a_{m,n} - 0| = \frac{|(-1)^n|}{m} = \frac{1}{m}\)입니다 — \(n\)에는 전혀 의존하지 않습니다.

\(\varepsilon > 0\)이 주어지면 \(N > \frac{1}{\varepsilon}\)로 잡습니다. \(m > N\)이면 (\(n\)이 무엇이든) \(|a_{m,n}| = \frac{1}{m} < \frac{1}{N} < \varepsilon\)입니다.

따라서 Pringsheim 의미로 \(a_{m,n} \to 0\)입니다.`,
          en: String.raw`(i) For all \(m, n\), \(|a_{m,n} - 0| = \frac{|(-1)^n|}{m} = \frac{1}{m}\) — no dependence on \(n\) at all.

Given \(\varepsilon > 0\), take \(N > \frac{1}{\varepsilon}\). If \(m > N\) (whatever \(n\) is), then \(|a_{m,n}| = \frac{1}{m} < \frac{1}{N} < \varepsilon\).

Hence \(a_{m,n} \to 0\) in the Pringsheim sense.`,
        },
      },
      {
        text: {
          ko: String.raw`(ii) \(m\)을 고정합니다. 짝수 \(n = 2j\)에서는 \(a_{m,n} = \frac{1}{m}\)이고, 홀수 \(n = 2j+1\)에서는 \(a_{m,n} = -\frac{1}{m}\)입니다.

극한 \(b = \lim_{n\to\infty} a_{m,n}\)이 존재한다고 가정합니다. \(\varepsilon_0 = \frac{1}{2m} > 0\)에 대해, 어떤 \(N_0\)가 존재해서 \(n > N_0\)이면 \(|a_{m,n} - b| < \varepsilon_0\)입니다.

\(N_0\)보다 큰 짝수 \(n\)을 고르면 \(\left|\frac{1}{m} - b\right| < \frac{1}{2m}\)이고, \(N_0\)보다 큰 홀수 \(n\)을 고르면 \(\left|-\frac{1}{m} - b\right| < \frac{1}{2m}\)입니다.

삼각부등식으로 \(\frac{2}{m} = \left|\left(\frac{1}{m} - b\right) + \left(b + \frac{1}{m}\right)\right| \le \left|\frac{1}{m} - b\right| + \left|-\frac{1}{m} - b\right| < \frac{1}{2m} + \frac{1}{2m} = \frac{1}{m}\)이 되어, \(\frac{2}{m} < \frac{1}{m}\)이라는 거짓 부등식을 얻습니다.

모순이므로 \(\lim_{n\to\infty} a_{m,n}\)은 존재하지 않습니다. 이는 모든 \(m\)에서 성립하므로 반복극한 \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n}\)은 존재하지 않습니다.`,
          en: String.raw`(ii) Fix \(m\). At even \(n = 2j\), \(a_{m,n} = \frac{1}{m}\); at odd \(n = 2j+1\), \(a_{m,n} = -\frac{1}{m}\).

Suppose a limit \(b = \lim_{n\to\infty} a_{m,n}\) existed. For \(\varepsilon_0 = \frac{1}{2m} > 0\) there is \(N_0\) with \(|a_{m,n} - b| < \varepsilon_0\) for all \(n > N_0\).

Choosing an even \(n > N_0\) gives \(\left|\frac{1}{m} - b\right| < \frac{1}{2m}\); choosing an odd \(n > N_0\) gives \(\left|-\frac{1}{m} - b\right| < \frac{1}{2m}\).

By the triangle inequality, \(\frac{2}{m} = \left|\left(\frac{1}{m} - b\right) + \left(b + \frac{1}{m}\right)\right| \le \left|\frac{1}{m} - b\right| + \left|-\frac{1}{m} - b\right| < \frac{1}{2m} + \frac{1}{2m} = \frac{1}{m}\) — the false inequality \(\frac{2}{m} < \frac{1}{m}\).

This contradiction shows \(\lim_{n\to\infty} a_{m,n}\) does not exist. Since this holds for every \(m\), the iterated limit \(\lim_{m\to\infty}\lim_{n\to\infty} a_{m,n}\) does not exist.`,
        },
      },
      {
        text: {
          ko: String.raw`(iii) \(n\)을 고정하면 \(|a_{m,n}| = \frac{1}{m} \to 0\) (\(m \to \infty\))이므로, 모든 \(n\)에 대해 \(\lim_{m\to\infty} a_{m,n} = 0\)입니다.

따라서 \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = \lim_{n\to\infty} 0 = 0\)이며, 이는 (i)의 이중극한과 같습니다.

문제 2의 정리와 모순되지 않습니다: 그 정리는 안쪽 극한이 존재하는 순서에서만 결론을 내리는데, 이 예에서는 한 순서에서만 안쪽 극한이 존재합니다.`,
          en: String.raw`(iii) For fixed \(n\), \(|a_{m,n}| = \frac{1}{m} \to 0\) as \(m \to \infty\), so \(\lim_{m\to\infty} a_{m,n} = 0\) for every \(n\).

Hence \(\lim_{n\to\infty}\lim_{m\to\infty} a_{m,n} = \lim_{n\to\infty} 0 = 0\), matching the double limit in (i).

There is no conflict with the theorem of Problem 2: it only speaks about an order in which the inner limits exist, and here they exist in just one order.`,
        },
      },
    ],
  },
];
