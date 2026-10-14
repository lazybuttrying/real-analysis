import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'irrational',
          statement: {
            ko: String.raw`\(e\)가 무리수임을 증명하세요.`,
            en: String.raw`Prove that \(e\) is irrational.`,
          },
          display: [String.raw`0 < q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right) < 1`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 급수는 이미 \(e\)에 \(3\times 10^{-8}\) 이내로 다가갑니다.`,
            en: String.raw`\(n = 10\): the series is already within \(3\times 10^{-8}\) of \(e\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`먼저 \(2 < e < 3\)입니다: \(e = \sum_{k=0}^{\infty}\frac{1}{k!} > 1+1 = 2\)이고, \(k \ge 1\)에서 \(k! \ge 2^{k-1}\)이므로 \(e < 1+1+\frac{1}{2}+\frac{1}{4}+\cdots = 3\)입니다. 따라서 \(e = \frac{p}{q}\)라면 \(q \ge 2\)입니다.`,
                en: String.raw`First, \(2 < e < 3\): \(e = \sum_{k=0}^{\infty}\frac{1}{k!} > 1+1 = 2\), and since \(k! \ge 2^{k-1}\) for \(k \ge 1\), \(e < 1+1+\frac{1}{2}+\frac{1}{4}+\cdots = 3\). So if \(e = \frac{p}{q}\) then \(q \ge 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(q!e = (q-1)!\,p\)는 정수이고, \(\sum_{k=0}^{q}\frac{q!}{k!}\)도 정수입니다. 꼬리를 \(T = q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right)\)라 두면, \(T = \frac{1}{q+1}+\frac{1}{(q+1)(q+2)}+\cdots\)이므로 \(0 < T < \frac{1}{q+1}\left(1+\frac{1}{q+1}+\cdots\right) = \frac{1}{q} \le \frac{1}{2} < 1\)입니다.`,
                en: String.raw`\(q!e = (q-1)!\,p\) is an integer, and so is \(\sum_{k=0}^{q}\frac{q!}{k!}\). Put \(T = q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right)\); then \(T = \frac{1}{q+1}+\frac{1}{(q+1)(q+2)}+\cdots\), so \(0 < T < \frac{1}{q+1}\left(1+\frac{1}{q+1}+\cdots\right) = \frac{1}{q} \le \frac{1}{2} < 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`그런데 \(q!e = \text{(정수)} + T\)이므로 \(q!e\)는 정수가 아닙니다 — 모순입니다. 따라서 \(e\)는 무리수입니다.`,
                en: String.raw`But \(q!e = \text{(integer)} + T\) with \(0 < T < 1\) is not an integer — a contradiction. Hence \(e\) is irrational.`,
              },
            },
          ],
        },
        {
          id: 'remainder',
          statement: {
            ko: String.raw`나머지 추정 \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\)을 증명하세요.`,
            en: String.raw`Prove the remainder bound \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\).`,
          },
          display: [String.raw`R_n < \frac{1}{(n+1)!}\left(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots\right)=\frac{1}{n\cdot n!}`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 실제 나머지 \(\approx 2.73\times 10^{-8}\), 한계 \(\approx 2.76\times 10^{-8}\).`,
            en: String.raw`\(n = 10\): actual remainder \(\approx 2.73\times 10^{-8}\), bound \(\approx 2.76\times 10^{-8}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\)입니다.`,
                en: String.raw`\(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`괄호 안은 \(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots = \frac{n+1}{n}\)보다 작습니다 (기하급수).`,
                en: String.raw`The bracket is less than \(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots = \frac{n+1}{n}\) (geometric series).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(R_n < \frac{1}{(n+1)!}\cdot\frac{n+1}{n} = \frac{1}{n\cdot n!}\)입니다. 팩토리얼 급수가 압도적으로 빠른 이유가 바로 이 추정입니다.`,
                en: String.raw`Hence \(R_n < \frac{1}{(n+1)!}\cdot\frac{n+1}{n} = \frac{1}{n\cdot n!}\). This estimate is exactly why the factorial series wins by a landslide.`,
              },
            },
          ],
        },
        {
          id: 'compound',
          statement: {
            ko: String.raw`\(\left(1+\frac{1}{n}\right)^n\)이 \(e\) 아래에서 증가함을 보이세요. (단조성의 엄밀한 증명은 생략하고 아이디어 수준으로 짚습니다.)`,
            en: String.raw`Show \(\left(1+\frac{1}{n}\right)^n\) increases toward \(e\) from below. (Monotonicity is sketched at idea level.)`,
          },
          display: [String.raw`\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right) < e`],
          preset: { n: 30 },
          presetCaption: {
            ko: String.raw`\(n = 30\): 복리 길은 \(e\)에 한참 못 미칩니다.`,
            en: String.raw`\(n = 30\): the compounding road is still far below \(e\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`이항정리로 \(\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k} = \sum_{k=0}^{n}\frac{1}{k!}(1)\left(1-\frac{1}{n}\right)\cdots\left(1-\frac{k-1}{n}\right)\)입니다.`,
                en: String.raw`By the binomial theorem, \(\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k} = \sum_{k=0}^{n}\frac{1}{k!}(1)\left(1-\frac{1}{n}\right)\cdots\left(1-\frac{k-1}{n}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`각 인자 \(\left(1-\frac{j}{n}\right) < 1\)이므로, \(\left(1+\frac{1}{n}\right)^n < \sum_{k=0}^{n}\frac{1}{k!} < e\)입니다.`,
                en: String.raw`Each factor \(\left(1-\frac{j}{n}\right) < 1\), so \(\left(1+\frac{1}{n}\right)^n < \sum_{k=0}^{n}\frac{1}{k!} < e\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n\)이 커지면 인자 \(\left(1-\frac{j}{n}\right)\)들이 \(1\)에 가까워지므로 수열은 증가합니다 (엄밀한 단조성 증명은 생략합니다 — 아이디어 수준).`,
                en: String.raw`As \(n\) grows, the factors \(\left(1-\frac{j}{n}\right)\) approach \(1\), so the sequence increases (the rigorous monotonicity proof is omitted — idea level).`,
              },
            },
          ],
        },
      ];
