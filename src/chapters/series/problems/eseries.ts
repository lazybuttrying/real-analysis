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
            ko: String.raw`\(n \ge 1\)일 때 나머지 추정 \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\)을 증명하세요.`,
            en: String.raw`Prove, for \(n \ge 1\), the remainder bound \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\).`,
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
                ko: String.raw`\(n \ge 1\)이라 가정합니다(\(n = 0\)이면 \(\frac{1}{n \cdot n!}\)이 정의되지 않고 아래의 기하 bound \(\frac{n+1}{n}\)도 성립하지 않습니다). \(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\)입니다.`,
                en: String.raw`Assume \(n \ge 1\) (for \(n = 0\), \(\frac{1}{n \cdot n!}\) is undefined and the geometric bound \(\frac{n+1}{n}\) below is invalid). \(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\).`,
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
            ko: String.raw`\(\left(1+\frac{1}{n}\right)^n\)이 \(e\) 아래에서 증가함을 보이세요.`,
            en: String.raw`Show \(\left(1+\frac{1}{n}\right)^n\) increases toward \(e\) from below.`,
          },
          display: [String.raw`\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right) < e`, String.raw`s_{n+1} - s_n = \sum_{k=0}^{n} (a_{n+1,k} - a_{n,k}) + a_{n+1,n+1} > 0`],
          preset: { n: 30 },
          presetCaption: {
            ko: String.raw`\(n = 30\): 복리 길은 \(e\)에 한참 못 미칩니다.`,
            en: String.raw`\(n = 30\): the compounding road is still far below \(e\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(s_n = \left(1+\frac{1}{n}\right)^n\)라 둡니다. 이항정리로 \(s_n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k}\)이고, \(\binom{n}{k}\frac{1}{n^k} = \frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right)\) (\(k = 0\)이면 빈 곱 \(= 1\))이므로 \(s_n = \sum_{k=0}^{n} a_{n,k}\) (단 \(a_{n,k} = \frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right)\))입니다.`,
                en: String.raw`Put \(s_n = \left(1+\frac{1}{n}\right)^n\). By the binomial theorem \(s_n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k}\), and since \(\binom{n}{k}\frac{1}{n^k} = \frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right)\) (empty product \(= 1\) for \(k = 0\)), \(s_n = \sum_{k=0}^{n} a_{n,k}\) with \(a_{n,k} = \frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`항별 비교: 고정된 \(k \ge 1\)에 대해 \(0 < j \le k-1\)이면 \(\left(1-\frac{j}{n}\right) < \left(1-\frac{j}{n+1}\right)\) (\(n\)이 커지면 빼는 양이 작아짐)이므로 \(a_{n,k} \le a_{n+1,k}\) — \(k \ge 2\)이면 인자 \(j = 1\)에서 엄밀히 작아져 \(a_{n,k} < a_{n+1,k}\)입니다. 모든 항은 양수입니다.`,
                en: String.raw`Termwise comparison: for fixed \(k \ge 1\) and \(0 < j \le k-1\), \(\left(1-\frac{j}{n}\right) < \left(1-\frac{j}{n+1}\right)\) (larger \(n\) subtracts less), so \(a_{n,k} \le a_{n+1,k}\) — and for \(k \ge 2\) the factor \(j = 1\) is strictly smaller, giving \(a_{n,k} < a_{n+1,k}\). All terms are positive.`,
              },
            },
            {
              text: {
                ko: String.raw`정확한 차분은 \(s_{n+1} - s_n = \sum_{k=0}^{n} (a_{n+1,k} - a_{n,k}) + a_{n+1,n+1}\)입니다.

모든 차이 \(a_{n+1,k} - a_{n,k} \ge 0\)이고 추가 항 \(a_{n+1,n+1} > 0\)이므로 \(s_{n+1} - s_n > 0\)입니다.

\(n \ge 2\)이면 \(k = 2\) 항의 차이 \(a_{n+1,2} - a_{n,2} > 0\)도 양의 기여를 합니다.

\(n = 1\)인 경우는 따로 확인합니다: \(s_1 = 1 + 1 = 2\), \(s_2 = 1 + 1 + \frac{1}{4} = 2.25\)이므로 \(s_2 - s_1 = \frac{1}{4} > 0\)입니다(\(a_{1,2}\)는 \(n = 1\)인 합에 존재하지 않으므로, \(k = 2\) 차이를 \(n = 1\)에 적용하면 \(a_{2,2}\)를 이중으로 세게 됩니다).

즉 \(s_n\)은 엄밀히 증가합니다.`,
                en: String.raw`The exact difference is \(s_{n+1} - s_n = \sum_{k=0}^{n} (a_{n+1,k} - a_{n,k}) + a_{n+1,n+1}\).

Every difference \(a_{n+1,k} - a_{n,k} \ge 0\) and the extra term \(a_{n+1,n+1} > 0\), so \(s_{n+1} - s_n > 0\).

For \(n \ge 2\) the \(k = 2\) difference \(a_{n+1,2} - a_{n,2} > 0\) also contributes positively.

The case \(n = 1\) is checked directly: \(s_1 = 1 + 1 = 2\) and \(s_2 = 1 + 1 + \frac{1}{4} = 2.25\), so \(s_2 - s_1 = \frac{1}{4} > 0\) (the term \(a_{1,2}\) does not exist in the \(n = 1\) sum, so applying the \(k = 2\) gain at \(n = 1\) would double-count \(a_{2,2}\)).

So \(s_n\) is strictly increasing.`,
              },
            },
            {
              text: {
                ko: String.raw`각 인자는 \(\left(1-\frac{j}{n}\right) \le 1\)입니다.

\(k = 0\)이면 빈 곱이라 \(a_{n,0} = \frac{1}{0!} = 1\)이고, \(k = 1\)이면 유일한 인자가 \(j = 0\)인 \(1\)이라 \(a_{n,1} = \frac{1}{1!} = 1\) — 등호가 성립합니다.

\(k \ge 2\)이면 \(j = 1\) 인자가 엄격히 \(1\)보다 작아 \(a_{n,k} < \frac{1}{k!}\)입니다.

따라서 \(a_{n,k} \le \frac{1}{k!}\) (등호는 \(k = 0, 1\)에서만)이고, \(s_n \le \sum_{k=0}^{n}\frac{1}{k!} < \sum_{k=0}^{\infty}\frac{1}{k!} = e\)입니다 — \(s_n\)은 \(e\) 아래에 있고, 극한 \(L = \lim s_n\)은 \(L \le e\)를 만족합니다.`,
                en: String.raw`Each factor satisfies \(\left(1-\frac{j}{n}\right) \le 1\).

For \(k = 0\) the product is empty, so \(a_{n,0} = \frac{1}{0!} = 1\); for \(k = 1\) the only factor is \(j = 0\), giving \(1\), so \(a_{n,1} = \frac{1}{1!} = 1\) — equality holds.

For \(k \ge 2\) the factor \(j = 1\) is strictly below \(1\), so \(a_{n,k} < \frac{1}{k!}\).

Hence \(a_{n,k} \le \frac{1}{k!}\) (equality only for \(k = 0, 1\)), and \(s_n \le \sum_{k=0}^{n}\frac{1}{k!} < \sum_{k=0}^{\infty}\frac{1}{k!} = e\) — \(s_n\) stays below \(e\), and its limit \(L = \lim s_n\) satisfies \(L \le e\).`,
              },
            },
            {
              text: {
                ko: String.raw`극한이 정확히 \(e\)임을 보입니다.

\(K\)를 고정하면 \(n \ge K\)일 때 \(s_n \ge \sum_{k=0}^{K} a_{n,k}\)입니다.

고정된 \(k\)에 대해 \(n \to \infty\)이면 각 인자 \(\left(1-\frac{j}{n}\right) \to 1\)이므로 \(a_{n,k} \to \frac{1}{k!}\)입니다.

따라서 \(L \ge \sum_{k=0}^{K} \frac{1}{k!}\)가 모든 \(K\)에 대해 성립하고, \(K \to \infty\)로 보내면 \(L \ge e\)입니다.

앞 단계의 \(L \le e\)와 합치면 \(L = e\)입니다 — \(s_n\)은 아래에서 \(e\)로 증가합니다.`,
                en: String.raw`It remains to show the limit is exactly \(e\).

Fix \(K\); for \(n \ge K\), \(s_n \ge \sum_{k=0}^{K} a_{n,k}\).

For fixed \(k\), as \(n \to \infty\) each factor \(\left(1-\frac{j}{n}\right) \to 1\), so \(a_{n,k} \to \frac{1}{k!}\).

Hence \(L \ge \sum_{k=0}^{K} \frac{1}{k!}\) for every \(K\), and letting \(K \to \infty\) gives \(L \ge e\).

Combined with \(L \le e\) from the previous step, \(L = e\) — \(s_n\) increases to \(e\) from below.`,
              },
            },
          ],
        },
      ];
