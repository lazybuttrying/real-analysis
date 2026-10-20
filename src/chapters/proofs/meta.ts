import type { ChapterMeta } from '../../contracts.ts';
import { logicPropositionsProblems } from '../limits/problems/logic-propositions';
import { quantifiersProblems } from '../limits/problems/quantifiers';
import { directProofProblems } from '../limits/problems/direct-proof';
import { contrapositiveProblems } from '../limits/problems/contrapositive';
import { contradictionProblems } from '../limits/problems/contradiction';
import { casesExistenceProblems } from '../limits/problems/cases-existence';
import { disproofIffProblems } from '../limits/problems/disproof-iff';
import { strongInductionProblems } from '../limits/problems/strong-induction';
import { relationsEquivalenceProblems } from '../limits/problems/relations-equivalence';
import { functionProofsProblems } from '../limits/problems/function-proofs';

/**
 * Pure data. Imports types plus per-scene problems data modules
 * (../{limits,series,calculus}/problems/* — data only, no code, models, views, or shell). Node build scripts and every chapter's navigation read
 * this file. Every text is stored per language; the shell picks one via the
 * URL language segment. Summaries embed math as inline TeX between \( and \)
 * (see splitInlineMath in contracts.ts).
 *
 * NOTE: this is a LOGICAL chapter. The scene files (models/, scenes/,
 * problems/) live in the legacy scene store src/chapters/limits/ and are
 * referenced here via relative paths. See docs/ARCHITECTURE.md
 * ("Physical vs logical chapters").
 */
