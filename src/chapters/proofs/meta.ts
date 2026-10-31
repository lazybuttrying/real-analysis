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
  sections: [
    { id: 'logic-basics', title: { ko: '명제와 양화사', en: 'Propositions and Quantifiers' }, sceneIds: ['logic-propositions', 'quantifiers'] },
    { id: 'proof-methods', title: { ko: '증명 방법', en: 'Proof Methods' }, sceneIds: ['direct-proof', 'contrapositive', 'contradiction', 'cases-existence', 'disproof-iff'] },
    { id: 'induction-relations', title: { ko: '귀납법과 관계', en: 'Induction and Relations' }, sceneIds: ['strong-induction', 'relations-equivalence', 'function-proofs'] },
  ],
  scenes: [
    {
      id: 'logic-propositions',
      title: { ko: '명제와 진리표', en: 'Propositions and Truth Tables' },
      order: 1,
      summary: {
        ko: String.raw`연결사를 바꿀 때마다 진리표의 새 열이 채워집니다. 네 가지 경우를 나란히 비교해 봅니다.

핵심은 열이 같으면 뜻도 같다는 것입니다. 참인 행과 거짓인 행이 완전히 겹치면 두 문장은 같은 말입니다. 명제와 그 대우는 언제나 열이 같습니다. 뒤집은 역은 그렇지 않습니다.

예를 들면, '비가 오면 땅이 젖는다'와 '땅이 안 젖었으면 비가 안 온 것이다'는 같은 말입니다. 반대로 '땅이 젖었으면 비가 왔다'는 틀릴 수 있습니다. 호스로 물을 뿌려도 땅은 젖으니까요.`,
        en: String.raw`Switch the connective and a new truth-table column fills in. All four cases sit side by side for comparison.

Two statements with identical columns mean the same thing. If the true rows and false rows match completely, the statements are equivalent. A statement and its contrapositive always match. The converse does not.

For example, 'if it rains, the ground gets wet' and 'if the ground is not wet, it did not rain' say the same thing. But 'if the ground is wet, it rained' can be false. A hose wets the ground too.`,
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
        ko: String.raw`수직선 위 게임으로 양화사를 익힙니다. 순서를 바꾸면 같은 게임이 어떻게 무너지는지도 봅니다.

먼저 내는 쪽과 나중에 답하는 쪽이 정해져 있습니다. '모든'은 상대가 무엇을 내도 답할 수 있어야 합니다. '존재'는 딱 하나만 찾으면 됩니다. 순서가 바뀌면 명제 자체가 달라집니다. 이 패턴이 엡실론-델타 정의로 그대로 이어집니다.

예를 들면, 반 🧑 친구 누구에게 물어도 그보다 키 큰 사람을 한 명은 댈 수 있습니다. 반대로 모두보다 큰 한 사람은 존재하지 않습니다. 순서 하나에 뜻이 완전히 달라집니다.`,
        en: String.raw`A game on the number line teaches the quantifiers. Swap the order and watch the same game collapse.

One side moves first and the other side answers. 'For all' demands an answer to every challenge. 'There exists' needs just one good answer. Swapping the order changes the claim itself. This pattern becomes the epsilon-delta definition later.

For example, for every 🧑 classmate, someone taller exists. But one person taller than everybody does not exist. A single swap changes the whole meaning.`,
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
        ko: String.raw`두 유리수의 합을 수직선 위에 놓고 계산을 따라갑니다. 가정에서 결론까지 곧장 이어지는 증명입니다.

직접증명은 출발점에서 곧장 걸어가는 방식입니다. 주어진 것을 그대로 계산하면 결론이 나옵니다. 분수는 통분하면 하나의 분수가 됩니다. 그래서 유리수끼리 더해도 다시 유리수가 됩니다.

예를 들면, 🍰 케이크 4분의 3에서 6분의 5를 덜어 내는 상황입니다. 조각을 12등분으로 맞추면 9조각에서 10조각을 빼는 셈입니다. 돌아가는 길 없이 계산 하나로 끝납니다.`,
        en: String.raw`Place the sum of two rationals on the number line and follow the computation. It runs straight from hypothesis to conclusion.

A direct proof walks straight ahead. Compute with what you are given and the conclusion falls out. Fractions combine over a common denominator into one fraction. So a sum of rationals is rational again.

For example, take three quarters of a 🍰 cake and remove five sixths of one. Recut into twelfths: nine pieces minus ten pieces. One straight computation, no detours.`,
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
        ko: String.raw`짝수와 홀수 표를 놓고 명제와 대우를 나란히 봅니다. 직접 가는 길이 막힐 때의 우회로를 확인합니다.

정면으로 증명하기 어려운 명제가 있습니다. 그럴 때는 뒤집고 부정한 대우를 증명합니다. 대우는 원래 명제와 참·거짓이 항상 같습니다. 한쪽을 끝내면 다른 쪽도 자동으로 끝납니다.

예를 들면, 어떤 수의 제곱이 짝수이면 그 수도 짝수입니다. 제곱을 직접 보는 대신 홀수인 경우만 살펴봅니다. 홀수를 제곱하면 언제나 홀수가 됩니다. 그래서 제곱이 짝수라면 원래 수는 홀수일 수 없습니다.`,
        en: String.raw`Lay out an even-odd table and set a statement beside its contrapositive. This is the detour for when the direct road is blocked.

Some statements resist a frontal attack. Then flip and negate: prove the contrapositive instead. It always shares the original's truth value. Settle one side and the other comes free.

For example, if a square is even, the number itself is even. Instead of studying squares, look only at odd numbers. Squaring an odd number always gives an odd number. So an even square never came from an odd number.`,
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
        ko: String.raw`소수가 유한하다고 가정하고 모순을 끌어냅니다. 목록 밖에 새 소수가 튀어나오는 순간을 봅니다.

귀류법은 반대쪽을 가정하는 증명입니다. 거짓인 쪽을 끝까지 밀고 가면 앞뒤가 안 맞는 지점이 나옵니다. 그러면 원래 명제가 참일 수밖에 없습니다. 소수를 전부 곱하고 1을 더한 수가 그 충돌을 만듭니다.

예를 들면, 세상에서 제일 큰 수가 있다고 해 봅니다. 거기에 1을 더하면 더 큰 수가 나옵니다. 가정이 스스로를 무너뜨리는 순간입니다. 유클리드의 소수 증명이 딱 이 수법입니다.`,
        en: String.raw`Assume there are only finitely many primes and derive a contradiction. Watch a new prime slip outside the list.

Proof by contradiction assumes the opposite side. Push the false side until it clashes with itself. Then the original claim must be true. Multiplying all the primes and adding one builds that clash.

For example, suppose a biggest number exists. Add one and a bigger number appears. The assumption destroys itself. Euclid's prime proof uses exactly this move.`,
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
        ko: String.raw`평면을 네 구역으로 나눠 경우를 하나씩 처리합니다. 어느 쪽인지 모른 채 존재만 보이는 증명도 만납니다.

경우 나누기는 빠짐없이 나누는 것이 핵심입니다. 구역마다 계산은 쉽습니다. 하지만 하나라도 빠지면 증명 전체가 무너집니다. 존재 증명은 다릅니다. 실제로 찾아내지 않고도 '있다'고 보일 수 있습니다.

예를 들면, 🧑 친구가 집의 동쪽에 있을 수도, 서쪽에 있을 수도 있습니다. 어느 쪽이든 집까지의 거리는 부호와 상관없이 같습니다. 양쪽을 다 확인하는 것이 경우 나누기입니다.`,
        en: String.raw`Split the plane into four regions and handle one case at a time. Then meet a proof that shows existence without revealing which side holds.

A case split must leave no gap. Each region's computation is easy. Miss one region and the whole proof collapses. Existence proofs are different: 'it exists' can be shown without producing it.

For example, a 🧑 friend may stand east or west of your house. Either way, the distance home ignores the sign. Checking both directions is exactly a proof by cases.`,
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
        ko: String.raw`거짓인 주장을 반례 하나로 무너뜨리는 장면입니다. 그럴듯한 주장 네 가지를 차례로 시험합니다.

'모두 그렇다'는 주장에는 반례 하나면 충분합니다. 안 되는 예 하나가 전체를 거짓으로 만듭니다. 필요충분조건은 그 반대의 일입니다. 가는 방향과 오는 방향을 각각 증명해야 합니다.

예를 들면, '우리 반 🧑 친구는 전부 안경을 썼다'는 말이 있습니다. 안경을 안 쓴 친구 한 명이면 이 말은 끝납니다. 한 사람이면 충분합니다.`,
        en: String.raw`Demolish false claims with a single counterexample. Four plausible claims go on trial, one by one.

A 'for all' claim falls to one counterexample. A single failing case makes the whole claim false. An if-and-only-if claim is the opposite job. Each direction needs its own separate proof.

For example, take 'every 🧑 classmate wears glasses'. One classmate without glasses ends the claim. One person is enough.`,
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
        ko: String.raw`수를 소인수들로 쪼개는 나무를 그려 봅니다. 왜 앞의 것 전부를 가정해야 하는지 드러납니다.

보통 귀납법은 바로 앞 단계 하나만 씁니다. 그런데 쪼개진 조각은 바로 아래가 아니라 훨씬 아래에 떨어집니다. 그래서 강한 귀납법은 앞의 모든 단계를 한꺼번에 가정합니다. 조각마다 이미 성립한다고 믿고 올라가는 것입니다.

예를 들면, 🪜 계단을 오를 때 어떤 칸은 두세 칸 아래를 딛고 올라갑니다. 바로 아래 칸만 믿어서는 닿지 않는 칸이 있습니다. 아래 칸 전부를 믿어야 다음 칸에 설 수 있습니다.`,
        en: String.raw`Draw the tree that splits a number into prime factors. It shows why the proof must assume everything before it.

Ordinary induction uses only the step right before. But split-off pieces land far below, not one step down. Strong induction assumes every earlier step at once. Each piece counts as already settled on the way up.

For example, climbing 🪜 stairs, some steps push off two or three steps below. Trusting only the step right beneath you is not always enough. Trust them all, and the next step holds.`,
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
        ko: String.raw`나머지가 같은 수끼리 한 묶음으로 나눠 봅니다. 세 가지 약속을 전부 검사해 동치인지 확인합니다.

동치관계는 '같은 편'이라는 뜻의 관계입니다. 누구나 자기 자신과 같은 편입니다. 같은 편인지는 양쪽이 똑같이 느껴야 합니다. 편이 이어지면 끝까지 같은 편입니다. 이 셋이 성립하면 전체가 겹치지 않는 묶음으로 갈립니다.

예를 들면, 🧑 친구 12명을 4명씩 세 모둠으로 나누는 것과 같습니다. 누구도 두 모둠에 겹쳐 들어가지 않습니다. 모둠 안에서는 전원이 같은 편입니다. 나머지가 같은 수들의 묶음이 딱 이 모습입니다.`,
        en: String.raw`Group numbers by equal remainders. Then test three promises on everything to certify an equivalence relation.

An equivalence relation means 'on the same team'. Everyone is on their own team. Teaming is mutual, and it chains through teammates. When all three hold, the whole set splits into non-overlapping teams.

For example, split twelve 🧑 classmates into three teams of four. Nobody belongs to two teams at once. Inside a team, everyone matches everyone. Remainder classes look exactly like this.`,
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
        ko: String.raw`두 함수를 이어 붙인 합성을 표와 화살표로 봅니다. 합성의 성질이 각 함수에 무엇을 강제하는지 확인합니다.

합성이 단사이면 앞에 오는 함수도 단사입니다. 합성이 전사이면 뒤에 오는 함수가 전사입니다. 하지만 그 반대는 성립하지 않습니다. 합성을 되돌릴 때 순서가 뒤집히는 것도 계산으로 확인합니다.

예를 들면, 📦 상자에 물건을 넣고 뚜껑을 닫은 뒤 끈으로 묶어 봅니다. 다시 열 때는 끈부터 풀어야 합니다. 나중에 한 일을 먼저 되돌리는 것입니다. 합성의 역함수가 순서를 뒤집는 이유가 이것입니다.`,
        en: String.raw`Glue two functions together and inspect the composite with tables and arrows. See what the composite's properties force onto each part.

If the composite is injective, the first function is injective too. If the composite is surjective, the second function is surjective. The converses fail, and the diagrams show why. Undoing a composite also reverses the order.

For example, pack a 📦 box, close the lid, then tie it with string. To open it, the string comes off first. The last step done is the first step undone. That is why inverses of composites reverse the order.`,
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
