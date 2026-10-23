import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the quantifiers scene
 * (forall-exists / exists-forall statements over R, their negations,
 * and the eps-delta continuity pattern for f(t) = 2t at 0).
 *
 * All numbers below were verified against the model
 * (tests/quantifiers.test.ts): for slider x = 2, eps = |2| + 0.5 = 2.5,
 * delta = eps/2 = 1.25, probe t = 0.9 * delta = 1.125,
 * |2t| = 2.25 = 0.9 * eps < eps.
 */
export const quantifiersProblems: readonly ProblemMeta[] = [
  {
    id: 'quantifiers-negate-eps-delta-continuity',
    kind: 'concept',
    statement: {
      ko: String.raw`점 \(a\)에서의 연속성의 \(\varepsilon\)-\(\delta\) 정의 — "모든 \(\varepsilon > 0\)에 대해, 모든 \(x\)에 대해 \(|x-a| < \delta\)이면 \(|f(x)-f(a)| < \varepsilon\)인 \(\delta > 0\)이 존재한다" — 를 완전히 부정하세요.

부정된 명제가 \(f\)에 대해 정확히 무엇을 말하는지 풀어서 설명하세요.`,
      en: String.raw`Negate completely the \(\varepsilon\)-\(\delta\) definition of continuity of \(f\) at \(a\) — "for all \(\varepsilon > 0\) there is \(\delta > 0\) such that for all \(x\), \(|x-a| < \delta\) implies \(|f(x)-f(a)| < \varepsilon\)".

State precisely what the negation says about \(f\).`,
    },
    display: [
      String.raw`\lnot\big(\forall\varepsilon{>}0\ \exists\delta{>}0\ \forall x\,(|x-a|<\delta \to |f(x)-f(a)|<\varepsilon)\big)`,
      String.raw`\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|<\delta \;\land\; |f(x)-f(a)|\ge\varepsilon)`,
    ],
    preset: { statement: 'eps-delta', x: 2, negated: true },
    presetCaption: {
      ko: String.raw`명제 \(\varepsilon\)-\(\delta\) (\(\varepsilon = 2.5\), \(\delta = \varepsilon/2 = 1.25\)), 부정 사슬 표시: 마지막 단계 \(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists t\,(|t| < \delta \land |2t| \ge \varepsilon)\).`,
      en: String.raw`The \(\varepsilon\)-\(\delta\) statement (\(\varepsilon = 2.5\), \(\delta = \varepsilon/2 = 1.25\)), negation chain shown: final step \(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists t\,(|t| < \delta \land |2t| \ge \varepsilon)\).`,
    },
    choices: [
      { ko: String.raw`\(\exists\varepsilon{>}0\ \exists\delta{>}0\ \exists x\,(|x-a|<\delta \land |f(x)-f(a)|\ge\varepsilon)\)`, en: String.raw`\(\exists\varepsilon{>}0\ \exists\delta{>}0\ \exists x\,(|x-a|<\delta \land |f(x)-f(a)|\ge\varepsilon)\)` },
      { ko: String.raw`\(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|<\delta \land |f(x)-f(a)|\ge\varepsilon)\)`, en: String.raw`\(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|<\delta \land |f(x)-f(a)|\ge\varepsilon)\)` },
      { ko: String.raw`\(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|<\delta \to |f(x)-f(a)|\ge\varepsilon)\)`, en: String.raw`\(\exists\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|<\delta \to |f(x)-f(a)|\ge\varepsilon)\)` },
      { ko: String.raw`\(\forall\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|\ge\delta \land |f(x)-f(a)|<\varepsilon)\)`, en: String.raw`\(\forall\varepsilon{>}0\ \forall\delta{>}0\ \exists x\,(|x-a|\ge\delta \land |f(x)-f(a)|<\varepsilon)\)` },
    ],
    correctIndex: 1,
    explanation: {
      ko: String.raw`부정은 양화사를 하나씩 뒤집고 (\(\forall\)는 \(\exists\)로, \(\exists\)는 \(\forall\)로) 마지막 함의를 \(\lnot(P \to Q) \equiv P \land \lnot Q\)로 바꿔 얻습니다. 첫 번째 선택지는 \(\delta\)의 양화사를 뒤집지 않았고, 세 번째는 함의를 그대로 두었으며, 네 번째는 바깥쪽 \(\forall\varepsilon\)를 뒤집지 않고 부등식만 바꿨습니다.`,
      en: String.raw`The negation flips every quantifier (\(\forall\) becomes \(\exists\), \(\exists\) becomes \(\forall\)) and rewrites the final implication via \(\lnot(P \to Q) \equiv P \land \lnot Q\). The first option fails to flip the \(\delta\) quantifier, the third keeps the implication instead of turning it into a conjunction, and the fourth never flips the outer \(\forall\varepsilon\) and merely reverses the inequalities.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`바깥의 부정을 한 단계씩 안으로 밀며 양화사를 뒤집습니다 (\(\lnot\forall = \exists\lnot\), \(\lnot\exists = \forall\lnot\)).
1단계: \(\exists\varepsilon > 0\ \lnot\big(\exists\delta > 0\ \forall x\,(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon)\big)\).
2단계: \(\exists\varepsilon > 0\ \forall\delta > 0\ \lnot\big(\forall x\,(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon)\big)\).`,
          en: String.raw`Push the outer negation inward one step at a time, flipping each quantifier (\(\lnot\forall = \exists\lnot\), \(\lnot\exists = \forall\lnot\)).
Step 1: \(\exists\varepsilon > 0\ \lnot\big(\exists\delta > 0\ \forall x\,(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon)\big)\).
Step 2: \(\exists\varepsilon > 0\ \forall\delta > 0\ \lnot\big(\forall x\,(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon)\big)\).`,
        },
      },
      {
        text: {
          ko: String.raw`3단계: \(\exists\varepsilon > 0\ \forall\delta > 0\ \exists x\ \lnot\big(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon\big)\).
마지막으로 함의의 부정을 사용합니다: \(\lnot(P \to Q) \equiv P \land \lnot Q\) (논제 1의 문제 3). 따라서 최종 부정은 \(\exists\varepsilon > 0\ \forall\delta > 0\ \exists x\,\big(|x-a| < \delta \land |f(x)-f(a)| \ge \varepsilon\big)\)입니다.`,
          en: String.raw`Step 3: \(\exists\varepsilon > 0\ \forall\delta > 0\ \exists x\ \lnot\big(|x-a| < \delta \to |f(x)-f(a)| < \varepsilon\big)\).
Finally use the negation of an implication: \(\lnot(P \to Q) \equiv P \land \lnot Q\) (scene 1, problem 3). The final negation is \(\exists\varepsilon > 0\ \forall\delta > 0\ \exists x\,\big(|x-a| < \delta \land |f(x)-f(a)| \ge \varepsilon\big)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이 명제가 \(f\)에 대해 말하는 바: 고정된 간격 \(\varepsilon > 0\)이 존재해서, \(a\)에 아무리 가까이 다가가도 (\(\delta\)를 아무리 작게 잡아도) \(f(x)\)가 \(f(a)\)로부터 \(\varepsilon\) 이상 떨어진 점 \(x\)가 항상 존재합니다 — 즉 \(f\)는 \(a\)에서 "끊어져" 있습니다. 이것이 정확히 "\(f\)는 \(a\)에서 불연속"의 정의입니다.`,
          en: String.raw`What this says about \(f\): there is a fixed gap \(\varepsilon > 0\) such that, no matter how close to \(a\) we look (however small \(\delta\) is taken), there is always a point \(x\) with \(f(x)\) at least \(\varepsilon\) away from \(f(a)\) — i.e. \(f\) stays "torn" at \(a\). This is exactly the definition of "\(f\) is discontinuous at \(a\)".`,
        },
      },
    ],
  },
  {
    id: 'quantifiers-order-matters',
    statement: {
      ko: String.raw`\(\forall x \in \mathbb{R}\ \exists y \in \mathbb{R}\ (y > x)\)를 증명하고 (증인 \(y = x+1\)), \(\exists y \in \mathbb{R}\ \forall x \in \mathbb{R}\ (y > x)\)가 거짓임을 증명하세요.

결론: 양화사의 순서가 의미를 바꾼다.`,
      en: String.raw`Prove \(\forall x \in \mathbb{R}\ \exists y \in \mathbb{R}\ (y > x)\) (witness \(y = x+1\)) and disprove \(\exists y \in \mathbb{R}\ \forall x \in \mathbb{R}\ (y > x)\).

Conclusion: quantifier order matters.`,
    },
    display: [
      String.raw`\forall x\ \exists y\ (y > x)\ \text{is true},\qquad \exists y\ \forall x\ (y > x)\ \text{is false}`,
    ],
    preset: { statement: 'forall-exists', x: 2, negated: false },
    presetCaption: {
      ko: String.raw`명제 \(\forall x\,\exists y\,(y > x)\) (참), 도전값 \(x = 2\): 증인 \(y = 3\), \(3 > 2\) 성립.`,
      en: String.raw`The statement \(\forall x\,\exists y\,(y > x)\) (true), challenge \(x = 2\): witness \(y = 3\), and \(3 > 2\) holds.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`첫 번째 명제를 증명합니다. 임의의 \(x \in \mathbb{R}\)가 주어졌다고 하세요. \(y = x + 1\)이라 두면 \(y \in \mathbb{R}\)이고 \(y - x = 1 > 0\), 즉 \(y > x\)입니다.

\(x\)는 임의였으므로 모든 \(x\)에 대해 그런 \(y\)가 존재합니다 — \(\forall x\ \exists y\ (y > x)\)가 참입니다. 씬의 도전값 \(x = 2\)에서는 증인이 \(y = 3\)이고 \(3 > 2\)가 성립합니다.`,
          en: String.raw`Prove the first statement. Let an arbitrary \(x \in \mathbb{R}\) be given. Set \(y = x + 1\); then \(y \in \mathbb{R}\) and \(y - x = 1 > 0\), i.e. \(y > x\).

Since \(x\) was arbitrary, such a \(y\) exists for every \(x\) — \(\forall x\ \exists y\ (y > x)\) is true. At the scene's challenge \(x = 2\) the witness is \(y = 3\) and \(3 > 2\) holds.`,
        },
      },
      {
        text: {
          ko: String.raw`두 번째 명제를 반증합니다. 어떤 후보 \(y_0 \in \mathbb{R}\)가 주어지든, \(x = y_0 + 1\)이라 두면 \(x \in \mathbb{R}\)이고 \(y_0 > x\)는 \(y_0 > y_0 + 1\), 즉 \(0 > 1\)과 동치라 거짓입니다.

따라서 "모든 \(x\)에 대해 \(y_0 > x\)"인 \(y_0\)는 존재하지 않습니다 — \(\exists y\ \forall x\ (y > x)\)는 거짓입니다. 씬에서 후보 \(y = 2\)는 \(x' = 3\)에 무너집니다.`,
          en: String.raw`Disprove the second statement. Whatever candidate \(y_0 \in \mathbb{R}\) is proposed, set \(x = y_0 + 1\); then \(x \in \mathbb{R}\) and \(y_0 > x\) is equivalent to \(y_0 > y_0 + 1\), i.e. \(0 > 1\), which is false.

Hence no \(y_0\) satisfies "\(y_0 > x\) for all \(x\)" — \(\exists y\ \forall x\ (y > x)\) is false. In the scene the candidate \(y = 2\) falls to \(x' = 3\).`,
        },
      },
      {
        text: {
          ko: String.raw`결론: 양화사의 순서가 의미를 완전히 바꿉니다. \(\forall x\ \exists y\)에서는 \(y\)가 \(x\)에 의존해도 되지만 (\(y = x+1\)), \(\exists y\ \forall x\)에서는 하나의 \(y\)가 모든 \(x\)에 통해야 합니다.

\(\varepsilon\)-\(\delta\) 정의에서 \(\delta\)가 \(\varepsilon\)에 의존해도 되는 이유가 바로 이 순서입니다.`,
          en: String.raw`Conclusion: quantifier order completely changes the meaning. In \(\forall x\ \exists y\) the choice of \(y\) may depend on \(x\) (\(y = x+1\)), but in \(\exists y\ \forall x\) a single \(y\) must work for every \(x\).

This ordering is exactly why \(\delta\) in the \(\varepsilon\)-\(\delta\) definition is allowed to depend on \(\varepsilon\).`,
        },
      },
    ],
  },
  {
    id: 'quantifiers-unbounded-one-over-x',
    statement: {
      ko: String.raw`"\(f\)는 \((0,1]\)에서 유계" — 즉 \(\exists M\ \forall x \in (0,1]\ |f(x)| \le M\) — 를 부정하여 \(\forall M\ \exists x \in (0,1]\ |f(x)| > M\)을 얻은 뒤, 그 형태를 이용해 \(f(x) = 1/x\)가 \((0,1]\)에서 유계가 아님을 증명하세요.`,
      en: String.raw`Negate "\(f\) is bounded on \((0,1]\)" — i.e. \(\exists M\ \forall x \in (0,1]\ |f(x)| \le M\) — to obtain \(\forall M\ \exists x \in (0,1]\ |f(x)| > M\), then use that form to prove \(f(x) = 1/x\) is unbounded on \((0,1]\).`,
    },
    display: [
      String.raw`\lnot\big(\exists M\ \forall x \in (0,1]\ (|f(x)| \le M)\big)\ \equiv\ \forall M\ \exists x \in (0,1]\ (|f(x)| > M)`,
      String.raw`x = \frac{1}{|M|+2} \in (0,1],\qquad f(x) = |M|+2 > M`,
    ],
    preset: { statement: 'exists-forall', x: 2, negated: true },
    presetCaption: {
      ko: String.raw`명제 \(\exists y\,\forall x\,(y > x)\) (거짓), 부정 사슬 표시: 마지막 단계 \(\forall y\,\exists x\,(y \le x)\) — 유계 부정의 양화사 패턴과 같습니다.`,
      en: String.raw`The statement \(\exists y\,\forall x\,(y > x)\) (false), negation chain shown: final step \(\forall y\,\exists x\,(y \le x)\) — the same quantifier pattern as the negation of boundedness.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`유계의 정의를 부정합니다: \(\lnot\big(\exists M\ \forall x \in (0,1]\ (|f(x)| \le M)\big)\).
부정을 안으로 밀면 \(\forall M\ \lnot\big(\forall x \in (0,1]\ (|f(x)| \le M)\big)\)가 되고, 다시 밀면 \(\forall M\ \exists x \in (0,1]\ \lnot(|f(x)| \le M)\), 즉 \(\forall M\ \exists x \in (0,1]\ (|f(x)| > M)\)입니다.

말로 풀면: "어떤 경계 \(M\)을 제시해도, 그것을 초과하는 점 \(x\)가 존재한다" — 이것이 무계의 정의입니다.`,
          en: String.raw`Negate the definition of boundedness: \(\lnot\big(\exists M\ \forall x \in (0,1]\ (|f(x)| \le M)\big)\).
Pushing the negation inward gives \(\forall M\ \lnot\big(\forall x \in (0,1]\ (|f(x)| \le M)\big)\), then \(\forall M\ \exists x \in (0,1]\ \lnot(|f(x)| \le M)\), i.e. \(\forall M\ \exists x \in (0,1]\ (|f(x)| > M)\).

In words: "whatever bound \(M\) is proposed, there is a point \(x\) exceeding it" — that is the definition of unboundedness.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(f(x) = 1/x\) (\(x \in (0,1]\))에 적용합니다. 임의의 \(M \in \mathbb{R}\)가 주어졌다고 하세요. \(x = \frac{1}{|M|+2}\)라 두면, 분모가 양수이므로 \(x > 0\)이고 \(|M|+2 \ge 2\)이므로 \(x \le \frac12 < 1\) — 즉 \(x \in (0,1]\)입니다.

이때 \(|f(x)| = f(x) = |M|+2\)인데, \(|M| \ge M\)이므로 \(|M|+2 > M\)입니다. 따라서 이 \(x\)에서 \(|f(x)| > M\)이 성립합니다.`,
          en: String.raw`Now apply it to \(f(x) = 1/x\) (\(x \in (0,1]\)). Let an arbitrary \(M \in \mathbb{R}\) be given. Set \(x = \frac{1}{|M|+2}\); the denominator is positive so \(x > 0\), and \(|M|+2 \ge 2\) gives \(x \le \frac12 < 1\) — hence \(x \in (0,1]\).

Then \(|f(x)| = f(x) = |M|+2\), and since \(|M| \ge M\) we have \(|M|+2 > M\). So \(|f(x)| > M\) holds at this \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(M\)은 임의였으므로, 모든 \(M\)에 대해 \(|f(x)| > M\)인 \(x \in (0,1]\)가 존재합니다 — 곧 \(\forall M\ \exists x \in (0,1]\ (|f(x)| > M)\)이 성립하므로 \(f\)는 \((0,1]\)에서 유계가 아닙니다. 핵심은 양화사 순서입니다: \(M\)이 먼저 주어지면(∀M) 그에 맞는 \(x\)를 나중에(∃x) 골라도 되기 때문에, \(M\)에 의존하는 선택 \(x = 1/(|M|+2)\)가 허용됩니다.`,
          en: String.raw`Since \(M\) was arbitrary, for every \(M\) there is an \(x \in (0,1]\) with \(|f(x)| > M\) — i.e. \(\forall M\ \exists x \in (0,1]\ (|f(x)| > M)\) holds, so \(f\) is unbounded on \((0,1]\). The key is the quantifier order: because \(M\) is given first (\(\forall M\)), the witness \(x\) may be chosen afterwards (\(\exists x\)), which is why the \(M\)-dependent choice \(x = 1/(|M|+2)\) is legitimate.`,
        },
      },
    ],
  },
];