export const proofs: ChapterMeta = {
  id: 'proofs',
  title: { ko: '증명의 기초', en: 'Foundations of Proof' },
  summary: {
    ko: '해석학의 언어인 증명을 처음부터 — 명제와 양화사부터 직접증명·대우·귀류법, 강한 귀납법, 동치관계와 함수 증명까지, Hammack의 Book of Proof 흐름을 따라갑니다.',
    en: 'The language of analysis, from the ground up — propositions and quantifiers through direct proof, contrapositive, contradiction, strong induction, equivalence relations, and function proofs, following the arc of Hammack’s Book of Proof.',
  },
  scenes: [
    {
      id: 'logic-propositions',
      title: { ko: '명제와 진리표', en: 'Propositions and Truth Tables' },
      order: 1,
      summary: {
        ko: String.raw`연결사를 바꾸면 \(P\), \(Q\) 열은 고정된 채 새 연결사 열이 다시 채워집니다. 음영으로 표시된 \(P \to Q\) 열과 대우 \(\lnot Q \to \lnot P\) 열을 한 행씩 비교해 보세요 — 네 행 모두 똑같습니다. 그러나 역 \(Q \to P\) 열은 \((T, F)\) 행에서 갈라집니다.`,
        en: String.raw`Switch the connective and watch the new column fill in while the \(P\), \(Q\) columns stay fixed. Compare the shaded \(P \to Q\) column with its contrapositive \(\lnot Q \to \lnot P\) row by row — identical in all four rows. The converse \(Q \to P\), though, splits off in the \((T, F)\) row.`,
      },
      tex: [
        String.raw`(P \to Q) \equiv (\lnot Q \to \lnot P)`,
        String.raw`\lnot(P \land Q) \equiv (\lnot P) \lor (\lnot Q)`,
        String.raw`(P \to Q) \equiv (\lnot P \lor Q)`,
      ],
      controls: [
        { kind: 'select', key: 'connective', label: { ko: '연결사', en: 'Connective' }, options: ['and', 'or', 'implies', 'iff'], init: 'implies' },
        { kind: 'toggle', key: 'contrapositive', label: { ko: '대우 함께 보기', en: 'Show contrapositive' }, init: true },
      ],
      problems: logicPropositionsProblems,
    },
    {
      id: 'quantifiers',
      title: { ko: '전칭·존재 양화사', en: 'Universal and Existential Quantifiers' },
      order: 2,
      summary: {
        ko: String.raw`수직선 위의 게임입니다: 도전자가 \(x\)를 제시하면 답하는 쪽이 더 큰 \(y = x + 1\)을 올려놓습니다 — \(\forall x \,\exists y \,(y > x)\). 순서를 바꾸면 같은 게임이 무너집니다. 그리고 \(\varepsilon\)-\(\delta\) 줄은 이 패턴 그대로이며, \(f(t) = 2t\)에서는 \(\delta = \varepsilon/2\)가 답입니다.`,
        en: String.raw`A game on the number line: the challenger names \(x\), and you answer with the bigger point \(y = x + 1\) — \(\forall x \,\exists y \,(y > x)\). Swap the quantifier order and the same game collapses. The \(\varepsilon\)-\(\delta\) line is exactly this pattern, with \(\delta = \varepsilon/2\) answering \(f(t) = 2t\).`,
      },
      tex: [
        String.raw`\forall x \,\exists y \,(y > x)`,
        String.raw`\lnot(\forall x \,\exists y) = \exists x \,\forall y`,
        String.raw`\forall \varepsilon > 0 \,\exists \delta > 0 \,\forall t \,(|t| < \delta \to |2t| < \varepsilon)`,
      ],
      prerequisites: ['logic-propositions'],
      controls: [
        { kind: 'select', key: 'statement', label: { ko: '명제', en: 'Statement' }, options: ['forall-exists', 'exists-forall', 'eps-delta'], init: 'forall-exists' },
        { kind: 'slider', key: 'x', label: { ko: '도전값 x', en: 'Challenge x' }, min: -5, max: 5, step: 0.5, init: 2 },
        { kind: 'toggle', key: 'negated', label: { ko: '부정 보기', en: 'Show negation' }, init: false },
      ],
      problems: quantifiersProblems,
    },
    {
      id: 'direct-proof',
      title: { ko: '직접증명', en: 'Direct Proof' },
      order: 3,
      summary: {
        ko: String.raw`두 유리수 \(r_1 = \frac{p_1}{q_1}\), \(r_2 = \frac{p_2}{q_2}\)의 합을 수직선 위에 표시하고, 가정에서 결론까지 곧바로 이어지는 계산 \(\frac{p_1 q_2 + p_2 q_1}{q_1 q_2}\)을 따라간다 — 이것이 직접증명이다.`,
        en: String.raw`The sum of two rationals \(r_1 = \frac{p_1}{q_1}\), \(r_2 = \frac{p_2}{q_2}\) on a number line, with the computation \(\frac{p_1 q_2 + p_2 q_1}{q_1 q_2}\) running straight from hypothesis to conclusion — that is a direct proof.`,
      },
      tex: [
        String.raw`r_1 + r_2 = \frac{p_1 q_2 + p_2 q_1}{q_1 q_2}`,
        String.raw`\frac{3}{4} + \frac{-5}{6} = -\frac{1}{12}`,
      ],
      prerequisites: ['logic-propositions'],
      controls: [
        { kind: 'slider', key: 'p1', label: { ko: '분자 p₁', en: 'Numerator p1' }, min: -9, max: 9, step: 1, init: 3 },
        { kind: 'slider', key: 'q1', label: { ko: '분모 q₁', en: 'Denominator q1' }, min: 1, max: 9, step: 1, init: 4 },
        { kind: 'slider', key: 'p2', label: { ko: '분자 p₂', en: 'Numerator p2' }, min: -9, max: 9, step: 1, init: -5 },
        { kind: 'slider', key: 'q2', label: { ko: '분모 q₂', en: 'Denominator q2' }, min: 1, max: 9, step: 1, init: 6 },
      ],
      problems: directProofProblems,
    },
    {
      id: 'contrapositive',
      title: { ko: '대우법', en: 'Proof by Contrapositive' },
      order: 4,
      summary: {
        ko: String.raw`\(n^2\)이 짝수인 행이 정확히 \(n\)이 짝수인 행과 일치하는 \(n = 1..12\) 표 — "\(n^2\) 짝수 \(\Rightarrow\) \(n\) 짝수"의 직접증명이 막히는 곳에서, 대우 "\(n\) 홀수 \(\Rightarrow\) \(n^2\) 홀수"의 계산 \((2k+1)^2 = 2(2k^2+2k)+1\)이 열린다.`,
        en: String.raw`The \(n = 1..12\) grid where the \(n^2\)-even rows are exactly the \(n\)-even rows — where the direct proof of "\(n^2\) even \(\Rightarrow\) \(n\) even" stalls, the contrapositive "odd \(n\) \(\Rightarrow\) odd \(n^2\)" opens up through \((2k+1)^2 = 2(2k^2+2k)+1\).`,
      },
      tex: [
        String.raw`n^2 \text{ even} \Rightarrow n \text{ even} \iff n \text{ odd} \Rightarrow n^2 \text{ odd}`,
        String.raw`(2k+1)^2 = 2(2k^2+2k)+1`,
      ],
      prerequisites: ['direct-proof'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 50, step: 1, init: 7 },
        { kind: 'select', key: 'view', label: { ko: '보기', en: 'View' }, options: ['statement', 'contrapositive'], init: 'statement' },
      ],
      problems: contrapositiveProblems,
    },
    {
      id: 'contradiction',
      title: { ko: '귀류법', en: 'Proof by Contradiction' },
      order: 5,
      summary: {
        ko: String.raw`소수가 전부 \(p_1, \ldots, p_k\)뿐이라 가정해 보자 — 칩 위에 그 목록, \(P = p_1 \cdots p_k\), 그리고 \(N = P+1\)이 놓인다. 어떤 목록의 소수로도 나누어떨어지지 않지만(나머지 1) 소인수를 가지는 \(N\) — 그 소인수는 목록 밖에 있다. 모순이다. \(k = 6\)에서는 \(N = 30031 = 59 \times 509\)처럼 합성수여도 증명이 온전함을 보여, 귀류법의 모양(\(\lnot P\) 가정 → 모순 → \(P\))을 익힌다.`,
        en: String.raw`Suppose the primes \(p_1, \ldots, p_k\) were all there are — the chips show the list, \(P = p_1 \cdots p_k\), and \(N = P+1\). \(N\) is divisible by no prime on the list (remainder 1) yet has a prime factor, and that factor is off the list — a contradiction. At \(k = 6\), \(N = 30031 = 59 \times 509\) is composite and the proof still stands, teaching the shape of contradiction (assume \(\lnot P\) → contradiction → \(P\)).`,
      },
      tex: [
        String.raw`N = p_1 p_2 \cdots p_k + 1 \equiv 1 \pmod{p_i}`,
        String.raw`\lnot P \;\Rightarrow\; \bot \;\vdash\; P`,
        String.raw`30031 = 59 \times 509`,
      ],
      prerequisites: ['contrapositive'],
      controls: [
        { kind: 'slider', key: 'k', label: { ko: '소수 개수 k', en: 'Number of primes k' }, min: 1, max: 8, step: 1, init: 4 },
      ],
      problems: contradictionProblems,
    },
    {
      id: 'cases-existence',
      title: { ko: '경우 나누기와 존재 증명', en: 'Proof by Cases and Existence Proofs' },
      order: 6,
      summary: {
        ko: String.raw`점 \((x, y)\)를 움직이면 그 점이 속한 사분면이 음영되고, 그 경우의 계산 \(|xy| = |x|\cdot|y|\)가 펼쳐진다 — 네 경우(와 축)가 평면을 빠짐없이 덮는다. 한편 \(c = \sqrt{2}^{\sqrt{2}}\)에서 갈라지는 두 갈래는 어느 쪽이 참인지 밝히지 않고도 "무리수 \(a, b\)와 유리수 \(a^b\)가 존재한다"는 결론에 도달한다 — 비구성적 존재 증명의 맛.`,
        en: String.raw`Moving the point \((x, y)\) shades its quadrant and unfolds that case's computation of \(|xy| = |x|\cdot|y|\) — the four cases (and the axes) cover the whole plane. And from \(c = \sqrt{2}^{\sqrt{2}}\) two branches fork and rejoin at "irrational \(a, b\) exist with \(a^b\) rational" without ever revealing which branch is true — the flavor of non-constructive existence.`,
      },
      tex: [
        String.raw`|xy| = |x|\cdot|y|`,
        String.raw`c = \sqrt{2}^{\sqrt{2}} \approx 1.6325`,
        String.raw`\big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{2} = 2`,
      ],
      prerequisites: ['contradiction'],
      controls: [
        { kind: 'select', key: 'part', label: { ko: '부분', en: 'Part' }, options: ['cases', 'existence'], init: 'cases' },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: -5, max: 5, step: 0.5, init: -2 },
        { kind: 'slider', key: 'y', label: { ko: 'y', en: 'y' }, min: -5, max: 5, step: 0.5, init: 3 },
      ],
      problems: casesExistenceProblems,
    },
    {
      id: 'disproof-iff',
      title: { ko: '반례와 필요충분조건', en: 'Counterexamples and If and Only If' },
      order: 7,
      summary: {
        ko: String.raw`단 하나의 반례가 보편 주장을 무너뜨리는 모습을, 네 개의 거짓 주장 — 모든 소수는 홀수, \(4 \mid n^2 \Rightarrow 4 \mid n\), 무리수끼리의 합은 무리수, \(|x| = |y| \Rightarrow x = y\) — 위에서 확인하세요. \(n\)을 밀며 가정과 결론의 표시등을 켜고 끄다 보면 \(\lnot(\forall x\, P(x)) = \exists x\, \lnot P(x)\)가 손에 잡힙니다. 반대 방향의 기술 — \(P \iff Q\)의 양쪽 화살표를 각각 증명하는 일 — 은 문제에서 이어집니다.`,
        en: String.raw`Watch a single counterexample demolish a universal claim, tested on four false claims — every prime is odd, \(4 \mid n^2 \Rightarrow 4 \mid n\), sums of irrationals are irrational, \(|x| = |y| \Rightarrow x = y\). Slide \(n\) and flip the hypothesis and conclusion lights until \(\lnot(\forall x\, P(x)) = \exists x\, \lnot P(x)\) feels mechanical. The mirror skill — proving each arrow of \(P \iff Q\) separately — is carried out in the problems.`,
      },
      tex: [
        String.raw`\lnot(\forall x\, P(x)) = \exists x\, \lnot P(x)`,
        String.raw`4 \mid n^2 \Rightarrow 4 \mid n`,
        String.raw`|x| = |y| \Rightarrow x = y`,
      ],
      prerequisites: ['quantifiers', 'contrapositive'],
      controls: [
        { kind: 'select', key: 'claim', label: { ko: '주장', en: 'Claim' }, options: ['primes-odd', 'div4', 'irrational-sum', 'abs-equal'], init: 'primes-odd' },
        { kind: 'slider', key: 'n', label: { ko: '테스트 값 n', en: 'Test value n' }, min: 2, max: 60, step: 1, init: 16 },
      ],
      problems: disproofIffProblems,
    },
    {
      id: 'strong-induction',
      title: { ko: '강한 귀납법', en: 'Strong Induction' },
      order: 8,
      summary: {
        ko: String.raw`\(n = 30\)의 소인수분해 트리를 그려 보면 강한 귀납법이 왜 필요한지 보입니다 — 분기는 \(n-1 = 29\)가 아니라 \(15\)와 \(2\)처럼 훨씬 작은 수들로 떨어집니다. \(n\)을 밀어 트리가 다시 그려지는 동안, \(P(2), \dots, P(n-1)\) 전체를 가정하는 귀납 단계를 따라가 보세요. 약한 귀납의 \(P(n-1)\)만으로는 인자들에 닿을 수 없습니다.`,
        en: String.raw`Draw the factorization tree of \(n = 30\) and strong induction explains itself — the splits drop to much smaller numbers like \(15\) and \(2\), not to \(n - 1 = 29\). Slide \(n\), watch the tree redraw, and follow the induction step that assumes all of \(P(2), \dots, P(n-1)\) at once; the weak hypothesis \(P(n-1)\) alone can never reach the factors.`,
      },
      tex: [
        String.raw`P(2), \dots, P(n-1) \Rightarrow P(n)`,
        String.raw`30 = 2 \times 3 \times 5`,
      ],
      prerequisites: ['direct-proof'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 2, max: 60, step: 1, init: 30 },
      ],
      problems: strongInductionProblems,
    },
    {
      id: 'relations-equivalence',
      title: { ko: '동치관계', en: 'Equivalence Relations' },
      order: 9,
      summary: {
        ko: String.raw`\(n\)으로 나눈 나머지가 같으면 같은 조각에 — 합동을 동치관계로 배우는 장면입니다: 반사·대칭·추이 세 공리를 \(0\)부터 \(3n-1\)까지 모든 원소·쌍·삼중항에 대해 brute force로 검증하고, 동치류 \([r] = \{r, r+n, r+2n\}\)이 집합을 겹침 없이 나눈 모습을 \(n\)을 움직이며 직접 봅니다.`,
        en: String.raw`Congruence modulo \(n\) as an equivalence relation: the three axioms — reflexive, symmetric, transitive — are brute-force verified on every element, pair, and triple of \(U = \{0, \dots, 3n-1\}\), and the classes \([r] = \{r, r+n, r+2n\}\) visibly partition the set as \(n\) slides.`,
      },
      tex: [
        String.raw`a \sim b \iff n \mid (a - b)`,
        String.raw`[r] = \{r, r + n, r + 2n\}`,
        String.raw`z \in [x] \cap [y] \implies [x] = [y]`,
      ],
      prerequisites: ['logic-propositions'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '법 n', en: 'Modulus n' }, min: 2, max: 8, step: 1, init: 4 },
      ],
      problems: relationsEquivalenceProblems,
    },
    {
      id: 'function-proofs',
      title: { ko: '함수 합성 증명', en: 'Proofs about Composite Functions' },
      order: 10,
      summary: {
        ko: String.raw`합성 함수의 단사성·전사성 법칙을 구체적 표로 증명하는 장면입니다: \(g \circ f\)가 단사이면 \(f\)도 단사, \(g \circ f\)가 전사이면 \(g\)도 전사 — 그리고 역이 왜 거짓인지(\(g\)가 단사일 필요가 없고 \(f\)가 전사일 필요가 없음)를 화살표 그림 위에서 직접 확인합니다. 전단사인 경우 \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\)의 순서 뒤집힘까지 계산으로 보입니다.`,
        en: String.raw`Proofs about composite functions, tested on concrete tables: \(g \circ f\) injective forces \(f\) injective, \(g \circ f\) surjective forces \(g\) surjective — and the arrow diagrams show exactly why the converses fail (\(g\) need not be injective, \(f\) need not be surjective). For bijections, \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\) is computed out loud.`,
      },
      tex: [
        String.raw`f(a_1) = f(a_2) \implies g(f(a_1)) = g(f(a_2))`,
        String.raw`(g \circ f)^{-1} = f^{-1} \circ g^{-1}`,
      ],
      prerequisites: ['direct-proof', 'relations-equivalence'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['injective-chain', 'surjective-chain', 'bijective'], init: 'injective-chain' },
      ],
      problems: functionProofsProblems,
    },
  ],
};
