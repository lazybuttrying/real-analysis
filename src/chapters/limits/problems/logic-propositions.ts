import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the logic-propositions scene
 * (interactive truth tables for and / or / implies / iff, with the
 * contrapositive (not Q) -> (not P) and converse Q -> P columns).
 *
 * All truth values below were verified row by row against the model
 * (tests/logic-propositions.test.ts).
 */
export const logicPropositionsProblems: readonly ProblemMeta[] = [
  {
    id: 'logic-propositions-contrapositive-equivalence',
    statement: {
      ko: String.raw`진리표를 이용해 \(P \to Q\)가 그 대우 \(\lnot Q \to \lnot P\)와 논리적으로 동치임을 완전히 증명하세요.

네 행을 모두 직접 계산하고, 왜 모든 행에서 진릿값이 일치하면 논리적 동치인지 설명하세요.`,
      en: String.raw`Use a truth table to prove completely that \(P \to Q\) is logically equivalent to its contrapositive \(\lnot Q \to \lnot P\).

Compute all four rows explicitly and explain why matching truth values in every row means logical equivalence.`,
    },
    display: [
      String.raw`(P \to Q) \;\equiv\; (\lnot Q \to \lnot P)`,
    ],
    preset: { connective: 'implies', contrapositive: true },
    presetCaption: {
      ko: String.raw`연결사 함의, 대우 열 표시: \(P \to Q\) 열과 \(\lnot Q \to \lnot P\) 열이 4개 행에서 모두 일치하고, 역 \(Q \to P\) 열은 \((T, F)\) 행에서 다릅니다.`,
      en: String.raw`Connective: implication, contrapositive column shown: the \(P \to Q\) and \(\lnot Q \to \lnot P\) columns agree in all 4 rows, while the converse \(Q \to P\) column differs in the \((T, F)\) row.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(P \to Q\)는 정의상 \(\lnot P \lor Q\)와 같습니다.

네 행을 직접 계산합니다.

\((P, Q) = (T, T)\): \(P \to Q = T\), 대우 \((\lnot Q) \to (\lnot P) = F \to F = T\).

\((T, F)\): \(P \to Q = T \to F = F\), 대우 \(T \to F = F\).`,
          en: String.raw`By definition \(P \to Q\) is \(\lnot P \lor Q\).

Compute the four rows explicitly.

\((P, Q) = (T, T)\): \(P \to Q = T\), contrapositive \((\lnot Q) \to (\lnot P) = F \to F = T\).

\((T, F)\): \(P \to Q = T \to F = F\), contrapositive \(T \to F = F\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((P, Q) = (F, T)\): \(P \to Q = F \to T = T\) (전건이 거짓이면 함의는 참), 대우 \(F \to T = T\).

\((F, F)\): \(P \to Q = F \to F = T\), 대우 \(T \to T = T\).

따라서 네 행의 진릿값 쌍은 \((T,T), (F,F), (T,T), (T,T)\) — 두 열이 행마다 완전히 일치합니다.`,
          en: String.raw`\((P, Q) = (F, T)\): \(P \to Q = F \to T = T\) (an implication with a false antecedent is true), contrapositive \(F \to T = T\).

\((F, F)\): \(P \to Q = F \to F = T\), contrapositive \(T \to T = T\).

So the row-by-row truth pairs are \((T,T), (F,F), (T,T), (T,T)\) — the two columns match in every row.`,
        },
      },
      {
        text: {
          ko: String.raw`모든 행에서 진릿값이 일치한다는 것은, \(P\)와 \(Q\)에 어떤 진릿값을 대입해도 두 명제가 같은 값을 가진다는 뜻입니다.

"언제 참인가"에 대한 답이 가능한 모든 경우에서 똑같으므로, 두 명제는 논리적으로 동치입니다.

이것이 대우 증명법의 정당화입니다: \(P \to Q\) 대신 동치인 \(\lnot Q \to \lnot P\)를 증명해도 됩니다.`,
          en: String.raw`Matching truth values in every row means the two propositions take the same value under every assignment of truth values to \(P\) and \(Q\).

Their "when is this true" answers coincide in every possible case, so the two propositions are logically equivalent.

This justifies proof by contrapositive: instead of \(P \to Q\) we may prove the equivalent \(\lnot Q \to \lnot P\).`,
        },
      },
    ],
  },
  {
    id: 'logic-propositions-de-morgan',
    statement: {
      ko: String.raw`진리표로 드모르간 법칙 \(\lnot(P \land Q) \iff (\lnot P) \lor (\lnot Q)\)를 증명하세요.

네 행에서 양변의 진릿값을 모두 계산하고, 어느 행에서 \(\land\)가 \(F\)가 되는지 관찰하세요.`,
      en: String.raw`Prove De Morgan's law \(\lnot(P \land Q) \iff (\lnot P) \lor (\lnot Q)\) with a truth table.

Compute both sides in all four rows, and observe in which rows the \(\land\) column is \(F\).`,
    },
    display: [
      String.raw`\lnot(P \land Q) \;\iff\; (\lnot P) \lor (\lnot Q)`,
    ],
    preset: { connective: 'and', contrapositive: true },
    presetCaption: {
      ko: String.raw`연결사 논리곱, 대우 열 표시: \(P \land Q\) 열에서 \(T\)인 행은 \((T, T)\) 하나뿐이며, 그 행에서만 \(\lnot(P \land Q)\)와 \((\lnot P) \lor (\lnot Q)\)가 함께 \(F\)가 됩니다.`,
      en: String.raw`Connective: conjunction, contrapositive column shown: the \(P \land Q\) column is \(T\) only in the \((T, T)\) row, and only in that row are \(\lnot(P \land Q)\) and \((\lnot P) \lor (\lnot Q)\) both \(F\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(P \land Q\) 열: \((T,T) \to T\), \((T,F) \to F\), \((F,T) \to F\), \((F,F) \to F\) — \(T\)는 \((T,T)\) 행 하나뿐입니다. 따라서 좌변 \(\lnot(P \land Q)\)의 열은 \((F, T, T, T)\) 순서가 됩니다.`,
          en: String.raw`First the \(P \land Q\) column: \((T,T) \to T\), \((T,F) \to F\), \((F,T) \to F\), \((F,F) \to F\) — \(T\) occurs only in the \((T, T)\) row. Hence the left side \(\lnot(P \land Q)\) has the column \((F, T, T, T)\) in row order.`,
        },
      },
      {
        text: {
          ko: String.raw`우변 \((\lnot P) \lor (\lnot Q)\)를 행마다 계산합니다.

\((T,T)\): \(F \lor F = F\).

\((T,F)\): \(F \lor T = T\).

\((F,T)\): \(T \lor F = T\).

\((F,F)\): \(T \lor T = T\).

즉 우변의 열도 \((F, T, T, T)\) — 좌변과 행마다 일치합니다.`,
          en: String.raw`Now compute the right side \((\lnot P) \lor (\lnot Q)\) row by row.

\((T,T)\): \(F \lor F = F\).

\((T,F)\): \(F \lor T = T\).

\((F,T)\): \(T \lor F = T\).

\((F,F)\): \(T \lor T = T\).

So the right side also has column \((F, T, T, T)\) — matching the left side row by row.`,
        },
      },
      {
        text: {
          ko: String.raw`두 열이 모든 행에서 일치하므로 \(\lnot(P \land Q)\)와 \((\lnot P) \lor (\lnot Q)\)는 논리적으로 동치입니다.

관찰: \(P \land Q\)가 \(F\)가 되는 세 행 — 곧 \(P\)와 \(Q\) 중 적어도 하나가 거짓인 행 — 에서 정확히 우변도 \(T\)가 됩니다.

"둘 다 참이 아니다"와 "적어도 하나가 거짓이다"는 같은 말입니다.`,
          en: String.raw`Since the two columns agree in every row, \(\lnot(P \land Q)\) and \((\lnot P) \lor (\lnot Q)\) are logically equivalent.

Observe: in exactly the three rows where \(P \land Q\) is \(F\) — i.e. where at least one of \(P, Q\) is false — the right side is \(T\).

"Not both are true" says the same thing as "at least one is false".`,
        },
      },
    ],
  },
  {
    id: 'logic-propositions-converse-not-equivalent',
    statement: {
      ko: String.raw`\(P \to Q\)가 그 역 \(Q \to P\)와 동치가 아님을 보이세요.

두 값이 갈라지는 행 \((P, Q) = (T, F)\)를 직접 제시하고, 대신 성립하는 동치 \(P \to Q \iff \lnot P \lor Q\)를 진리표로 증명하세요.`,
      en: String.raw`Show that \(P \to Q\) is NOT equivalent to its converse \(Q \to P\).

Exhibit the row \((P, Q) = (T, F)\) where they split, and instead prove the true equivalence \(P \to Q \iff \lnot P \lor Q\) with a truth table.`,
    },
    display: [
      String.raw`(P \to Q) \;\not\equiv\; (Q \to P), \qquad (P \to Q) \;\equiv\; (\lnot P \lor Q)`,
    ],
    preset: { connective: 'implies', contrapositive: false },
    presetCaption: {
      ko: String.raw`연결사 함의, 대우 열 숨김: \(P \to Q\) 열 \((T, F, T, T)\)와 역 \(Q \to P\) 열 \((T, T, F, T)\)가 \((T, F)\) 행에서 \(F\) 대 \(T\)로 갈라집니다.`,
      en: String.raw`Connective: implication, contrapositive column hidden: the \(P \to Q\) column \((T, F, T, T)\) and the converse \(Q \to P\) column \((T, T, F, T)\) split \(F\) vs \(T\) in the \((T, F)\) row.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((P, Q) = (T, F)\) 행을 봅니다.

\(P \to Q = T \to F = F\)인 반면, 역 \(Q \to P = F \to T = T\)입니다.

한 행에서라도 진릿값이 다르면 논리적 동치가 아니므로, \(P \to Q\)와 \(Q \to P\)는 동치가 아닙니다.

직관적으로도: "\(x\)가 소수이면 \(x\)는 홀수이거나 \(2\)이다"는 참이지만, 그 역은 거짓입니다.`,
          en: String.raw`Look at the row \((P, Q) = (T, F)\).

There \(P \to Q = T \to F = F\), while the converse \(Q \to P = F \to T = T\).

A single row with different truth values rules out logical equivalence, so \(P \to Q\) and \(Q \to P\) are not equivalent.

Intuitively: "if \(x\) is prime then \(x\) is odd or equal to \(2\)" is true, but its converse is false.`,
        },
      },
      {
        text: {
          ko: String.raw`대신 \(P \to Q \iff \lnot P \lor Q\)를 증명합니다 — 이것이 함의의 정의이기도 합니다.

\(\lnot P \lor Q\)의 열을 계산하면: \((T,T)\): \(F \lor T = T\); \((T,F)\): \(F \lor F = F\); \((F,T)\): \(T \lor T = T\); \((F,F)\): \(T \lor F = T\).

즉 \((T, F, T, T)\) — \(P \to Q\) 열과 행마다 일치합니다.`,
          en: String.raw`Instead we prove \(P \to Q \iff \lnot P \lor Q\) — which is also the definition of implication.

Computing the \(\lnot P \lor Q\) column: \((T,T)\): \(F \lor T = T\); \((T,F)\): \(F \lor F = F\); \((F,T)\): \(T \lor T = T\); \((F,F)\): \(T \lor F = T\).

That is \((T, F, T, T)\) — matching the \(P \to Q\) column row by row.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(P \to Q\)는 \(\lnot P \lor Q\)와 동치입니다.

이 형태는 부정의 이동을 쉽게 만듭니다: \(\lnot(P \to Q) \equiv \lnot(\lnot P \lor Q) \equiv P \land \lnot Q\) (드모르간).

즉 함의가 거짓이 되는 경우는 정확히 한 가지 — 전건은 참인데 후건이 거짓인 \((T, F)\) 행뿐입니다.`,
          en: String.raw`Hence \(P \to Q\) is equivalent to \(\lnot P \lor Q\).

This form makes negations easy to push inward: \(\lnot(P \to Q) \equiv \lnot(\lnot P \lor Q) \equiv P \land \lnot Q\) (by De Morgan).

So there is exactly one way an implication can be false — the row \((T, F)\): true antecedent, false consequent.`,
        },
      },
    ],
  },
];
