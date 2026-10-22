import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Cantor's theorem scene
 * (Tao, Thm 8.3.1: |X| < |P(X)|). This is the diagonal theorem about power
 * sets -- not the Cantor set of the topology chapter.
 * Imports nothing except types. Verified numbers (tests/cantor-theorem.test.ts):
 *   n = 5: diagonal = [0,0,0,0,0], flipped = [1,1,1,1,1],
 *   diffColumn = [0,1,0,1,0]; column i itself always witnesses the
 *   difference, since flipped[i] = 1 - table[i][i].
 */
export const cantorTheoremProblems: readonly ProblemMeta[] = [
  {
    id: 'cantor-proof',
    statement: {
      ko: String.raw`칸토어 정리를 완전히 증명하세요: 임의의 집합 \(X\)에 대해 \(\lvert X \rvert < \lvert\mathcal{P}(X) \rvert\)입니다.

단사 \(x \mapsto \{x\}\)로 \(\le\)를 얻고, \(D = \{x : x \notin f(x)\}\) 대각선 논법으로 전사가 없음을 보이세요.`,
      en: String.raw`Prove Cantor's theorem completely: for every set \(X\), \(\lvert X \rvert < \lvert\mathcal{P}(X) \rvert\).

Get \(\le\) from the injection \(x \mapsto \{x\}\), and rule out any surjection with the diagonal set \(D = \{x : x \notin f(x)\}\).`,
    },
    display: [
      String.raw`D = \{x \in X : x \notin f(x)\}, \qquad y \in D \iff y \notin f(y)`,
      String.raw`\lvert X \rvert \le \lvert\mathcal{P}(X)\rvert \ \text{ via } \ x \mapsto \{x\}, \qquad \lvert X \rvert \ne \lvert\mathcal{P}(X)\rvert \ \text{(no surjection)}`,
    ],
    preset: { n: 5 },
    presetCaption: {
      ko: String.raw`\(n = 5\): 표에 나열된 5개의 행 뒤에 뒤집힌 행 \(11111\)이 있고, 이는 각 row \(i\)와 column \(i\)에서 다릅니다 — 아래 증명의 유한 버전입니다.`,
      en: String.raw`\(n = 5\): the flipped row \(11111\) sits below the 5 listed rows and differs from row \(i\) at column \(i\) — the finite version of the proof below.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\lvert X \rvert \le \lvert\mathcal{P}(X)\rvert\)는 단사함수 \(\iota: X \to \mathcal{P}(X)\), \(\iota(x) = \{x\}\)로 얻습니다: \(\{x\} = \{y\}\)이면 \(x = y\)이므로 \(\iota\)는 단사입니다. (\(X = \varnothing\)이면 공함수가 단사입니다.)`,
          en: String.raw`\(\lvert X \rvert \le \lvert\mathcal{P}(X)\rvert\) comes from the injection \(\iota: X \to \mathcal{P}(X)\), \(\iota(x) = \{x\}\): if \(\{x\} = \{y\}\) then \(x = y\), so \(\iota\) is injective. (For \(X = \varnothing\) the empty map is injective.)`,
        },
      },
      {
        text: {
          ko: String.raw`이제 어떤 \(f: X \to \mathcal{P}(X)\)도 전사가 아님을 보입니다.

대각선 집합 \(D = \{x \in X : x \notin f(x)\}\)를 둡니다 (\(D \subseteq X\)이므로 \(D \in \mathcal{P}(X)\)).

\(f\)가 전사라면 \(D = f(y)\)인 \(y \in X\)가 존재합니다.`,
          en: String.raw`Now we show no \(f: X \to \mathcal{P}(X)\) is surjective.

Form the diagonal set \(D = \{x \in X : x \notin f(x)\}\) (\(D \subseteq X\), so \(D \in \mathcal{P}(X)\)).

If \(f\) were surjective, some \(y \in X\) would satisfy \(D = f(y)\).`,
        },
      },
      {
        text: {
          ko: String.raw`그 \(y\)에 대해: \(y \in D\)는 정의에 의해 \(y \notin f(y)\)와 동치이고, \(f(y) = D\)이므로 이는 \(y \notin D\)와 동치입니다.

즉 \(y \in D \iff y \notin D\) — 모순입니다.

따라서 그런 \(y\)는 없고, \(D\)는 \(f\)의 치역에 없으며, \(f\)는 전사가 아닙니다.`,
          en: String.raw`For that \(y\): \(y \in D\) is equivalent by definition to \(y \notin f(y)\), and since \(f(y) = D\), this is equivalent to \(y \notin D\).

So \(y \in D \iff y \notin D\) — a contradiction.

Hence no such \(y\) exists, \(D\) is not in the range of \(f\), and \(f\) is not surjective.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\lvert X \rvert = \lvert\mathcal{P}(X)\rvert\)라면 전단사함수가 존재하고, 전단사는 특히 전사이므로 위와 모순입니다.

따라서 \(\lvert X \rvert \ne \lvert\mathcal{P}(X)\rvert\)이며, 첫 단계의 \(\le\)와 합쳐 \(\lvert X \rvert < \lvert\mathcal{P}(X)\rvert\)를 얻습니다.

증명 끝.`,
          en: String.raw`If \(\lvert X \rvert = \lvert\mathcal{P}(X)\rvert\) there would be a bijection, hence in particular a surjection — contradicting the above.

So \(\lvert X \rvert \ne \lvert\mathcal{P}(X)\rvert\), and together with \(\le\) from the first step, \(\lvert X \rvert < \lvert\mathcal{P}(X)\rvert\).

QED.`,
        },
      },
    ],
  },
  {
    id: 'cantor-uncountable',
    statement: {
      ko: String.raw`\((0,1)\)이 비가산임을 완전히 증명하세요: 열거를 가정하고 소수 전개를 써서, \(0\)과 \(9\)를 피하면서 \(n\)번째 수의 \(n\)번째 자리와 다른 자릿수를 골라 대각선 수 \(y\)를 만드세요 (\(0.0999\ldots = 0.1000\ldots\)의 모호함을 피하기 위함).`,
      en: String.raw`Prove \((0,1)\) is uncountable, completely: assume an enumeration, write out decimal expansions, and build a diagonal number \(y\) whose \(n\)-th digit differs from the \(n\)-th digit of the \(n\)-th number while avoiding the digits \(0\) and \(9\) (to dodge the \(0.0999\ldots = 0.1000\ldots\) ambiguity).`,
    },
    display: [
      String.raw`y = 0.e_1 e_2 \cdots, \qquad e_n = \begin{cases} 4 & d_{nn} = 5 \\ 5 & d_{nn} \ne 5 \end{cases}`,
      String.raw`e_n \ne d_{nn}, \quad e_n \notin \{0, 9\}, \quad y \in (0,1), \quad y \ne x_n \ \forall n`,
    ],
    preset: { n: 5 },
    presetCaption: {
      ko: String.raw`\(n = 5\): 5개의 행으로는 \(2^5 = 32\)개의 가능한 행을 다 못 세듯, \((0,1)\)의 수들을 아무리 나열해도 대각선 수는 빠져나갑니다.`,
      en: String.raw`\(n = 5\): just as 5 rows cannot exhaust the \(2^5 = 32\) possible rows, no enumeration of \((0,1)\) can catch the diagonal number.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((0,1)\)이 가산이라 가정하고 열거 \(x_1, x_2, \ldots\)를 둡니다. 각 \(x_n\)을 소수 전개 \(x_n = 0.d_{n1}d_{n2}\cdots\)로 씁니다 (\(d_{nk} \in \{0,\ldots,9\}\)).`,
          en: String.raw`Assume \((0,1)\) is countable and fix an enumeration \(x_1, x_2, \ldots\). Write each \(x_n\) in decimal as \(x_n = 0.d_{n1}d_{n2}\cdots\) (\(d_{nk} \in \{0,\ldots,9\}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`대각선 수 \(y = 0.e_1 e_2 \cdots\)를 \(e_n = 4\) (\(d_{nn} = 5\)인 경우), \(e_n = 5\) (그 외)로 정의합니다. 그러면 모든 \(n\)에 대해 \(e_n \ne d_{nn}\)이고 \(e_n \in \{4, 5\}\)이므로 \(0\)과 \(9\)가 전혀 등장하지 않습니다.`,
          en: String.raw`Define the diagonal number \(y = 0.e_1 e_2 \cdots\) by \(e_n = 4\) if \(d_{nn} = 5\), else \(e_n = 5\). Then \(e_n \ne d_{nn}\) for every \(n\), and \(e_n \in \{4, 5\}\), so the digits \(0\) and \(9\) never occur.`,
        },
      },
      {
        text: {
          ko: String.raw`\(y \in (0,1)\)입니다: \(0.444\ldots \le y \le 0.555\ldots\).

이제 \(y = x_n\)이라 하면, \(y\)의 소수 전개에는 \(0\)도 \(9\)도 없으므로 꼬리가 무한 \(0\) 또는 무한 \(9\)인 다른 전개가 있을 수 없고 — 두 소수 전개가 같은 수를 나타내면서 다를 수 있는 경우는 정확히 한쪽이 무한 \(0\), 다른 쪽이 무한 \(9\)로 끝날 때뿐이므로 — \(y\)의 전개는 유일합니다.

따라서 \(x_n\)의 \(n\)번째 자리는 \(e_n\)이어야 하지만, 이는 \(e_n \ne d_{nn}\)에 모순됩니다.`,
          en: String.raw`\(y \in (0,1)\): \(0.444\ldots \le y \le 0.555\ldots\).

If \(y = x_n\), then since the decimal expansion of \(y\) contains no \(0\) or \(9\), it cannot have an alternative expansion — two decimal expansions of the same number can differ only when one ends in infinite \(0\)s and the other in infinite \(9\)s — so the expansion of \(y\) is unique.

Hence the \(n\)-th digit of \(x_n\) must be \(e_n\), contradicting \(e_n \ne d_{nn}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(y\)는 어떤 \(x_n\)과도 다르고, 열거가 \((0,1)\) 전체가 아니라는 모순이 생깁니다.

\((0,1)\)은 가산이 아니므로 비가산입니다.

증명 끝.`,
          en: String.raw`So \(y\) differs from every \(x_n\), contradicting the claim that the enumeration covers \((0,1)\).

Hence \((0,1)\) is not countable: it is uncountable.

QED.`,
        },
      },
    ],
  },
  {
    id: 'cantor-finite',
    statement: {
      ko: String.raw`유한집합 \(\lvert X \rvert = n\)에 대해 \(\lvert\mathcal{P}(X)\rvert = 2^n > n\)임을 귀납법으로 완전히 증명하세요.

위 그림의 \(n \times n\) 표와 연결지어 설명하세요: \(2^n\)개의 가능한 행 중 \(n\)개만 나열되어 있습니다.`,
      en: String.raw`For finite \(\lvert X \rvert = n\), prove \(\lvert\mathcal{P}(X)\rvert = 2^n > n\) completely by induction.

Connect it to the picture above: only \(n\) of the \(2^n\) possible rows are listed in the \(n \times n\) table.`,
    },
    display: [
      String.raw`\mathcal{P}(X) = \mathcal{P}(X') \;\sqcup\; \{A \cup \{x_0\} : A \in \mathcal{P}(X')\}, \qquad \lvert\mathcal{P}(X)\rvert = 2\,\lvert\mathcal{P}(X')\rvert`,
      String.raw`\lvert\mathcal{P}(X)\rvert = 2^n > n \qquad (n \ge 0)`,
    ],
    preset: { n: 5 },
    presetCaption: {
      ko: String.raw`\(n = 5\): 가능한 0/1 행은 \(2^5 = 32\)개인데 표에는 5개만 있습니다 — 뒤집힌 행이 목록 밖에 있는 것은 필연입니다.`,
      en: String.raw`\(n = 5\): there are \(2^5 = 32\) possible 0/1 rows but only 5 are listed — the flipped row being off the list is inevitable.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\lvert X \rvert = n\)일 때 \(\lvert\mathcal{P}(X)\rvert = 2^n\)을 \(n\)에 대한 귀납법으로 증명합니다. \(n = 0\): \(X = \varnothing\)이고 \(\mathcal{P}(\varnothing) = \{\varnothing\}\)이므로 \(\lvert\mathcal{P}(X)\rvert = 1 = 2^0\)입니다.`,
          en: String.raw`We prove \(\lvert\mathcal{P}(X)\rvert = 2^n\) for \(\lvert X \rvert = n\) by induction on \(n\). Base \(n = 0\): \(X = \varnothing\) and \(\mathcal{P}(\varnothing) = \{\varnothing\}\), so \(\lvert\mathcal{P}(X)\rvert = 1 = 2^0\).`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(\lvert X \rvert = n+1\)이고 \(x_0 \in X\), \(X' = X \setminus \{x_0\}\)라 둡니다.

\(X\)의 부분집합은 \(x_0\)을 포함하거나 포함하지 않으므로, \(\mathcal{P}(X) = \mathcal{P}(X') \;\sqcup\; \{A \cup \{x_0\} : A \in \mathcal{P}(X')\}\) (서로소 합집합)입니다.

따라서 \(\lvert\mathcal{P}(X)\rvert = 2\,\lvert\mathcal{P}(X')\rvert = 2 \cdot 2^n = 2^{n+1}\) (귀납 가설 사용).`,
          en: String.raw`Inductive step: let \(\lvert X \rvert = n+1\), pick \(x_0 \in X\) and put \(X' = X \setminus \{x_0\}\).

Subsets of \(X\) either contain \(x_0\) or not, so \(\mathcal{P}(X) = \mathcal{P}(X') \;\sqcup\; \{A \cup \{x_0\} : A \in \mathcal{P}(X')\}\) (disjoint union).

Hence \(\lvert\mathcal{P}(X)\rvert = 2\,\lvert\mathcal{P}(X')\rvert = 2 \cdot 2^n = 2^{n+1}\) by the induction hypothesis.`,
        },
      },
      {
        text: {
          ko: String.raw`\(2^n > n\) (\(n \ge 0\))도 귀납법으로: \(n = 0\)에서 \(1 > 0\).

\(2^n > n\)이면 \(2^{n+1} = 2 \cdot 2^n > 2n \ge n+1\) (\(n \ge 1\); \(n = 0\)은 직접 확인)입니다.

따라서 \(\lvert\mathcal{P}(X)\rvert = 2^n > n = \lvert X \rvert\).`,
          en: String.raw`Also \(2^n > n\) (\(n \ge 0\)) by induction: \(1 > 0\) at \(n = 0\); if \(2^n > n\) then \(2^{n+1} = 2 \cdot 2^n > 2n \ge n+1\) (for \(n \ge 1\); check \(n = 0\) directly). So \(\lvert\mathcal{P}(X)\rvert = 2^n > n = \lvert X \rvert\).`,
        },
      },
      {
        text: {
          ko: String.raw`그림과의 연결: \(X = \{0,\ldots,n-1\}\)의 부분집합은 0/1 행 \(2^n\)개와 일대일 대응합니다.

\(n \times n\) 표는 그 중 \(n\)개만 나열한 것이고, \(2^n > n\)이므로 나열되지 않은 행이 반드시 존재합니다 — 대각선을 뒤집은 행이 그 중 하나를 명시적으로 만들어냅니다.

이것이 칸토어 정리의 유한 버전입니다.`,
          en: String.raw`Connection to the picture: subsets of \(X = \{0,\ldots,n-1\}\) correspond bijectively to the \(2^n\) binary rows.

The \(n \times n\) table lists only \(n\) of them, and since \(2^n > n\) some row is necessarily missing — flipping the diagonal explicitly constructs one.

This is the finite version of Cantor's theorem.`,
        },
      },
    ],
  },
];
