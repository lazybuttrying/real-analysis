import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'exp-remainder-bound',
          statement: {
            ko: String.raw`\(e^x\)의 3차 테일러 다항식으로 \(e\)를 근사하고, 라그랑주 나머지 상한 \(\frac{e}{24} \approx 0.1133\)이 실제 오차를 덮는지 확인하세요.`,
            en: String.raw`Approximate \(e\) with the degree-3 Taylor polynomial of \(e^x\), and check the Lagrange bound \(\frac{e}{24} \approx 0.1133\) covers the true error.`,
          },
          display: [
            String.raw`T_3(1) = \frac{8}{3} \approx 2.6667, \quad |R_3(1)| \le \frac{e}{24} \approx 0.1133, \quad e - \frac{8}{3} \approx 0.0516`,
          ],
          preset: { degree: 3 },
          presetCaption: {
            ko: String.raw`\(n = 3\): \(\sin\)의 \(T_3\) 위에서, 같은 나머지 논리가 \(e^x\)에 \(\frac{e}{24} \approx 0.1133\) 상한을 줍니다.`,
            en: String.raw`\(n = 3\): over the \(T_3\) of \(\sin\), the same remainder argument gives \(e^x\) the bound \(\frac{e}{24} \approx 0.1133\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(e^x\)의 모든 도함수는 \(e^x\)이므로 \(f^{(k)}(0) = 1\)입니다. 따라서 \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\)이고, \(T_3(1) = 1 + 1 + \frac12 + \frac16 = \frac83 \approx 2.6667\)입니다.`,
                en: String.raw`Every derivative of \(e^x\) is \(e^x\), so \(f^{(k)}(0) = 1\). Hence \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\) and \(T_3(1) = 1 + 1 + \frac12 + \frac16 = \frac83 \approx 2.6667\).`,
              },
            },
            {
              text: {
                ko: String.raw`테일러 정리(라그랑주 나머지)에 의해 어떤 \(c \in (0, 1)\)에 대해 \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\)입니다. \(e^c \le e\)이므로 \(|R_3(1)| \le \frac{e}{24} \approx 0.1133\)입니다.`,
                en: String.raw`By Taylor's theorem (Lagrange remainder), \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\) for some \(c \in (0, 1)\). Since \(e^c \le e\), \(|R_3(1)| \le \frac{e}{24} \approx 0.1133\).`,
              },
            },
            {
              text: {
                ko: String.raw`실제 오차는 \(e - \frac83 \approx 0.0516 < 0.1133\)으로 상한 안에 들어갑니다 — 나머지의 상한은 안전한 과대평가입니다.`,
                en: String.raw`The true error is \(e - \frac83 \approx 0.0516 < 0.1133\), inside the bound — a remainder bound is a safe overestimate.`,
              },
            },
          ],
        },
        {
          id: 'sin-converges-everywhere',
          statement: {
            ko: String.raw`\(\sin x\)의 나머지 상한 \(\frac{|x|^{n+1}}{(n+1)!} \to 0\)임을 이용해 매클로린 급수가 모든 \(x\)에서 \(\sin x\)로 수렴함을 증명하세요.`,
            en: String.raw`Use the remainder bound \(\frac{|x|^{n+1}}{(n+1)!} \to 0\) to prove the Maclaurin series of \(\sin x\) converges to \(\sin x\) for every \(x\).`,
          },
          display: [
            String.raw`|R_n(x)| \le \frac{|x|^{n+1}}{(n+1)!} \xrightarrow{n \to \infty} 0 \quad \text{for every fixed } x`,
          ],
          preset: { degree: 9 },
          presetCaption: {
            ko: String.raw`\(n = 9\): \([-\pi, \pi]\)에서 띠의 반폭이 \(\pi^{10}/10! \approx 0.0258\)까지 좁혀집니다.`,
            en: String.raw`\(n = 9\): on \([-\pi, \pi]\) the envelope's half-width narrows to \(\pi^{10}/10! \approx 0.0258\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin\)의 모든 도함수는 \(\pm\sin\) 또는 \(\pm\cos\)이므로 \(|f^{(n+1)}(c)| \le 1\)입니다. 라그랑주 나머지는 \(R_n(x) = \frac{f^{(n+1)}(c)}{(n+1)!}x^{n+1}\)이므로 \(|R_n(x)| \le \frac{|x|^{n+1}}{(n+1)!}\)입니다.`,
                en: String.raw`Every derivative of \(\sin\) is \(\pm\sin\) or \(\pm\cos\), so \(|f^{(n+1)}(c)| \le 1\). The Lagrange remainder is \(R_n(x) = \frac{f^{(n+1)}(c)}{(n+1)!}x^{n+1}\), hence \(|R_n(x)| \le \frac{|x|^{n+1}}{(n+1)!}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(a_n = \frac{|x|^{n+1}}{(n+1)!}\)이라 두면 \(\frac{a_{n+1}}{a_n} = \frac{|x|}{n+2}\)입니다. \(n + 2 > 2|x|\)인 \(n\)부터는 \(a_{n+1} \le \frac{1}{2}a_n\)이므로, \(N = \lceil 2|x| \rceil\)에 대해 \(n \ge N\)일 때 \(a_n \le a_N\left(\frac{1}{2}\right)^{n-N} \to 0\)입니다 — 팩토리얼이 거듭제곱을 기하급수적으로 이깁니다.`,
                en: String.raw`Put \(a_n = \frac{|x|^{n+1}}{(n+1)!}\); then \(\frac{a_{n+1}}{a_n} = \frac{|x|}{n+2}\). Once \(n + 2 > 2|x|\) we get \(a_{n+1} \le \frac{1}{2}a_n\), so for \(n \ge N := \lceil 2|x| \rceil\), \(a_n \le a_N\left(\frac{1}{2}\right)^{n-N} \to 0\) — the factorial beats the power geometrically.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(|T_n(x) - \sin x| \to 0\), 즉 매클로린 급수가 모든 \(x\)에서 \(\sin x\)로 수렴합니다.`,
                en: String.raw`Hence \(|T_n(x) - \sin x| \to 0\): the Maclaurin series converges to \(\sin x\) for every \(x\).`,
              },
            },
          ],
        },
        {
          id: 'taylor-uniqueness',
          statement: {
            ko: String.raw`\(f(x) = \sum_{k=0}^{\infty} c_k (x-a)^k\)가 항별 미분 가능하면 \(c_k = \frac{f^{(k)}(a)}{k!}\)임을 증명하세요 (테일러 계수의 유일성).`,
            en: String.raw`If \(f(x) = \sum_{k=0}^{\infty} c_k (x-a)^k\) can be differentiated termwise, prove \(c_k = \frac{f^{(k)}(a)}{k!}\) (uniqueness of Taylor coefficients).`,
          },
          display: [String.raw`f(x) = \sum_{k=0}^{\infty} c_k (x-a)^k \;\Rightarrow\; c_j = \frac{f^{(j)}(a)}{j!}`],
          preset: { degree: 5 },
          presetCaption: {
            ko: String.raw`\(n = 5\): \(T_5(x) = x - x^3/6 + x^5/120\)의 계수가 \(\frac{f^{(k)}(0)}{k!}\)와 일치합니다.`,
            en: String.raw`\(n = 5\): the coefficients of \(T_5(x) = x - x^3/6 + x^5/120\) match \(\frac{f^{(k)}(0)}{k!}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = \sum_{k=0}^{\infty} c_k (x-a)^k\)가 \(a\) 근처에서 수렴하고 항별 미분이 가능하다고 가정합니다.`,
                en: String.raw`Assume \(f(x) = \sum_{k=0}^{\infty} c_k (x-a)^k\) converges near \(a\) and can be differentiated term by term.`,
              },
            },
            {
              text: {
                ko: String.raw`\(j\)번 미분하면 \(f^{(j)}(x) = \sum_{k=j}^{\infty} k(k-1)\cdots(k-j+1)\,c_k\,(x-a)^{k-j}\)입니다 (\(k < j\)인 항은 미분 과정에서 사라집니다).`,
                en: String.raw`Differentiating \(j\) times gives \(f^{(j)}(x) = \sum_{k=j}^{\infty} k(k-1)\cdots(k-j+1)\,c_k\,(x-a)^{k-j}\) (terms with \(k < j\) vanish in the differentiation).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = a\)를 대입하면 \(k > j\)인 항은 \((x-a)^{k-j}\) 때문에 모두 0이 되고, \(k = j\) 항만 남아 \(f^{(j)}(a) = j!\,c_j\), 즉 \(c_j = \frac{f^{(j)}(a)}{j!}\)입니다 — 테일러 계수는 유일합니다.`,
                en: String.raw`Setting \(x = a\) kills every term with \(k > j\) via \((x-a)^{k-j}\); only \(k = j\) survives, giving \(f^{(j)}(a) = j!\,c_j\), i.e. \(c_j = \frac{f^{(j)}(a)}{j!}\) — the Taylor coefficients are unique.`,
              },
            },
          ],
        },
      ];
