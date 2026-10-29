import type { LocalizedText } from './contracts.ts';

/**
 * Hand-authored glossary of the key mathematical terms used across the scenes.
 * Pure data: no code, no DOM, no imports beyond types. Read by the prerender
 * script (Node), the client-side glossary page, and the search-index builder.
 *
 * Conventions (same as meta.ts): Korean lives only inside `ko:` strings;
 * inline math uses \\(...\\) delimiters (never $...$); every entry links to the
 * scene where the term is introduced via chapterId + sceneId.
 */
interface GlossaryEntry {
  /** Stable kebab-case id, unique across the glossary. Used for #term-<id> anchors. */
  id: string;
  term: LocalizedText;
  /** One or two sentences. May embed \\(...\\) inline math. */
  definition: LocalizedText;
  chapterId: string;
  sceneId: string;
}

export const glossary: readonly GlossaryEntry[] = [
  // ---------------------------------------------------------------- proofs
  {
    id: 'proposition',
    term: { ko: '명제', en: 'proposition' },
    definition: {
      ko: String.raw`참 또는 거짓 중 하나로 정해지는 문장 — 증명은 명제들을 연결사로 조합하고 그 진리값이 어떻게 정해지는지를 따지는 일이다.`,
      en: String.raw`A statement that is either true or false — proof is the art of combining propositions with connectives and tracking how the truth values are forced.`,
    },
    chapterId: 'proofs',
    sceneId: 'logic-propositions',
  },
  {
    id: 'direct-proof',
    term: { ko: '직접증명', en: 'direct proof' },
    definition: {
      ko: String.raw`가정을 참으로 놓고 정당화되는 단계들을 차례로 이어 결론에 곧바로 도달하는 증명 — 우회로를 쓰지 않는다.`,
      en: String.raw`A proof that takes the hypothesis as given and reaches the conclusion by a straight chain of justified steps — no detours.`,
    },
    chapterId: 'proofs',
    sceneId: 'direct-proof',
  },
  {
    id: 'proof-by-cases',
    term: { ko: '경우 나누기', en: 'proof by cases' },
    definition: {
      ko: String.raw`대상을 빠짐없이 덮는 몇 개의 경우로 나누어, 각 경우마다 주장을 증명하는 방법 — 모든 경우를 합치면 전체가 증명된다.`,
      en: String.raw`Splitting the domain into cases that cover everything, and proving the claim in each case — together the cases cover the whole proof.`,
    },
    chapterId: 'proofs',
    sceneId: 'cases-existence',
  },
  {
    id: 'function-composition',
    term: { ko: '함수 합성', en: 'function composition' },
    definition: {
      ko: String.raw`\(g \circ f\) — \(f\)를 먼저 적용하고 그 결과에 \(g\)를 적용하는 함수. 단사성·전사성은 합성을 통과하며 증명 가능한 형태로 이어진다.`,
      en: String.raw`\(g \circ f\) — apply \(f\) first, then \(g\) to the result. Injectivity and surjectivity propagate through composition in provable ways.`,
    },
    chapterId: 'proofs',
    sceneId: 'function-proofs',
  },
  {
    id: 'quantifier',
    term: { ko: '양화사', en: 'quantifier' },
    definition: {
      ko: String.raw`\(\forall\) (모든)와 \(\exists\) (존재한다) — 명제가 어떤 범위를 어떻게 덮는지를 정밀하게 고정하는 기호. 부정을 씌우면 둘은 서로 맞바뀐다.`,
      en: String.raw`\(\forall\) (for all) and \(\exists\) (there exists) — the symbols that pin down precisely how a statement ranges over its domain. Negation swaps the two.`,
    },
    chapterId: 'proofs',
    sceneId: 'quantifiers',
  },
  {
    id: 'contrapositive',
    term: { ko: '대우', en: 'contrapositive' },
    definition: {
      ko: String.raw`명제 \(P \Rightarrow Q\)의 대우는 \(\lnot Q \Rightarrow \lnot P\) — 원래 명제와 항상 동치이므로, 직접증명이 막힐 때 대우를 대신 증명한다.`,
      en: String.raw`The contrapositive of \(P \Rightarrow Q\) is \(\lnot Q \Rightarrow \lnot P\) — always equivalent to the original, so it can be proved in its place when the direct route stalls.`,
    },
    chapterId: 'proofs',
    sceneId: 'contrapositive',
  },
  {
    id: 'proof-by-contradiction',
    term: { ko: '귀류법', en: 'proof by contradiction' },
    definition: {
      ko: String.raw`결론의 부정을 가정하고 모순을 이끌어 내는 증명법 — \(\lnot P\)를 가정했을 때 모순(\(\bot\))이 나오면 \(P\)가 성립한다.`,
      en: String.raw`The method that assumes the negation of the conclusion and derives a contradiction — if assuming \(\lnot P\) yields a contradiction (\(\bot\)), then \(P\) holds.`,
    },
    chapterId: 'proofs',
    sceneId: 'contradiction',
  },
  {
    id: 'biconditional',
    term: { ko: '필요충분조건', en: 'biconditional' },
    definition: {
      ko: String.raw`\(P \iff Q\) — \(P \Rightarrow Q\)와 \(Q \Rightarrow P\), 두 방향을 각각 증명해야 완성되는 "필요충분" 명제.`,
      en: String.raw`\(P \iff Q\) — an "if and only if" claim that is completed only by proving the two directions \(P \Rightarrow Q\) and \(Q \Rightarrow P\) separately.`,
    },
    chapterId: 'proofs',
    sceneId: 'disproof-iff',
  },
  {
    id: 'strong-induction',
    term: { ko: '강한 귀납법', en: 'strong induction' },
    definition: {
      ko: String.raw`\(P(n)\)을 보일 때 \(P(2), \dots, P(n-1)\) 전부가 성립함을 가정하는 귀납법 — \(n\)의 인자처럼 훨씬 작은 값들이 필요할 때 쓴다.`,
      en: String.raw`Induction that assumes all of \(P(2), \dots, P(n-1)\) when proving \(P(n)\) — used when the step needs much smaller values, like the factors of \(n\).`,
    },
    chapterId: 'proofs',
    sceneId: 'strong-induction',
  },
  {
    id: 'equivalence-relation',
    term: { ko: '동치관계', en: 'equivalence relation' },
    definition: {
      ko: String.raw`반사·대칭·추이를 모두 만족하는 관계 — 동치류들이 전체 집합을 겹침 없이 나누는 분할(partition)을 만든다.`,
      en: String.raw`A relation that is reflexive, symmetric, and transitive — its equivalence classes partition the whole set without overlap.`,
    },
    chapterId: 'proofs',
    sceneId: 'relations-equivalence',
  },
  // ---------------------------------------------------------------- numbers
  {
    id: 'natural-number',
    term: { ko: '자연수', en: 'natural number' },
    definition: {
      ko: String.raw`\(1, 2, 3, \dots\) — 페아노 공리에서 출발하는 수 세기의 기본 단위.`,
      en: String.raw`\(1, 2, 3, \dots\) — the basic unit of counting, axiomatized by Peano.`,
    },
    chapterId: 'numbers',
    sceneId: 'natural-numbers',
  },
  {
    id: 'mathematical-induction',
    term: { ko: '수학적 귀납법', en: 'mathematical induction' },
    definition: {
      ko: String.raw`\(P(1)\)과 \(P(k) \Rightarrow P(k+1)\)로부터 모든 자연수 \(n\)에 대한 \(P(n)\)을 얻는 증명 원리 — 도미노가 차례로 쓰러지듯.`,
      en: String.raw`The proof principle getting \(P(n)\) for every natural \(n\) from \(P(1)\) and \(P(k) \Rightarrow P(k+1)\) — like dominoes falling in turn.`,
    },
    chapterId: 'numbers',
    sceneId: 'natural-numbers',
  },
  {
    id: 'peano-axioms',
    term: { ko: '페아노 공리', en: 'Peano axioms' },
    definition: {
      ko: String.raw`자연수를 정의하는 다섯 공리 — \(1\)의 존재, 후계자 함수, 귀납법 공리 등. 덧셈과 곱셈도 여기서 귀납적으로 정의된다.`,
      en: String.raw`The five axioms defining the naturals — existence of \(1\), the successor function, the induction axiom, and more. Addition and multiplication are defined recursively from them.`,
    },
    chapterId: 'numbers',
    sceneId: 'natural-numbers',
  },
  {
    id: 'binomial-coefficient',
    term: { ko: '이항계수', en: 'binomial coefficient' },
    definition: {
      ko: String.raw`\(\binom{n}{k} = \frac{n!}{k!(n-k)!}\) — \(n\)개 중 \(k\)개를 고르는 경우의 수. 파스칼의 항등식 \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\)를 만족한다.`,
      en: String.raw`\(\binom{n}{k} = \frac{n!}{k!(n-k)!}\) — the number of ways to choose \(k\) from \(n\). Satisfies Pascal's identity \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\).`,
    },
    chapterId: 'numbers',
    sceneId: 'binomial',
  },
  {
    id: 'binomial-theorem',
    term: { ko: '이항정리', en: 'binomial theorem' },
    definition: {
      ko: String.raw`\((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) — 귀납법으로 증명되며, 파스칼의 항등식이 귀납 단계를 이룬다.`,
      en: String.raw`\((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) — proved by induction, with Pascal's identity as the inductive step.`,
    },
    chapterId: 'numbers',
    sceneId: 'binomial',
  },
  {
    id: 'integer',
    term: { ko: '정수', en: 'integer' },
    definition: {
      ko: String.raw`\(\dots, -2, -1, 0, 1, 2, \dots\) — 자연수 순서쌍의 동치류 \((a,b)\sim(c,d)\iff a+d=b+c\)로 구성되는 수 ("\(a-b\)").`,
      en: String.raw`\(\dots, -2, -1, 0, 1, 2, \dots\) — built as equivalence classes of natural pairs with \((a,b)\sim(c,d)\iff a+d=b+c\) (the number "\(a-b\)").`,
    },
    chapterId: 'numbers',
    sceneId: 'integers-rationals',
  },
  {
    id: 'rational-number',
    term: { ko: '유리수', en: 'rational number' },
    definition: {
      ko: String.raw`\(\frac{a}{b}\) (\(b \ne 0\)) — 정수 순서쌍의 동치류 \((a,b)\sim(c,d)\iff ad=bc\)로 구성되며, 체(field)를 이룬다.`,
      en: String.raw`\(\frac{a}{b}\) (\(b \ne 0\)) — built as equivalence classes of integer pairs with \((a,b)\sim(c,d)\iff ad=bc\); they form a field.`,
    },
    chapterId: 'numbers',
    sceneId: 'integers-rationals',
  },
  {
    id: 'equivalence-class',
    term: { ko: '동치류', en: 'equivalence class' },
    definition: {
      ko: String.raw`동치 관계로 서로 동치인 원소들의 모임 — 정수·유리수·실수를 "만드는" 기술의 핵심.`,
      en: String.raw`The set of elements equivalent under an equivalence relation — the key technique for "building" the integers, rationals, and reals.`,
    },
    chapterId: 'numbers',
    sceneId: 'integers-rationals',
  },
  {
    id: 'set',
    term: { ko: '집합', en: 'set' },
    definition: {
      ko: String.raw`서로 다른 대상들의 모임. 해석학의 모든 논의는 집합에서 시작한다.`,
      en: `A collection of distinct objects. Every discussion in analysis begins with a set.`,
    },
    chapterId: 'numbers',
    sceneId: 'sets',
  },
  {
    id: 'function',
    term: { ko: '함수', en: 'function' },
    definition: {
      ko: String.raw`정의역의 각 원소에 공역의 원소를 정확히 하나씩 대응시키는 규칙.`,
      en: `A rule assigning to each element of a domain exactly one element of a codomain.`,
    },
    chapterId: 'numbers',
    sceneId: 'sets',
  },
  {
    id: 'supremum',
    term: { ko: '상한', en: 'supremum' },
    definition: {
      ko: String.raw`집합의 상계 중 가장 작은 것. \(\sup A\)로 쓴다.`,
      en: String.raw`The least of the upper bounds of a set, written \(\sup A\).`,
    },
    chapterId: 'numbers',
    sceneId: 'supremum',
  },
  {
    id: 'infimum',
    term: { ko: '하한', en: 'infimum' },
    definition: {
      ko: String.raw`집합의 하계 중 가장 큰 것. \(\inf A\)로 쓴다.`,
      en: String.raw`The greatest of the lower bounds of a set, written \(\inf A\).`,
    },
    chapterId: 'numbers',
    sceneId: 'supremum',
  },
  {
    id: 'nth-root',
    term: { ko: 'n제곱근', en: 'n-th root' },
    definition: {
      ko: String.raw`\(x^n = a\)를 만족하는 \(x \ge 0\). \(\sup\{x \ge 0 : x^n < a\}\)로 존재가 보장된다.`,
      en: String.raw`The \(x \ge 0\) with \(x^n = a\); its existence is guaranteed by \(\sup\{x \ge 0 : x^n < a\}\).`,
    },
    chapterId: 'numbers',
    sceneId: 'nth-root',
  },
  {
    id: 'axiom-of-choice',
    term: { ko: '선택 공리', en: 'axiom of choice' },
    definition: {
      ko: String.raw`비어 있지 않은 집합들의 모음에서 각각 하나씩 원소를 고르는 함수가 존재한다는 공리.`,
      en: `The axiom that a choice function exists for any collection of nonempty sets.`,
    },
    chapterId: 'numbers',
    sceneId: 'axiom-of-choice',
  },
  {
    id: 'zorns-lemma',
    term: { ko: '초른 보조정리', en: "Zorn's lemma" },
    definition: {
      ko: String.raw`모든 사슬이 상계를 가지면 극대 원소가 존재한다. 선택 공리와 동치이다.`,
      en: `If every chain has an upper bound, a maximal element exists. Equivalent to the axiom of choice.`,
    },
    chapterId: 'numbers',
    sceneId: 'zorn-lemma',
  },
  {
    id: 'cantors-theorem',
    term: { ko: '칸토어 정리', en: "Cantor's theorem" },
    definition: {
      ko: String.raw`어떤 집합도 그 멱집합보다 작다: \(|X| < |\mathcal{P}(X)|\). 대각선 논법으로 증명한다.`,
      en: String.raw`Every set is smaller than its power set: \(|X| < |\mathcal{P}(X)|\), proved by diagonalization.`,
    },
    chapterId: 'numbers',
    sceneId: 'cantor-theorem',
  },
  {
    id: 'countable-set',
    term: { ko: '가산집합', en: 'countable set' },
    definition: {
      ko: String.raw`자연수와 일대일로 대응시킬 수 있는 집합. 유리수 집합이 대표적이다.`,
      en: `A set that can be put in one-to-one correspondence with the natural numbers; the rationals are the classic example.`,
    },
    chapterId: 'numbers',
    sceneId: 'countable',
  },
  {
    id: 'group',
    term: { ko: '군', en: 'group' },
    definition: {
      ko: String.raw`결합법칙을 만족하는 하나의 연산에 대해 항등원과 역원을 갖춘 집합.`,
      en: `A set with one associative operation, an identity element, and inverses.`,
    },
    chapterId: 'numbers',
    sceneId: 'groups-fields',
  },
  {
    id: 'field',
    term: { ko: '체', en: 'field' },
    definition: {
      ko: String.raw`덧셈과 곱셈에 대해 각각 군을 이루고 분배법칙이 성립하는 집합. 유리수와 실수가 대표적이다.`,
      en: `A set forming a group under each of addition and multiplication, with distributivity; the rationals and the reals are examples.`,
    },
    chapterId: 'numbers',
    sceneId: 'groups-fields',
  },
  {
    id: 'vector-space',
    term: { ko: '벡터공간', en: 'vector space' },
    definition: {
      ko: String.raw`덧셈과 스칼라 곱셈에 대해 닫힌 집합. \(\mathbb{R}^n\)이 대표적이다.`,
      en: String.raw`A set closed under addition and scalar multiplication; \(\mathbb{R}^n\) is the prototype.`,
    },
    chapterId: 'numbers',
    sceneId: 'vector-spaces',
  },
  {
    id: 'isomorphism',
    term: { ko: '동형', en: 'isomorphism' },
    definition: {
      ko: String.raw`구조를 보존하는 전단사. 동형인 두 공간은 "포장만 다른 같은 구조"이다.`,
      en: `A structure-preserving bijection. Isomorphic spaces are "the same structure in different packaging".`,
    },
    chapterId: 'numbers',
    sceneId: 'vector-spaces',
  },
  {
    id: 'dimension',
    term: { ko: '차원', en: 'dimension' },
    definition: {
      ko: String.raw`벡터공간의 기저가 갖는 원소의 개수.`,
      en: `The number of elements in a basis of a vector space.`,
    },
    chapterId: 'numbers',
    sceneId: 'dimension-rank',
  },
  {
    id: 'rank',
    term: { ko: '랭크', en: 'rank' },
    definition: {
      ko: String.raw`선형사상의 상(image)의 차원.`,
      en: `The dimension of the image of a linear map.`,
    },
    chapterId: 'numbers',
    sceneId: 'dimension-rank',
  },
  // ---------------------------------------------------------------- sequences
  {
    id: 'sequence-limit',
    term: { ko: '수열의 극한', en: 'limit of a sequence' },
    definition: {
      ko: String.raw`모든 \(\varepsilon > 0\)에 대해 \(n > N\)이면 \(|x_n - L| < \varepsilon\)이도록 \(N\)을 잡을 수 있을 때 \(x_n \to L\)이다.`,
      en: String.raw`\(x_n \to L\) when for every \(\varepsilon > 0\) there is \(N\) with \(|x_n - L| < \varepsilon\) for all \(n > N\).`,
    },
    chapterId: 'sequences',
    sceneId: 'epsilon-n',
  },
  {
    id: 'norm',
    term: { ko: '노름', en: 'norm' },
    definition: {
      ko: String.raw`벡터의 "길이" \(\|x\|\). 거리는 \(d(x,y) = \|x - y\|\)로 만든다.`,
      en: String.raw`The "length" \(\|x\|\) of a vector; the metric is \(d(x,y) = \|x - y\|\).`,
    },
    chapterId: 'sequences',
    sceneId: 'norm',
  },
  {
    id: 'absolute-value',
    term: { ko: '절댓값', en: 'absolute value' },
    definition: {
      ko: String.raw`수직선에서 \(x\)와 0 사이의 거리 \(|x|\). 부호를 벗긴 크기.`,
      en: String.raw`The distance \(|x|\) between \(x\) and 0 on the number line; size without sign.`,
    },
    chapterId: 'numbers',
    sceneId: 'absolute-value',
  },
  {
    id: 'archimedean-property',
    term: { ko: '아르키메데스 성질', en: 'Archimedean property' },
    definition: {
      ko: String.raw`어떤 \(a > 0\)와 \(b\)에 대해서도 \(na > b\)인 자연수 \(n\)이 있다. 실수에는 무한히 작은 수가 없다.`,
      en: String.raw`For every \(a > 0\) and \(b\) there is a natural \(n\) with \(na > b\). The reals have no infinitely small numbers.`,
    },
    chapterId: 'numbers',
    sceneId: 'archimedean',
  },
  {
    id: 'squeeze-theorem',
    term: { ko: '조임 정리', en: 'squeeze theorem' },
    definition: {
      ko: String.raw`\(a_n \le b_n \le c_n\)이고 양쪽 끝이 같은 \(L\)로 가면 가운데도 \(L\)로 간다.`,
      en: String.raw`If \(a_n \le b_n \le c_n\) and both ends tend to the same \(L\), the middle tends to \(L\).`,
    },
    chapterId: 'sequences',
    sceneId: 'squeeze',
  },
  {
    id: 'inner-product',
    term: { ko: '내적', en: 'inner product' },
    definition: {
      ko: String.raw`두 벡터의 겹침 \(\langle x, y \rangle\). \(\langle x, x \rangle = \|x\|^2\)이라 노름을 만든다.`,
      en: String.raw`The overlap \(\langle x, y \rangle\) of two vectors; \(\langle x, x \rangle = \|x\|^2\), so it induces a norm.`,
    },
    chapterId: 'sequences',
    sceneId: 'inner-product',
  },
  {
    id: 'bounded-sequence',
    term: { ko: '유계수열', en: 'bounded sequence' },
    definition: {
      ko: String.raw`어떤 \(M\)이 있어 모든 항이 \(|a_n| \le M\)을 만족하는 수열.`,
      en: String.raw`A sequence with some \(M\) such that every term satisfies \(|a_n| \le M\).`,
    },
    chapterId: 'sequences',
    sceneId: 'bounded',
  },
  {
    id: 'subsequence',
    term: { ko: '부분수열', en: 'subsequence' },
    definition: {
      ko: String.raw`순서를 지키며 항을 뽑은 수열 \(a_{n_k}\) (\(n_1 < n_2 < \cdots\)).`,
      en: String.raw`The sequence \(a_{n_k}\) (\(n_1 < n_2 < \cdots\)) picked from a sequence in order.`,
    },
    chapterId: 'sequences',
    sceneId: 'subsequence',
  },
  {
    id: 'lp-space',
    term: { ko: String.raw`\(\ell^p\) 공간`, en: String.raw`\(\ell^p\) space` },
    definition: {
      ko: String.raw`\(p\)제곱 합이 유한한 수열들의 공간. \(\ell^1 \subset \ell^2 \subset \ell^\infty\)이다.`,
      en: String.raw`The space of sequences with finite \(p\)-th power sum; \(\ell^1 \subset \ell^2 \subset \ell^\infty\).`,
    },
    chapterId: 'sequences',
    sceneId: 'sequence-spaces',
  },
  {
    id: 'cauchy-schwarz-inequality',
    term: { ko: '코시-슈바르츠 부등식', en: 'Cauchy–Schwarz inequality' },
    definition: {
      ko: String.raw`\(|\langle x,y\rangle| \le \|x\|\,\|y\|\) — 내적의 절댓값은 노름의 곱을 넘지 않는다. 등호는 두 벡터가 평행할 때 성립한다.`,
      en: String.raw`\(|\langle x,y\rangle| \le \|x\|\,\|y\|\) — the inner product never exceeds the product of the norms; equality holds exactly for parallel vectors.`,
    },
    chapterId: 'sequences',
    sceneId: 'cauchy-schwarz',
  },
  {
    id: 'irrational',
    term: { ko: '무리수', en: 'irrational number' },
    definition: {
      ko: String.raw`유리수가 아닌 실수. \(\sqrt{2}\)가 대표적이다.`,
      en: String.raw`A real number that is not rational; \(\sqrt{2}\) is the classic example.`,
    },
    chapterId: 'sequences',
    sceneId: 'holes',
  },
  {
    id: 'real-number',
    term: { ko: '실수', en: 'real number' },
    definition: {
      ko: String.raw`유리수 코시 수열의 동치류. 유리수의 빈틈을 메워 만든 수이다.`,
      en: `An equivalence class of Cauchy sequences of rationals — the rationals with their gaps filled.`,
    },
    chapterId: 'sequences',
    sceneId: 'construction',
  },
  {
    id: 'cauchy-sequence',
    term: { ko: '코시 수열', en: 'Cauchy sequence' },
    definition: {
      ko: String.raw`항들이 서로 끝없이 가까워지는 수열. 실수에서는 수렴과 동치이다.`,
      en: String.raw`A sequence whose terms get arbitrarily close to each other; equivalent to convergence in \(\mathbb{R}\).`,
    },
    chapterId: 'sequences',
    sceneId: 'construction',
  },
  {
    id: 'bolzano-weierstrass',
    term: { ko: '볼차노–바이어슈트라스 정리', en: 'Bolzano–Weierstrass theorem' },
    definition: {
      ko: String.raw`유계인 실수 수열은 수렴하는 부분수열을 갖는다.`,
      en: `Every bounded real sequence has a convergent subsequence.`,
    },
    chapterId: 'sequences',
    sceneId: 'bolzano-weierstrass',
  },
  {
    id: 'monotone-sequence',
    term: { ko: '단조수열', en: 'monotone sequence' },
    definition: {
      ko: String.raw`항상 증가하거나 항상 감소하는 수열. 유계이면 수렴한다.`,
      en: `A sequence that is always increasing or always decreasing; if bounded, it converges.`,
    },
    chapterId: 'sequences',
    sceneId: 'monotone-cauchy',
  },
  {
    id: 'limsup',
    term: { ko: '상극한', en: 'limit superior' },
    definition: {
      ko: String.raw`꼬리들의 상한 \\(\\sup_{n \\ge N} a_n\\)이 \\(N \\to \\infty\\)일 때 모이는 값. 수열의 가장 큰 집적점이다.`,
      en: String.raw`The value the tail suprema \\(\\sup_{n \\ge N} a_n\\) settle to as \\(N \\to \\infty\\) — the largest cluster point of the sequence.`,
    },
    chapterId: 'sequences',
    sceneId: 'limsup-liminf',
  },
  {
    id: 'liminf',
    term: { ko: '하극한', en: 'limit inferior' },
    definition: {
      ko: String.raw`꼬리들의 하한 \\(\\inf_{n \\ge N} a_n\\)이 \\(N \\to \\infty\\)일 때 모이는 값. 수열의 가장 작은 집적점이다.`,
      en: String.raw`The value the tail infima \\(\\inf_{n \\ge N} a_n\\) settle to as \\(N \\to \\infty\\) — the smallest cluster point of the sequence.`,
    },
    chapterId: 'sequences',
    sceneId: 'limsup-liminf',
  },
  {
    id: 'stolz-cesaro-theorem',
    term: { ko: '체자로 정리', en: 'Stolz–Cesàro theorem' },
    definition: {
      ko: String.raw`수열 버전 로피탈: \((b_n)\)이 엄격히 증가하고 무한대로 발산하며 차분 비율 \(\frac{a_{n+1}-a_n}{b_{n+1}-b_n}\)이 \(L\)로 수렴하면 \(\frac{a_n}{b_n}\)도 \(L\)로 수렴한다.`,
      en: String.raw`The sequence l'Hôpital: if \((b_n)\) is strictly increasing and unbounded and the difference ratio \(\frac{a_{n+1}-a_n}{b_{n+1}-b_n}\) tends to \(L\), so does \(\frac{a_n}{b_n}\).`,
    },
    chapterId: 'sequences',
    sceneId: 'stolz-cesaro',
  },
  {
    id: 'double-sequence',
    term: { ko: '이중수열', en: 'double sequence' },
    definition: {
      ko: String.raw`두 인덱스 \(m, n\)으로 번호가 매겨진 수들의 배열 \(a_{m,n}\).`,
      en: String.raw`An array \(a_{m,n}\) of numbers indexed by two indices \(m, n\).`,
    },
    chapterId: 'sequences',
    sceneId: 'double-sequences',
  },
  {
    id: 'double-limit',
    term: { ko: '이중극한', en: 'double limit' },
    definition: {
      ko: String.raw`모든 \(\varepsilon > 0\)에 대해 \(m, n > N\)이면 \(|a_{m,n} - L| < \varepsilon\)이도록 \(N\)이 있을 때 \(a_{m,n} \to L\)이라는 Pringsheim 극한. 두 인덱스가 함께 커진다.`,
      en: String.raw`The Pringsheim limit: \(a_{m,n} \to L\) when for every \(\varepsilon > 0\) there is \(N\) with \(|a_{m,n} - L| < \varepsilon\) whenever \(m, n > N\). Both indices grow together.`,
    },
    chapterId: 'sequences',
    sceneId: 'double-sequences',
  },
  {
    id: 'iterated-limit',
    term: { ko: '반복극한', en: 'iterated limit' },
    definition: {
      ko: String.raw`한 인덱스를 먼저 극한 보내고 다른 인덱스를 나중에 보내는 극한 \(\lim_m \lim_n a_{m,n}\) 또는 \(\lim_n \lim_m a_{m,n}\). 순서를 바꾸면 값이 달라지거나 한쪽이 존재하지 않을 수 있다.`,
      en: String.raw`A limit taken in one index first and the other second, \(\lim_m \lim_n a_{m,n}\) or \(\lim_n \lim_m a_{m,n}\). Swapping the order can change the value, or one side may fail to exist.`,
    },
    chapterId: 'sequences',
    sceneId: 'double-sequences',
  },
  // ---------------------------------------------------------------- continuity
  {
    id: 'epsilon-delta',
    term: { ko: 'ε-δ 논법', en: 'epsilon-delta argument' },
    definition: {
      ko: String.raw`함수의 극한을 "오차 \(\varepsilon\)마다 허용 오차 \(\delta\)"로 정의하는 엄밀한 방식.`,
      en: String.raw`The rigorous definition of a function limit: for every error \(\varepsilon\) there is a tolerance \(\delta\).`,
    },
    chapterId: 'continuity',
    sceneId: 'epsdelta',
  },
  {
    id: 'continuity',
    term: { ko: '연속', en: 'continuity' },
    definition: {
      ko: String.raw`\(x \to a\)일 때 \(f(x) \to f(a)\). 그래프가 끊어지지 않는다.`,
      en: String.raw`\(f(x) \to f(a)\) as \(x \to a\); the graph has no breaks.`,
    },
    chapterId: 'continuity',
    sceneId: 'continuity',
  },
  {
    id: 'monotone-discontinuities',
    term: { ko: '단조함수의 불연속점', en: 'discontinuities of a monotone function' },
    definition: {
      ko: String.raw`단조함수의 불연속점은 모두 점프이며, 점프 크기가 \(1/n\)을 넘는 점은 유한 개뿐이므로 불연속점 전체는 가산집합이다.`,
      en: String.raw`Every discontinuity of a monotone function is a jump; only finitely many jumps exceed \(1/n\), so the discontinuities are at most countable.`,
    },
    chapterId: 'continuity',
    sceneId: 'monotone-discontinuities',
  },
  {
    id: 'uniform-continuity',
    term: { ko: '균등연속', en: 'uniform continuity' },
    definition: {
      ko: String.raw`하나의 \(\delta\)가 정의역 전체에서 통하는 연속성. \(1/x\)는 \((0,1]\)에서 연속이지만 균등연속이 아니다.`,
      en: String.raw`Continuity with a single \(\delta\) working across the whole domain; \(1/x\) is continuous but not uniformly continuous on \((0,1]\).`,
    },
    chapterId: 'continuity',
    sceneId: 'uniform-continuity',
  },
  {
    id: 'ivt',
    term: { ko: '중간값 정리', en: 'intermediate value theorem' },
    definition: {
      ko: String.raw`연속함수는 두 함숫값 사이의 모든 값을 취한다.`,
      en: `A continuous function takes every value between any two of its values.`,
    },
    chapterId: 'continuity',
    sceneId: 'ivt',
  },
  {
    id: 'evt',
    term: { ko: '최대·최소 정리', en: 'extreme value theorem' },
    definition: {
      ko: String.raw`닫힌 구간 위의 연속함수는 최댓값과 최솟값을 갖는다.`,
      en: `A continuous function on a closed interval attains a maximum and a minimum.`,
    },
    chapterId: 'continuity',
    sceneId: 'evt',
  },
  {
    id: 'uniform-convergence',
    term: { ko: '균등수렴', en: 'uniform convergence' },
    definition: {
      ko: String.raw`하나의 \(N\)이 모든 \(x\)에 통하는 함수열의 수렴. 극한의 연속성을 보존한다.`,
      en: String.raw`Convergence of a sequence of functions with one \(N\) working for all \(x\); it preserves continuity of the limit.`,
    },
    chapterId: 'continuity',
    sceneId: 'uniform',
  },
  {
    id: 'pointwise-convergence',
    term: { ko: '점별수렴', en: 'pointwise convergence' },
    definition: {
      ko: String.raw`각 점마다 따로 수렴하는 것. 극한이 불연속이 될 수 있다.`,
      en: `Convergence at each point separately; the limit may be discontinuous.`,
    },
    chapterId: 'continuity',
    sceneId: 'uniform',
  },
  // ---------------------------------------------------------------- topology
  {
    id: 'open-set',
    term: { ko: '열린집합', en: 'open set' },
    definition: {
      ko: String.raw`모든 점이 내점인 집합. 경계를 포함하지 않는다.`,
      en: `A set in which every point is an interior point; it contains none of its boundary.`,
    },
    chapterId: 'topology',
    sceneId: 'opensets',
  },
  {
    id: 'closed-set',
    term: { ko: '닫힌집합', en: 'closed set' },
    definition: {
      ko: String.raw`여집합이 열린 집합. 극한점을 모두 포함한다.`,
      en: `A set whose complement is open; it contains all its limit points.`,
    },
    chapterId: 'topology',
    sceneId: 'opensets',
  },
  {
    id: 'closure',
    term: { ko: '폐포', en: 'closure' },
    definition: {
      ko: String.raw`집합에 그 극한점을 모두 더한 것. \(\overline{A}\)로 쓴다.`,
      en: String.raw`A set together with all its limit points, written \(\overline{A}\).`,
    },
    chapterId: 'topology',
    sceneId: 'closure',
  },
  {
    id: 'bounded-set',
    term: { ko: '유계', en: 'bounded' },
    definition: {
      ko: String.raw`어떤 구간(또는 공) 안에 들어가는 집합.`,
      en: `A set that fits inside some interval (or ball).`,
    },
    chapterId: 'topology',
    sceneId: 'closure',
  },
  {
    id: 'compact-set',
    term: { ko: '컴팩트 집합', en: 'compact set' },
    definition: {
      ko: String.raw`닫혀 있고 유계인 집합 (실수에서는 하이네–보렐 정리). 모든 수열이 집합 안에서 수렴하는 부분수열을 갖는다.`,
      en: String.raw`A closed and bounded set (Heine–Borel in \(\mathbb{R}\)); every sequence has a subsequence converging inside the set.`,
    },
    chapterId: 'topology',
    sceneId: 'compact',
  },
  {
    id: 'heine-borel',
    term: { ko: '하이네–보렐 정리', en: 'Heine–Borel theorem' },
    definition: {
      ko: String.raw`실수 집합이 컴팩트인 것은 닫혀 있고 유계인 것과 동치이다.`,
      en: String.raw`A set of reals is compact if and only if it is closed and bounded.`,
    },
    chapterId: 'topology',
    sceneId: 'compact',
  },
  {
    id: 'metric-space',
    term: { ko: '거리공간', en: 'metric space' },
    definition: {
      ko: String.raw`두 점 사이의 거리 \(d(x,y)\)가 정의된 집합.`,
      en: String.raw`A set equipped with a distance \(d(x,y)\) between points.`,
    },
    chapterId: 'topology',
    sceneId: 'metric-spaces',
  },
  {
    id: 'metric',
    term: { ko: '거리', en: 'metric' },
    definition: {
      ko: String.raw`대칭성, 비음수성, 삼각부등식을 만족하는 거리 함수.`,
      en: `A distance function satisfying symmetry, non-negativity, and the triangle inequality.`,
    },
    chapterId: 'topology',
    sceneId: 'metric-spaces',
  },
  {
    id: 'complete-metric-space',
    term: { ko: '완비 거리공간', en: 'complete metric space' },
    definition: {
      ko: String.raw`모든 코시 수열이 공간 안의 점으로 수렴하는 거리공간.`,
      en: String.raw`A metric space where every Cauchy sequence converges to a point of the space.`,
    },
    chapterId: 'topology',
    sceneId: 'contraction',
  },
  {
    id: 'fixed-point',
    term: { ko: '고정점', en: 'fixed point' },
    definition: {
      ko: String.raw`\(Tx = x\)를 만족하는 점. 완비 거리공간의 수축사상은 유일한 고정점을 갖는다.`,
      en: String.raw`A point with \(Tx = x\); a contraction on a complete metric space has a unique one.`,
    },
    chapterId: 'topology',
    sceneId: 'contraction',
  },
  {
    id: 'meagre-set',
    term: { ko: '희박 집합 (제1 범주)', en: 'meagre set (first category)' },
    definition: {
      ko: String.raw`nowhere dense인 집합들의 가산합집합 — Baire Category Theorem에 따르면 완비 거리공간은 자기 자신 안에서 희박할 수 없습니다.`,
      en: String.raw`A countable union of nowhere dense sets — by the Baire Category Theorem, a complete metric space cannot be meagre in itself.`,
    },
    chapterId: 'topology',
    sceneId: 'baire-category',
  },
  {
    id: 'baire-space',
    term: { ko: '베어 공간', en: 'Baire space' },
    definition: {
      ko: String.raw`가산개의 조밀한 열린집합의 교집합이 항상 조밀한 위상공간 — 완비 거리공간과 국소 컴팩트 Hausdorff 공간이 대표적 예입니다.`,
      en: String.raw`A topological space in which every countable intersection of dense open sets is dense — complete metric spaces and locally compact Hausdorff spaces are the key examples.`,
    },
    chapterId: 'topology',
    sceneId: 'baire-category',
  },
  {
    id: 'baire-class-1',
    term: { ko: '베어 1급 함수', en: 'Baire class 1 function' },
    definition: {
      ko: String.raw`연속함수열의 점별 극한으로 표현되는 함수 — Thomae 함수가 대표 예시이며, 연속점 집합이 항상 조밀한 \(G_\delta\)를 포함한다.`,
      en: String.raw`A function expressible as the pointwise limit of a sequence of continuous functions — Thomae's function is the poster child; its continuity points always contain a dense \(G_\delta\).`,
    },
    chapterId: 'topology',
    sceneId: 'baire-1',
  },
  {
    id: 'oscillation-function',
    term: { ko: '진동 (함수의)', en: 'oscillation (of a function)' },
    definition: {
      ko: String.raw`점 \(x\)에서의 \(\omega_f(x) = \inf\{\mathrm{diam}\,f(U) : U \ni x\text{인 근방}\}\) — 국소적 퍼짐을 재는 양으로, \(\omega_f(x) = 0\)일 때 정확히 \(f\)가 \(x\)에서 연속이다.`,
      en: String.raw`At \(x\), \(\omega_f(x) = \inf\{\mathrm{diam}\,f(U) : U \text{ a neighborhood of } x\}\) measures local spread; \(\omega_f(x) = 0\) iff \(f\) is continuous at \(x\).`,
    },
    chapterId: 'topology',
    sceneId: 'baire-1',
  },
  {
    id: 'cantor-set',
    term: { ko: '칸토어 집합', en: 'Cantor set' },
    definition: {
      ko: String.raw`구간을 3등분하며 가운데를 계속 덜어내 만든 집합. 길이는 0이지만 비가산이다.`,
      en: `The set left after repeatedly removing middle thirds; it has length zero yet is uncountable.`,
    },
    chapterId: 'topology',
    sceneId: 'cantor',
  },
  {
    id: 'fat-cantor-set',
    term: { ko: '팻 칸토어 집합', en: 'fat Cantor set' },
    definition: {
      ko: String.raw`매 단계에서 길이 \(4^{-n}\)만 제거해 만든 칸토어형 집합 — 컴팩트하고 nowhere dense이며 perfect인데도 측도가 \(\frac12\)로 남는다. Smith–Volterra–Cantor 집합이라고도 한다.`,
      en: String.raw`A Cantor-type set built by removing only length \(4^{-n}\) at each stage — compact, nowhere dense and perfect, yet keeping measure \(\frac12\). Also called the Smith–Volterra–Cantor set.`,
    },
    chapterId: 'topology',
    sceneId: 'fat-cantor',
  },
  {
    id: 'cantor-function',
    term: { ko: '칸토어 함수', en: 'Cantor function' },
    definition: {
      ko: String.raw`칸토어 집합 위에서만 올라가는 연속 단조함수 — 여집합 구간에서는 상수라서 \(f'=0\)인 점들의 전체 길이가 \(1\)이다.`,
      en: String.raw`The continuous nondecreasing function that climbs only on the Cantor set — constant on every complementary interval, so \(f'=0\) on a set of total length \(1\).`,
    },
    chapterId: 'topology',
    sceneId: 'cantor-function',
  },
  {
    id: 'devils-staircase',
    term: { ko: '악마의 계단', en: "devil's staircase" },
    definition: {
      ko: `칸토어 함수의 별명 — 평평한 계단이 무한히 이어지는데도 0에서 1까지 오른다.`,
      en: `Nickname for the Cantor function — infinitely many flat steps, yet it climbs from 0 to 1.`,
    },
    chapterId: 'topology',
    sceneId: 'cantor-function',
  },
  {
    id: 'absolutely-continuous',
    term: { ko: '절대연속', en: 'absolutely continuous' },
    definition: {
      ko: String.raw`미적분학 기본정리가 성립하는 함수 클래스 — \(f(b)-f(a) = \int_a^b f'\)을 보장한다. 칸토어 함수는 연속이지만 절대연속이 아니다.`,
      en: String.raw`The class of functions for which the FTC holds — guaranteeing \(f(b)-f(a) = \int_a^b f'\). The Cantor function is continuous but not absolutely continuous.`,
    },
    chapterId: 'topology',
    sceneId: 'cantor-function',
  },
  {
    id: 'clopen-set',
    term: { ko: 'clopen 집합', en: 'clopen set' },
    definition: {
      ko: String.raw`열려 있으면서 닫혀 있는 집합. \(\mathbb{R}\)에서는 \(\varnothing\)과 \(\mathbb{R}\)뿐이지만, 부분공간에서는 자명하지 않은 예가 있다.`,
      en: String.raw`A set that is both open and closed. In \(\mathbb{R}\) only \(\varnothing\) and \(\mathbb{R}\) qualify, but subspaces admit nontrivial examples.`,
    },
    chapterId: 'topology',
    sceneId: 'clopen',
  },
  {
    id: 'topologist-sine-curve',
    term: { ko: '위상수학자의 사인 곡선', en: "topologist's sine curve" },
    definition: {
      ko: String.raw`\(\{(x, \sin(1/x)) : x > 0\}\)의 폐포 — 연결이지만 path-연결이 아닌 곡선의 대표 예시.`,
      en: String.raw`The closure of \(\{(x, \sin(1/x)) : x > 0\}\) — the canonical example of a connected but not path-connected curve.`,
    },
    chapterId: 'topology',
    sceneId: 'topologist-sine',
  },
  {
    id: 'peano-curve',
    term: { ko: '페아노 곡선', en: 'Peano curve' },
    definition: {
      ko: String.raw`\([0,1]\)에서 \([0,1]^2\)로의 연속 전사사상 — 공간 채움 곡선. 단사성은 불가능하다.`,
      en: String.raw`A continuous surjection \([0,1] \to [0,1]^2\) — a space-filling curve. Injectivity is impossible.`,
    },
    chapterId: 'topology',
    sceneId: 'peano-curve',
  },
  // ---------------------------------------------------------------- approximation
  {
    id: 'equicontinuous',
    term: { ko: '동등연속', en: 'equicontinuous' },
    definition: {
      ko: String.raw`함수족 \(\mathcal{F}\)가 한 점이 아니라 모든 점에서 "같은 \(\delta\)"로 연속인 성질 — \(\varepsilon > 0\)마다 모든 \(f \in \mathcal{F}\)에 통하는 \(\delta > 0\)이 존재한다. Arzelà–Ascoli 정리의 핵심 가정.`,
      en: String.raw`A family \(\mathcal{F}\) of functions that is continuous with "the same \(\delta\)" at every point — for each \(\varepsilon > 0\) there is \(\delta > 0\) working for all \(f \in \mathcal{F}\). The key hypothesis of the Arzelà–Ascoli theorem.`,
    },
    chapterId: 'approximation',
    sceneId: 'arzela-ascoli',
  },
  {
    id: 'relatively-compact',
    term: { ko: '상대 컴팩트', en: 'relatively compact' },
    definition: {
      ko: String.raw`폐포가 컴팩트인 집합 — 모든 수열이 수렴하는 부분수열을 품는다. \(C(K)\)에서는 균등 유계 + 동등연속과 동치 (Arzelà–Ascoli).`,
      en: String.raw`A set whose closure is compact — every sequence hides a convergent subsequence. In \(C(K)\) this is equivalent to uniform boundedness + equicontinuity (Arzelà–Ascoli).`,
    },
    chapterId: 'approximation',
    sceneId: 'arzela-ascoli',
  },
  {
    id: 'weierstrass-approx',
    term: { ko: '바이어슈트라스 근사정리', en: 'Weierstrass approximation theorem' },
    definition: {
      ko: String.raw`닫힌 구간 위의 연속함수는 다항식으로 균등하게 근사할 수 있다.`,
      en: `Every continuous function on a closed interval can be uniformly approximated by polynomials.`,
    },
    chapterId: 'approximation',
    sceneId: 'weierstrass-approx',
  },
  {
    id: 'bernstein-polynomial',
    term: { ko: '번스타인 다항식', en: 'Bernstein polynomial' },
    definition: {
      ko: String.raw`\(B_n(f)(x) = \sum_{k=0}^{n} f(k/n)\binom{n}{k}x^k(1-x)^{n-k}\). 근사정리의 구성적 증명에 쓰인다.`,
      en: String.raw`\(B_n(f)(x) = \sum_{k=0}^{n} f(k/n)\binom{n}{k}x^k(1-x)^{n-k}\); used in the constructive proof of the approximation theorem.`,
    },
    chapterId: 'approximation',
    sceneId: 'weierstrass-approx',
  },
  {
    id: 'separating-points',
    term: { ko: '점 분리', en: 'separating points' },
    definition: {
      ko: String.raw`서로 다른 두 점 \(x \ne y\)에 대해 값이 다른 함수 \(u\) (\(u(x) \ne u(y)\))가 대수 \(\mathcal{A}\) 안에 존재하는 성질. Stone–Weierstrass 정리의 핵심 가정 중 하나.`,
      en: String.raw`The property that for any two distinct points \(x \ne y\) there is a function \(u\) in the algebra \(\mathcal{A}\) with \(u(x) \ne u(y)\). One of the key hypotheses of the Stone–Weierstrass theorem.`,
    },
    chapterId: 'approximation',
    sceneId: 'stone-weierstrass',
  },
  {
    id: 'subalgebra',
    term: { ko: '부분대수', en: 'subalgebra' },
    definition: {
      ko: String.raw`선형결합과 곱셈에 닫혀 있는 함수의 집합. 삼각다항식은 곱셈 공식(예: \(\cos A \cos B = \tfrac12(\cos(A-B)+\cos(A+B))\))에 의해 부분대수이며, Stone–Weierstrass 정리로 \(C(S^1)\)에서 균등 조밀하다.`,
      en: String.raw`A set of functions closed under linear combinations and products. Trigonometric polynomials form a subalgebra via product-to-sum identities (e.g. \(\cos A \cos B = \tfrac12(\cos(A-B)+\cos(A+B))\)), and by the Stone–Weierstrass theorem it is uniformly dense in \(C(S^1)\).`,
    },
    chapterId: 'approximation',
    sceneId: 'stone-weierstrass',
  },
  {
    id: 'muntz-szasz-theorem',
    term: { ko: '뮌츠-서스 정리', en: 'Müntz–Szász theorem' },
    definition: {
      ko: String.raw`\(0 < \lambda_1 < \lambda_2 < \cdots\)일 때 \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\)가 \(C[0,1]\)에서 조밀할 필요충분조건은 \(\sum \frac{1}{\lambda_n} = \infty\)이다.`,
      en: String.raw`For \(0 < \lambda_1 < \lambda_2 < \cdots\), \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\) is dense in \(C[0,1]\) if and only if \(\sum \frac{1}{\lambda_n} = \infty\).`,
    },
    chapterId: 'approximation',
    sceneId: 'muntz-szasz',
  },
  // ---------------------------------------------------------------- series
  {
    id: 'harmonic-series',
    term: { ko: '조화급수', en: 'harmonic series' },
    definition: {
      ko: String.raw`\(\sum 1/n\). 항은 0으로 가지만 합은 발산한다.`,
      en: String.raw`\(\sum 1/n\): its terms tend to 0, yet the sum diverges.`,
    },
    chapterId: 'series',
    sceneId: 'harmonic',
  },
  {
    id: 'divergence',
    term: { ko: '발산', en: 'divergence' },
    definition: {
      ko: String.raw`급수의 부분합이 유한한 극한을 갖지 않는 것.`,
      en: `A series whose partial sums have no finite limit.`,
    },
    chapterId: 'series',
    sceneId: 'harmonic',
  },
  {
    id: 'euler-mascheroni-constant',
    term: { ko: '오일러-마스케로니 상수', en: 'Euler–Mascheroni constant' },
    definition: {
      ko: String.raw`\(\gamma = \lim_{n\to\infty}(H_n - \ln n) \approx 0.5772\) — 조화수와 로그 사이의 간격이 모이는 값.`,
      en: String.raw`\(\gamma = \lim_{n\to\infty}(H_n - \ln n) \approx 0.5772\) — the value the gap between harmonic numbers and the logarithm settles at.`,
    },
    chapterId: 'series',
    sceneId: 'euler-mascheroni',
  },
  {
    id: 'harmonic-number',
    term: { ko: '조화수', en: 'harmonic number' },
    definition: {
      ko: String.raw`\(H_n = 1 + \frac12 + \cdots + \frac1n\) — 조화급수의 부분합.`,
      en: String.raw`\(H_n = 1 + \frac12 + \cdots + \frac1n\) — the partial sums of the harmonic series.`,
    },
    chapterId: 'series',
    sceneId: 'euler-mascheroni',
  },
  {
    id: 'basel-problem',
    term: { ko: '바젤 문제', en: 'Basel problem' },
    definition: {
      ko: String.raw`\(\sum 1/n^2 = \pi^2/6\)임을 보이는 문제.`,
      en: String.raw`The problem of showing \(\sum 1/n^2 = \pi^2/6\).`,
    },
    chapterId: 'series',
    sceneId: 'basel',
  },
  {
    id: 'euler-product',
    term: { ko: '오일러 곱 공식', en: 'Euler product' },
    definition: {
      ko: String.raw`\(s > 1\)에서 \(\zeta(s) = \prod_p (1-p^{-s})^{-1}\) — 체로 합성수 항을 걸러내면 소수 위의 곱만 남는다.`,
      en: String.raw`For \(s > 1\), \(\zeta(s) = \prod_p (1-p^{-s})^{-1}\) — sieving out composite terms leaves only the product over primes.`,
    },
    chapterId: 'series',
    sceneId: 'euler-product',
  },
  {
    id: 'alternating-series',
    term: { ko: '교대급수', en: 'alternating series' },
    definition: {
      ko: String.raw`부호가 번갈아 바뀌는 급수. 항이 단조롭게 0으로 가면 수렴한다(라이프니츠 판정법).`,
      en: `A series with alternating signs; it converges if its terms decrease monotonically to 0 (Leibniz test).`,
    },
    chapterId: 'series',
    sceneId: 'leibniz',
  },
  {
    id: 'comparison-test',
    term: { ko: '비교판정법', en: 'comparison test' },
    definition: {
      ko: String.raw`항을 기준으로 삼을 급수와 비교해 수렴을 판정하는 방법.`,
      en: `Deciding convergence by comparing terms against a reference series.`,
    },
    chapterId: 'series',
    sceneId: 'tests',
  },
  {
    id: 'ratio-test',
    term: { ko: '비율판정법', en: 'ratio test' },
    definition: {
      ko: String.raw`\(|a_{n+1}/a_n|\)의 극한으로 수렴을 판정하는 방법.`,
      en: String.raw`Deciding convergence from the limit of \(|a_{n+1}/a_n|\).`,
    },
    chapterId: 'series',
    sceneId: 'tests',
  },
  {
    id: 'integral-test',
    term: { ko: '적분 판정법', en: 'integral test' },
    definition: {
      ko: String.raw`감소하는 양의 함수에 대해 급수와 이상적분이 수렴·발산을 함께한다.`,
      en: `For a decreasing positive function, the series and the improper integral converge or diverge together.`,
    },
    chapterId: 'series',
    sceneId: 'integral-test',
  },
  {
    id: 'double-series',
    term: { ko: '이중급수', en: 'double series' },
    definition: {
      ko: String.raw`항이 격자 \((m,n)\) 위에 놓인 급수. 절댓값이 수렴하면 행·열 어느 쪽으로 먼저 합해도 같다.`,
      en: `A series with terms on the grid \((m,n)\); with absolute convergence, rows-first and columns-first sums agree.`,
    },
    chapterId: 'series',
    sceneId: 'double-series',
  },
  {
    id: 'raabe-test',
    term: { ko: '라베 판정법', en: "Raabe's test" },
    definition: {
      ko: String.raw`\(L = \lim n(a_n/a_{n+1} - 1)\): \(L > 1\)이면 수렴, \(L < 1\)이면 발산. 비율이 1로 가서 비율 판정법이 침묵할 때 쓰는 판정법.`,
      en: String.raw`\(L = \lim n(a_n/a_{n+1} - 1)\): converges if \(L > 1\), diverges if \(L < 1\). The test to reach for when the ratio drifts to 1 and the ratio test goes silent.`,
    },
    chapterId: 'series',
    sceneId: 'raabe-test',
  },
  {
    id: 'kummer-test',
    term: { ko: '쿰머 판정법', en: "Kummer's test" },
    definition: {
      ko: String.raw`\(K_n = p_n a_n/a_{n+1} - p_{n+1}\)이 양수로 머무르면 수렴, 0 이하에 머무르고 \(\sum 1/p_n\)이 발산하면 발산. \(p_n = 1\)은 비율 판정법, \(p_n = n\)은 라베 판정법이다.`,
      en: String.raw`With \(K_n = p_n a_n/a_{n+1} - p_{n+1}\): convergence if \(K_n\) stays positive, divergence if \(K_n \le 0\) and \(\sum 1/p_n\) diverges. \(p_n = 1\) gives the ratio test, \(p_n = n\) gives Raabe's.`,
    },
    chapterId: 'series',
    sceneId: 'kummer-test',
  },
  {
    id: 'gauss-test',
    term: { ko: '가우스 판정법', en: "Gauss's test" },
    definition: {
      ko: String.raw`\(a_n/a_{n+1} = 1 + h/n + O(1/n^r)\) \((r > 1)\)이면 \(h > 1\)에서 수렴, \(h < 1\)에서 발산 — 쿰머 판정법의 따름정리.`,
      en: String.raw`If \(a_n/a_{n+1} = 1 + h/n + O(1/n^r)\) \((r > 1)\): converges for \(h > 1\), diverges for \(h < 1\) — a corollary of Kummer's test.`,
    },
    chapterId: 'series',
    sceneId: 'kummer-test',
  },
  {
    id: 'condensation-test',
    term: { ko: '코시 응축 판정법', en: 'Cauchy condensation test' },
    definition: {
      ko: String.raw`감소하는 \(a_n \ge 0\)에 대해 \(\sum a_n\)과 \(\sum 2^n a_{2^n}\)은 수렴성을 공유한다.`,
      en: String.raw`For decreasing \(a_n \ge 0\), \(\sum a_n\) and \(\sum 2^n a_{2^n}\) share convergence.`,
    },
    chapterId: 'series',
    sceneId: 'condensation',
  },
  {
    id: 'telescoping-series',
    term: { ko: '망원급수', en: 'telescoping series' },
    definition: {
      ko: String.raw`이웃한 항이 소거되어 부분합이 간단해지는 급수.`,
      en: `A series whose neighboring terms cancel, leaving a simple partial sum.`,
    },
    chapterId: 'series',
    sceneId: 'telescoping',
  },
  {
    id: 'geometric-series',
    term: { ko: '등비급수', en: 'geometric series' },
    definition: {
      ko: String.raw`\(\sum ar^n\). \(|r| < 1\)일 때 \(a/(1-r)\)로 수렴한다.`,
      en: String.raw`\(\sum ar^n\); converges to \(a/(1-r)\) when \(|r| < 1\).`,
    },
    chapterId: 'series',
    sceneId: 'geometric',
  },
  {
    id: 'wallis-product',
    term: { ko: '월리스 곱', en: 'Wallis product' },
    definition: {
      ko: String.raw`\(\pi/2\)를 무한곱으로 나타낸 식.`,
      en: String.raw`An infinite product representation of \(\pi/2\).`,
    },
    chapterId: 'series',
    sceneId: 'wallis',
  },
  {
    id: 'stirling-approx',
    term: { ko: '스털링 근사', en: "Stirling's approximation" },
    definition: {
      ko: String.raw`\(n! \approx \sqrt{2\pi n}\,(n/e)^n\).`,
      en: String.raw`The asymptotic \(n! \approx \sqrt{2\pi n}\,(n/e)^n\).`,
    },
    chapterId: 'series',
    sceneId: 'stirling',
  },
  {
    id: 'factorial',
    term: { ko: '팩토리얼', en: 'factorial' },
    definition: {
      ko: String.raw`\(n! = 1\cdot 2\cdots n\).`,
      en: String.raw`\(n! = 1\cdot 2\cdots n\).`,
    },
    chapterId: 'series',
    sceneId: 'stirling',
  },
  {
    id: 'grandi-series',
    term: { ko: '그란디 급수', en: 'Grandi series' },
    definition: {
      ko: String.raw`\(1-1+1-1+\cdots\). 보통의 의미로는 발산한다.`,
      en: String.raw`\(1-1+1-1+\cdots\); divergent in the usual sense.`,
    },
    chapterId: 'series',
    sceneId: 'grandi',
  },
  {
    id: 'cesaro-sum',
    term: { ko: '체사로 합', en: 'Cesàro sum' },
    definition: {
      ko: String.raw`부분합의 평균의 극한. 그란디 급수의 체사로 합은 \(1/2\)이다.`,
      en: String.raw`The limit of the averaged partial sums; the Grandi series sums to \(1/2\) this way.`,
    },
    chapterId: 'series',
    sceneId: 'grandi',
  },
  {
    id: 'dirichlet-test',
    term: { ko: '디리클레 판정법', en: "Dirichlet's test" },
    definition: {
      ko: String.raw`\\((a_n)\\)의 부분합이 유계이고 \\((b_n)\\)이 0으로 단조 감소하면 \\(\\sum a_n b_n\\)이 수렴한다.`,
      en: String.raw`If the partial sums of \\((a_n)\\) are bounded and \\((b_n)\\) decreases to 0, then \\(\\sum a_n b_n\\) converges.`,
    },
    chapterId: 'series',
    sceneId: 'dirichlet-test',
  },
  {
    id: 'abel-test',
    term: { ko: '아벨 판정법', en: "Abel's test" },
    definition: {
      ko: String.raw`\(\sum a_n\)이 수렴하고 \((b_n)\)이 단조·유계이면 \(\sum a_n b_n\)이 수렴한다. 디리클레 판정법과 달리 \((b_n)\)이 0으로 갈 필요가 없다.`,
      en: String.raw`If \(\sum a_n\) converges and \((b_n)\) is monotone and bounded, then \(\sum a_n b_n\) converges. Unlike Dirichlet's test, \((b_n)\) need not tend to 0.`,
    },
    chapterId: 'series',
    sceneId: 'abel-test',
  },
  {
    id: 'summation-by-parts',
    term: { ko: '부분합 공식', en: 'summation by parts' },
    definition: {
      ko: String.raw`\(\sum_{k=m}^{n} a_k b_k = A_n b_{n+1} - A_{m-1} b_m + \sum_{k=m}^{n} A_k (b_k - b_{k+1})\) — 이산 버전의 부분적분. 아벨 판정법의 증명 엔진이다.`,
      en: String.raw`\(\sum_{k=m}^{n} a_k b_k = A_n b_{n+1} - A_{m-1} b_m + \sum_{k=m}^{n} A_k (b_k - b_{k+1})\) — the discrete integration by parts; the engine behind Abel's test.`,
    },
    chapterId: 'series',
    sceneId: 'abel-test',
  },
  // ---------------------------------------------------------------- power-series
  {
    id: 'power-series',
    term: { ko: '멱급수', en: 'power series' },
    definition: {
      ko: String.raw`\(\sum a_n(x-c)^n\) 꼴의 급수.`,
      en: String.raw`A series of the form \(\sum a_n(x-c)^n\).`,
    },
    chapterId: 'power-series',
    sceneId: 'power-series',
  },
  {
    id: 'radius-of-convergence',
    term: { ko: '수렴반경', en: 'radius of convergence' },
    definition: {
      ko: String.raw`멱급수가 수렴하는 구간의 반지름.`,
      en: `The radius of the interval on which a power series converges.`,
    },
    chapterId: 'power-series',
    sceneId: 'power-series',
  },
  {
    id: 'hadamard-gap',
    term: { ko: 'Hadamard 간극', en: 'Hadamard gap' },
    definition: {
      ko: String.raw`멱급수 \(\sum a_k z^{n_k}\)의 지수가 \(n_{k+1}/n_k \ge q > 1\)을 만족하는 띄엄띄엄한 배치 — 예: \(n_k = 2^k\) (비율 정확히 2). 수렴반경이 1이면 단위원 전체가 자연경계가 된다.`,
      en: String.raw`A sparse layout of exponents in \(\sum a_k z^{n_k}\) with \(n_{k+1}/n_k \ge q > 1\) — e.g. \(n_k = 2^k\) (ratio exactly 2). With radius 1, the whole unit circle becomes a natural boundary.`,
    },
    chapterId: 'power-series',
    sceneId: 'hadamard-gap',
  },
  {
    id: 'natural-boundary',
    term: { ko: '자연경계', en: 'natural boundary' },
    definition: {
      ko: String.raw`정칙함수가 그 너머의 어떤 점으로도 정칙 확장될 수 없는 곡선 — Hadamard 간극 정리에 의해 \(\sum z^{2^k}\)에게 단위원 \(|z| = 1\)이 바로 그것이다.`,
      en: String.raw`A curve past no point of which a holomorphic function can be analytically continued — for \(\sum z^{2^k}\) the unit circle \(|z| = 1\) is exactly that, by the Hadamard gap theorem.`,
    },
    chapterId: 'power-series',
    sceneId: 'hadamard-gap',
  },
  {
    id: 'abel-theorem',
    term: { ko: '아벨 정리', en: "Abel's theorem" },
    definition: {
      ko: String.raw`\(\sum a_n \to S\)이면 \(\lim_{x\to 1^{-}}\sum a_n x^n = S\) — 멱급수의 경계값이 보통 합을 복원한다.`,
      en: String.raw`If \(\sum a_n \to S\) then \(\lim_{x\to 1^{-}}\sum a_n x^n = S\) — the boundary value of the power series recovers the ordinary sum.`,
    },
    chapterId: 'power-series',
    sceneId: 'abel-theorem',
  },
  {
    id: 'abel-sum',
    term: { ko: '아벨 합', en: 'Abel sum' },
    definition: {
      ko: String.raw`\(\lim_{x\to 1^{-}}\sum a_n x^n\)이 존재할 때의 값. 발산급수에도 값을 붙일 수 있으나 급수의 "합"은 아니다 — 그란디 급수의 Abel 합은 \(1/2\).`,
      en: String.raw`The value of \(\lim_{x\to 1^{-}}\sum a_n x^n\) when it exists. Assigns values to divergent series, but is never "the sum" — the Abel sum of Grandi's series is \(1/2\).`,
    },
    chapterId: 'power-series',
    sceneId: 'abel-theorem',
  },
  {
    id: 'tauberian-theorem',
    term: { ko: '타우버형 정리', en: 'Tauberian theorem' },
    definition: {
      ko: String.raw`Abel 합 같은 약한 총합법으로부터 항에 대한 부가 조건(\(a_n = o(1/n)\)) 하에 보통 수렴을 되돌려내는 정리 — 타우버 정리가 그 원형이다.`,
      en: String.raw`A theorem recovering ordinary convergence from a weaker summability method (like Abel summation) under an extra condition on the terms, e.g. \(a_n = o(1/n)\) — Tauber's theorem is the prototype.`,
    },
    chapterId: 'power-series',
    sceneId: 'tauber',
  },
  {
    id: 'euler-number',
    term: { ko: String.raw`자연상수 \(e\)`, en: String.raw`the constant \(e\)` },
    definition: {
      ko: String.raw`\(\lim (1+1/n)^n = \sum 1/n!\). 자연로그의 밑이다.`,
      en: String.raw`The base of the natural logarithm: \(\lim (1+1/n)^n = \sum 1/n!\).`,
    },
    chapterId: 'power-series',
    sceneId: 'eseries',
  },
  {
    id: 'riemann-zeta',
    term: { ko: '리만 제타함수', en: 'Riemann zeta function' },
    definition: {
      ko: String.raw`\(\zeta(s) = \sum 1/n^s\). 바젤 문제는 \(\zeta(2) = \pi^2/6\)이다.`,
      en: String.raw`\(\zeta(s) = \sum 1/n^s\); the Basel problem is \(\zeta(2) = \pi^2/6\).`,
    },
    chapterId: 'power-series',
    sceneId: 'zeta4',
  },
  {
    id: 'rearrangement-theorem',
    term: { ko: '재배열 정리', en: 'rearrangement theorem' },
    definition: {
      ko: String.raw`절대수렴 급수는 항의 순서를 바꿔도 합이 같다. 조건수렴 급수는 그렇지 않다.`,
      en: `Absolutely convergent series keep their sum under reordering; conditionally convergent ones need not.`,
    },
    chapterId: 'power-series',
    sceneId: 'rearrangement',
  },
  {
    id: 'conditional-convergence',
    term: { ko: '조건수렴', en: 'conditional convergence' },
    definition: {
      ko: String.raw`수렴하지만 절대수렴하지는 않는 것.`,
      en: `Convergence without absolute convergence.`,
    },
    chapterId: 'power-series',
    sceneId: 'rearrangement',
  },
  {
    id: 'absolute-convergence',
    term: { ko: '절대수렴', en: 'absolute convergence' },
    definition: {
      ko: String.raw`\(\sum |a_n|\)이 수렴하는 것. 수렴을 보장한다.`,
      en: String.raw`Convergence of \(\sum |a_n|\); it implies convergence.`,
    },
    chapterId: 'power-series',
    sceneId: 'absolute',
  },
  {
    id: 'riemann-rearrangement-theorem',
    term: { ko: '리만 재배열 정리', en: "Riemann's rearrangement theorem" },
    definition: {
      ko: String.raw`조건수렴하는 실수 급수는 재배열로 임의의 실수(또는 \(\pm\infty\))에 수렴시킬 수 있다 — 양항 부분과 음항 부분이 각각 발산하기 때문이다.`,
      en: String.raw`A conditionally convergent real series can be rearranged to converge to any real number (or \(\pm\infty\)) — because its positive and negative parts each diverge.`,
    },
    chapterId: 'power-series',
    sceneId: 'riemann-rearrangement',
  },
  {
    id: 'cauchy-product',
    term: { ko: '코시 곱', en: 'Cauchy product' },
    definition: {
      ko: String.raw`두 급수의 곱 \((\sum a_n)(\sum b_n) = \sum c_n\), \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\) — 대각선 합.`,
      en: String.raw`The product of two series \((\sum a_n)(\sum b_n) = \sum c_n\) with \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\) — diagonal sums.`,
    },
    chapterId: 'power-series',
    sceneId: 'cauchy-product',
  },
  {
    id: 'mertens-theorem',
    term: { ko: '메르텐스 정리', en: "Mertens' theorem" },
    definition: {
      ko: String.raw`한 급수가 절대수렴하고 다른 하나가 수렴하면 코시 곱도 수렴하고 그 합은 두 합의 곱과 같다.`,
      en: String.raw`If one series converges absolutely and the other converges, their Cauchy product converges to the product of the sums.`,
    },
    chapterId: 'power-series',
    sceneId: 'cauchy-product',
  },
  // ---------------------------------------------------------------- function-series
  {
    id: 'm-test',
    term: { ko: 'M-판정법', en: 'Weierstrass M-test' },
    definition: {
      ko: String.raw`\\(|f_n(x)| \\le M_n\\)이고 \\(\\sum M_n\\)이 수렴하면 \\(\\sum f_n\\)은 균등수렴한다.`,
      en: String.raw`If \\(|f_n(x)| \\le M_n\\) for all \\(x\\) and \\(\\sum M_n\\) converges, then \\(\\sum f_n\\) converges uniformly.`,
    },
    chapterId: 'function-series',
    sceneId: 'm-test',
  },
  {
    id: 'dini-theorem',
    term: { ko: '디니 정리', en: "Dini's theorem" },
    definition: {
      ko: String.raw`컴팩트 집합 위에서 단조인 연속함수열이 연속인 극한에 점별수렴하면 균등수렴한다.`,
      en: String.raw`On a compact set, a monotone sequence of continuous functions converging pointwise to a continuous limit converges uniformly.`,
    },
    chapterId: 'function-series',
    sceneId: 'dini',
  },
  {
    id: 'fourier-series',
    term: { ko: '푸리에 급수', en: 'Fourier series' },
    definition: {
      ko: String.raw`주기함수를 사인·코사인 급수로 나타낸 것.`,
      en: `A periodic function expressed as a sine-cosine series.`,
    },
    chapterId: 'function-series',
    sceneId: 'fourier',
  },
  {
    id: 'fejer-kernel',
    term: { ko: 'Fejér kernel', en: 'Fejér kernel' },
    definition: {
      ko: String.raw`\(K_N(t) = \frac1N\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2\) — 0 이상이고 평균이 1인 삼각다항식으로, 푸리에 부분합의 체자로 평균을 컨볼루션으로 만든다.`,
      en: String.raw`\(K_N(t) = \frac1N\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2\) — a nonnegative trigonometric polynomial of mean 1 that turns Cesàro means of Fourier sums into a convolution.`,
    },
    chapterId: 'function-series',
    sceneId: 'fejer-theorem',
  },
  {
    id: 'cesaro-mean',
    term: { ko: '체자로 평균', en: 'Cesàro mean' },
    definition: {
      ko: String.raw`부분합들의 평균 \(\sigma_N = \frac{S_0+\cdots+S_{N-1}}{N}\) — 발산하는 급수에도 합을 부여할 수 있고, 푸리에급수에서는 울림을 매끈하게 다듬는다 (Fejér 정리).`,
      en: String.raw`The average of partial sums \(\sigma_N = \frac{S_0+\cdots+S_{N-1}}{N}\) — it can sum divergent series, and for Fourier series it smooths out the ringing (Fejér's theorem).`,
    },
    chapterId: 'function-series',
    sceneId: 'fejer-theorem',
  },
  {
    id: 'gibbs-phenomenon',
    term: { ko: 'Gibbs 현상', en: 'Gibbs phenomenon' },
    definition: {
      ko: String.raw`점프 불연속점 근처에서 푸리에 부분합이 점프의 약 8.95%만큼 오버슈트하고, \(N\)을 키워도 혹이 좁아질 뿐 사라지지 않는 현상.`,
      en: String.raw`Fourier partial sums overshoot by about 8.95% of the jump near a discontinuity — raising \(N\) narrows the bump but never removes it.`,
    },
    chapterId: 'function-series',
    sceneId: 'gibbs-phenomenon',
  },
  {
    id: 'cb-space',
    term: { ko: String.raw`\(C_b(X)\) 공간`, en: String.raw`\(C_b(X)\) space` },
    definition: {
      ko: String.raw`\(X\) 위의 유계 연속함수 전체에 sup 노름 \(\|f\|_\infty = \sup_X |f|\)를 준 공간. 완비하다.`,
      en: String.raw`The bounded continuous functions on \(X\) with the sup norm \(\|f\|_\infty = \sup_X |f|\). It is complete.`,
    },
    chapterId: 'function-series',
    sceneId: 'function-spaces',
  },
  {
    id: 'c0-space',
    term: { ko: String.raw`\(C_0(X)\) 공간`, en: String.raw`\(C_0(X)\) space` },
    definition: {
      ko: String.raw`무한원에서 사라지는 연속함수들의 공간: 모든 \(\varepsilon > 0\)에 대해 compact 집합 밖에서 \(|f| < \varepsilon\)이다. \(C_b\)의 닫힌 부분공간이라 완비하다.`,
      en: String.raw`The continuous functions vanishing at infinity: for every \(\varepsilon > 0\), \(|f| < \varepsilon\) outside some compact set. A closed subspace of \(C_b\), hence complete.`,
    },
    chapterId: 'function-series',
    sceneId: 'function-spaces',
  },
  {
    id: 'cc-space',
    term: { ko: String.raw`\(C_c(X)\) 공간`, en: String.raw`\(C_c(X)\) space` },
    definition: {
      ko: String.raw`지지집합이 compact인 연속함수들의 공간. \(C_0\) 안에서 dense이지만 완비가 아니고 닫혀 있지도 않다: \(\overline{C_c} = C_0\).`,
      en: String.raw`The continuous functions with compact support. Dense in \(C_0\) but neither complete nor closed: \(\overline{C_c} = C_0\).`,
    },
    chapterId: 'function-series',
    sceneId: 'function-spaces',
  },
  {
    id: 'wilbraham-gibbs-constant',
    term: { ko: 'Wilbraham–Gibbs 상수', en: 'Wilbraham–Gibbs constant' },
    definition: {
      ko: String.raw`Gibbs 오버슈트의 극한값 \(\frac{2}{\pi}\mathrm{Si}(\pi) - 1 \approx 0.17898\) — 점프 크기의 약 8.949%. \(\mathrm{Si}\)는 사인 적분.`,
      en: String.raw`The limiting Gibbs overshoot \(\frac{2}{\pi}\mathrm{Si}(\pi) - 1 \approx 0.17898\) — about 8.949% of the jump. \(\mathrm{Si}\) is the sine integral.`,
    },
    chapterId: 'function-series',
    sceneId: 'gibbs-phenomenon',
  },
  // ---------------------------------------------------------------- differentiation
  {
    id: 'differentiable',
    term: { ko: '미분가능', en: 'differentiable' },
    definition: {
      ko: String.raw`그 점에서 접선이 존재하는 것. 미분가능하면 연속이다.`,
      en: `Having a tangent line at the point; differentiability implies continuity.`,
    },
    chapterId: 'differentiation',
    sceneId: 'diffcont',
  },
  {
    id: 'mean-value-theorem',
    term: { ko: '평균값 정리', en: 'mean value theorem' },
    definition: {
      ko: String.raw`\([a,b]\)에서 연속이고 \((a,b)\)에서 미분가능하면 \(f'(c) = (f(b)-f(a))/(b-a)\)인 \(c\)가 존재한다.`,
      en: String.raw`If \(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\), some \(c\) satisfies \(f'(c) = (f(b)-f(a))/(b-a)\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'mvt',
  },
  {
    id: 'inverse-function-theorem',
    term: { ko: '역함수 정리', en: 'inverse function theorem' },
    definition: {
      ko: String.raw`\(f'(a) \ne 0\)이면 \(f\)는 \(a\) 근처에서 역함수를 갖고, \((f^{-1})'(f(a)) = 1/f'(a)\).`,
      en: String.raw`If \(f'(a) \ne 0\), \(f\) has a local inverse near \(a\) with \((f^{-1})'(f(a)) = 1/f'(a)\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'inverse-function-theorem',
  },
  {
    id: 'cauchy-mean-value',
    term: { ko: '코시 평균값 정리', en: 'Cauchy mean value theorem' },
    definition: {
      ko: String.raw`두 함수에 대한 평균값 정리. 로피탈 정리의 바탕이다.`,
      en: `The mean value theorem for two functions; the basis of l'Hôpital's rule.`,
    },
    chapterId: 'differentiation',
    sceneId: 'cauchy-mvt',
  },
  {
    id: 'lhopital-rule',
    term: { ko: '로피탈 정리', en: "L'Hôpital's rule" },
    definition: {
      ko: String.raw`\(0/0\)이나 \(\infty/\infty\) 꼴의 극한은 분자·분모를 각각 미분한 극한과 같다.`,
      en: String.raw`A \(0/0\) or \(\infty/\infty\) limit equals the limit of the differentiated numerator over denominator.`,
    },
    chapterId: 'differentiation',
    sceneId: 'lhopital',
  },
  {
    id: 'darboux-theorem',
    term: { ko: '다르부 정리', en: "Darboux's theorem" },
    definition: {
      ko: String.raw`도함수는 불연속이어도 중간값 성질을 갖는다 — \(f'(a) < c < f'(b)\)이면 \(\xi \in (a,b)\)가 있어 \(f'(\xi) = c\).`,
      en: String.raw`A derivative has the intermediate value property even when discontinuous — if \(f'(a) < c < f'(b)\) then some \(\xi \in (a,b)\) has \(f'(\xi) = c\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'darboux',
  },
  {
    id: 'darboux-property',
    term: { ko: '다르부 성질', en: 'Darboux property' },
    definition: {
      ko: String.raw`연속이 아니어도 중간값 성질을 갖는 성질. 도함수들의 전형적인 예이다.`,
      en: String.raw`The intermediate value property without continuity — derivatives are the canonical examples.`,
    },
    chapterId: 'differentiation',
    sceneId: 'darboux',
  },
  {
    id: 'fermat-lemma',
    term: { ko: '페르마 내부 극값 보조정리', en: "Fermat's interior-extremum lemma" },
    definition: {
      ko: String.raw`내부 점 \(c\)에서 극대·극소를 갖고 미분가능하면 \(f'(c) = 0\). 다르부 정리의 증명에 쓰인다.`,
      en: String.raw`An interior local max/min where \(f\) is differentiable forces \(f'(c) = 0\). Used to prove Darboux's theorem.`,
    },
    chapterId: 'differentiation',
    sceneId: 'darboux',
  },
  {
    id: 'heaviside-step',
    term: { ko: '헤비사이드 계단함수', en: 'Heaviside step function' },
    definition: {
      ko: String.raw`\(x < 0\)에서 0, \(x \ge 0\)에서 1인 함수. 점프 불연속이라 어떤 함수의 도함수도 될 수 없다.`,
      en: String.raw`0 for \(x < 0\), 1 for \(x \ge 0\). Its jump discontinuity means it can never be anyone's derivative.`,
    },
    chapterId: 'differentiation',
    sceneId: 'darboux',
  },
  {
    id: 'jump-discontinuity',
    term: { ko: '점프 불연속', en: 'jump discontinuity' },
    definition: {
      ko: String.raw`좌극한과 우극한이 모두 존재하지만 서로 다른 불연속. 도함수에서는 불가능하다.`,
      en: String.raw`Left and right limits both exist but differ. Impossible in a derivative.`,
    },
    chapterId: 'differentiation',
    sceneId: 'darboux',
  },
  {
    id: 'weierstrass-function',
    term: { ko: '바이어슈트라스 함수', en: 'Weierstrass function' },
    definition: {
      ko: String.raw`모든 점에서 연속이지만 어느 점에서도 미분 불가능한 함수 — \(\sum a^n\cos(b^n\pi x)\). 매끄러운 함수들의 균등극한이 미분가능하지 않을 수 있음을 보여준다.`,
      en: String.raw`Continuous everywhere but differentiable nowhere — \(\sum a^n\cos(b^n\pi x)\). Shows a uniform limit of smooth functions need not be differentiable.`,
    },
    chapterId: 'differentiation',
    sceneId: 'weierstrass-function',
  },
  {
    id: 'taylor-series',
    term: { ko: '테일러 급수', en: 'Taylor series' },
    definition: {
      ko: String.raw`함수를 \(x=a\)에서의 도함수들로 만든 멱급수.`,
      en: String.raw`The power series built from a function's derivatives at \(x=a\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'taylor',
  },
  {
    id: 'taylor-theorem',
    term: { ko: '테일러 정리', en: "Taylor's theorem" },
    definition: {
      ko: String.raw`테일러 다항식과 나머지항 \(R_n\)의 정확한 형태를 주는 정리.`,
      en: String.raw`The theorem giving the Taylor polynomial together with the exact form of the remainder \(R_n\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'taylor-thm',
  },
  {
    id: 'convex-function',
    term: { ko: '볼록함수', en: 'convex function' },
    definition: {
      ko: String.raw`현이 그래프 위에 뜨는 함수. \(f(tx+(1-t)y) \le tf(x)+(1-t)f(y)\).`,
      en: String.raw`A function whose chords lie above its graph: \(f(tx+(1-t)y) \le tf(x)+(1-t)f(y)\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'convex',
  },
  {
    id: 'jensen-inequality',
    term: { ko: '옌센 부등식', en: "Jensen's inequality" },
    definition: {
      ko: String.raw`볼록함수에 대한 "\(f\)의 평균 \(\ge\) 평균의 \(f\)".`,
      en: String.raw`For convex \(f\): \(f\) of the average \(\le\) the average of \(f\).`,
    },
    chapterId: 'differentiation',
    sceneId: 'convex',
  },
  {
    id: 'newton-method',
    term: { ko: '뉴턴 방법', en: "Newton's method" },
    definition: {
      ko: String.raw`\(x_{n+1} = x_n - f(x_n)/f'(x_n)\)으로 근을 찾는 반복법.`,
      en: String.raw`The iteration \(x_{n+1} = x_n - f(x_n)/f'(x_n)\) for finding roots.`,
    },
    chapterId: 'differentiation',
    sceneId: 'newton',
  },
  {
    id: 'banach-fixed-point',
    term: { ko: '바나흐 고정점 정리', en: 'Banach fixed-point theorem' },
    definition: {
      ko: String.raw`완비 거리공간 위의 수축사상은 유일한 고정점을 갖는다.`,
      en: `A contraction on a complete metric space has a unique fixed point.`,
    },
    chapterId: 'differentiation',
    sceneId: 'banach',
  },
  {
    id: 'contraction',
    term: { ko: '수축사상', en: 'contraction mapping' },
    definition: {
      ko: String.raw`거리를 일정 비율(1 미만) 이하로 줄이는 사상.`,
      en: `A map that shrinks distances by a fixed ratio below 1.`,
    },
    chapterId: 'differentiation',
    sceneId: 'banach',
  },
  // ---------------------------------------------------------------- integration
  {
    id: 'gamma-function',
    term: { ko: '감마함수', en: 'gamma function' },
    definition: {
      ko: String.raw`\(\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt\). 팩토리얼을 실수로 확장한다(\(\Gamma(n+1) = n!\)).`,
      en: String.raw`\(\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt\); the continuous extension of the factorial (\(\Gamma(n+1) = n!\)).`,
    },
    chapterId: 'integration',
    sceneId: 'gamma',
  },
  {
    id: 'beta-function',
    term: { ko: '베타 함수', en: 'beta function' },
    definition: {
      ko: String.raw`\(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) \((p, q > 0)\). \(B(p,q) = \Gamma(p)\Gamma(q)/\Gamma(p+q)\)로 감마함수와 이어진다.`,
      en: String.raw`\(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) \((p, q > 0)\). Linked to the gamma function by \(B(p,q) = \Gamma(p)\Gamma(q)/\Gamma(p+q)\).`,
    },
    chapterId: 'integration',
    sceneId: 'beta-function',
  },
  {
    id: 'log-convex',
    term: { ko: '로그볼록', en: 'log-convex' },
    definition: {
      ko: String.raw`\(\ln f\)가 볼록함수인 성질. \(f(1) = 1\), \(f(x+1) = x\,f(x)\)와 함께 \(\Gamma\)를 유일하게 특정한다 (Bohr–Mollerup 정리).`,
      en: String.raw`The property that \(\ln f\) is convex. Together with \(f(1) = 1\) and \(f(x+1) = x\,f(x)\), it characterizes \(\Gamma\) uniquely (Bohr–Mollerup theorem).`,
    },
    chapterId: 'integration',
    sceneId: 'bohr-mollerup',
  },
  {
    id: 'improper-integral',
    term: { ko: '이상적분', en: 'improper integral' },
    definition: {
      ko: String.raw`무한 구간이나 무한대 함숫값에 대한 적분을 극한으로 정의한 것.`,
      en: `An integral over an unbounded interval or of an unbounded function, defined as a limit.`,
    },
    chapterId: 'integration',
    sceneId: 'improper',
  },
  {
    id: 'riemann-integral',
    term: { ko: '리만 적분', en: 'Riemann integral' },
    definition: {
      ko: String.raw`구간을 잘게 나누어 만든 리만 합의 극한.`,
      en: `The limit of Riemann sums over finer and finer partitions.`,
    },
    chapterId: 'integration',
    sceneId: 'riemann',
  },
  {
    id: 'partition',
    term: { ko: '분할', en: 'partition' },
    definition: {
      ko: String.raw`구간을 나눈 점들의 집합.`,
      en: `The set of cut points dividing an interval.`,
    },
    chapterId: 'integration',
    sceneId: 'riemann',
  },
  {
    id: 'volterra-function',
    term: { ko: 'Volterra 함수', en: 'Volterra function' },
    definition: {
      ko: String.raw`어디서나 미분가능하고 도함수가 유계이지만, 그 도함수는 리만 적분 불가능한 함수 — 팻 칸토어 집합 위에 \((x-a)^2(b-x)^2\sin\frac{1}{x-a}\)형 혹들을 쌓아 만든다.`,
      en: String.raw`Differentiable everywhere with a bounded derivative, yet the derivative is not Riemann integrable — built by stacking \((x-a)^2(b-x)^2\sin\frac{1}{x-a}\)-type bumps over a fat Cantor set.`,
    },
    chapterId: 'integration',
    sceneId: 'volterra-function',
  },
  {
    id: 'ftc',
    term: { ko: '미적분학의 기본정리', en: 'fundamental theorem of calculus' },
    definition: {
      ko: String.raw`미분과 적분은 서로 역연산이다.`,
      en: `Differentiation and integration are inverse operations.`,
    },
    chapterId: 'integration',
    sceneId: 'ftc',
  },
  {
    id: 'integration-by-parts',
    term: { ko: '부분적분', en: 'integration by parts' },
    definition: {
      ko: String.raw`\(\int u\,dv = [uv] - \int v\,du\). 곱의 미분법칙을 적분한 것이다.`,
      en: String.raw`\(\int u\,dv = [uv] - \int v\,du\): the product rule, integrated.`,
    },
    chapterId: 'integration',
    sceneId: 'integration-by-parts',
  },
  {
    id: 'change-of-variables',
    term: { ko: '치환적분', en: 'change of variables' },
    definition: {
      ko: String.raw`\(u = \varphi(x)\)로 두면 \(\int_a^b f(\varphi)\varphi' = \int_{\varphi(a)}^{\varphi(b)} f\). 적분 구간이 치환을 따라간다.`,
      en: String.raw`With \(u = \varphi(x)\), \(\int_a^b f(\varphi)\varphi' = \int_{\varphi(a)}^{\varphi(b)} f\): the limits follow the substitution.`,
    },
    chapterId: 'integration',
    sceneId: 'change-of-variables',
  },
  {
    id: 'bounded-variation',
    term: { ko: '유계변동', en: 'bounded variation' },
    definition: {
      ko: String.raw`분할을 잘게 쪼개도 \(\sum \lvert f(x_i) - f(x_{i-1})\rvert\)이 유한한 상한 안에 머무르는 성질. 단조함수는 모두 유계변동이다.`,
      en: String.raw`The sum \(\sum \lvert f(x_i) - f(x_{i-1})\rvert\) stays under a finite ceiling as partitions refine. Every monotone function has bounded variation.`,
    },
    chapterId: 'integration',
    sceneId: 'bounded-variation',
  },
  {
    id: 'jordan-decomposition',
    term: { ko: '조르당 분해', en: 'Jordan decomposition' },
    definition: {
      ko: String.raw`유계변동 함수는 두 증가함수의 차로 쓸 수 있다: \(f = g - h\).`,
      en: String.raw`A function of bounded variation is the difference of two increasing functions: \(f = g - h\).`,
    },
    chapterId: 'integration',
    sceneId: 'bounded-variation',
  },
  {
    id: 'jordan-decomposition-theorem',
    term: { ko: '조르당 분해', en: 'Jordan decomposition' },
    definition: {
      ko: String.raw`유계변동 함수 \(f\)를 두 단조증가 함수 \(g, h\)의 차 \(f = g - h\)로 쓰는 것 — \(g(x) = V_a^x(f)\) (변동함수), \(h = g - f\)로 두면 항상 성립한다.`,
      en: String.raw`Writing a BV function \(f\) as the difference \(f = g - h\) of two increasing functions \(g, h\) — always possible with \(g(x) = V_a^x(f)\) (the variation function) and \(h = g - f\).`,
    },
    chapterId: 'integration',
    sceneId: 'jordan-decomposition',
  },
  {
    id: 'variation-function',
    term: { ko: '변동함수', en: 'variation function' },
    definition: {
      ko: String.raw`\(g(x) = V_a^x(f)\): 구간 \([a, x]\)에서의 전변동. \(f\)가 유계변동이면 \(g\)는 단조증가이며, \(h = g - f\)도 단조증가여서 조르당 분해 \(f = g - h\)가 성립한다.`,
      en: String.raw`\(g(x) = V_a^x(f)\): the total variation of \(f\) over \([a, x]\). For a BV \(f\) it is increasing, and \(h = g - f\) is increasing too — giving the Jordan decomposition \(f = g - h\).`,
    },
    chapterId: 'integration',
    sceneId: 'jordan-decomposition',
  },
  {
    id: 'lebesgue-measure',
    term: { ko: '르베그 측도', en: 'Lebesgue measure' },
    definition: {
      ko: String.raw`길이·넓이·부피를 집합에 확장한 것.`,
      en: `The extension of length, area, and volume to sets.`,
    },
    chapterId: 'integration',
    sceneId: 'measure',
  },
  {
    id: 'measure-zero',
    term: { ko: '측도 0', en: 'measure zero' },
    definition: {
      ko: String.raw`전체 길이를 임의로 작게 잡은 구간들로 덮을 수 있는 집합.`,
      en: `A set coverable by intervals of arbitrarily small total length.`,
    },
    chapterId: 'integration',
    sceneId: 'measure',
  },
  {
    id: 'lebesgue-integral',
    term: { ko: '르베그 적분', en: 'Lebesgue integral' },
    definition: {
      ko: String.raw`함숫값 기준으로 나누어 적분하는 방식. 리만 적분보다 넓은 함수에 적용된다.`,
      en: `Integration by slicing the range of values; applies to a wider class of functions than the Riemann integral.`,
    },
    chapterId: 'integration',
    sceneId: 'lebesgue',
  },
  {
    id: 'absolute-continuity',
    term: { ko: '절대연속성', en: 'absolute continuity' },
    definition: {
      ko: String.raw`\(\varepsilon > 0\)마다 \(\sum (b_i - a_i) < \delta\)이면 \(\sum |F(b_i) - F(a_i)| < \varepsilon\)가 되는 \(\delta > 0\)이 존재하는 성질 — 균등연속의 "절대적" 강화. 정확히 \(L^1\) 함수의 부정적분들이다.`,
      en: String.raw`The property that for every \(\varepsilon > 0\) there is \(\delta > 0\) with \(\sum |F(b_i) - F(a_i)| < \varepsilon\) whenever \(\sum (b_i - a_i) < \delta\) — the "absolute" strengthening of uniform continuity. Exactly the indefinite integrals of \(L^1\) functions.`,
    },
    chapterId: 'integration',
    sceneId: 'absolute-continuity',
  },
  {
    id: 'sqrt2-irrational',
    term: { ko: '√2의 무리수성', en: 'irrationality of √2' },
    definition: {
      ko: String.raw`어떤 유리수 \(p/q\)도 \((p/q)^2 = 2\)를 만족하지 않는다 — 기약분수 무한하강법으로 증명되며, 유리수 직선의 "구멍"을 보여준다.`,
      en: String.raw`No rational \(p/q\) satisfies \((p/q)^2 = 2\) — proved by infinite descent on lowest terms, exposing a "hole" in the rational line.`,
    },
    chapterId: 'numbers',
    sceneId: 'sqrt2-irrational',
  },
  {
    id: 'density-of-rationals',
    term: { ko: '유리수의 조밀성', en: 'density of the rationals' },
    definition: {
      ko: String.raw`임의의 실수 \(x < y\) 사이에 유리수가 존재한다 — \(n > 1/(y-x)\)를 잡고 \(m = \lfloor nx \rfloor + 1\)이라 두면 \(x < m/n < y\).`,
      en: String.raw`Between any reals \(x < y\) lies a rational — take \(n > 1/(y-x)\) and \(m = \lfloor nx \rfloor + 1\), then \(x < m/n < y\).`,
    },
    chapterId: 'numbers',
    sceneId: 'density-of-rationals',
  },
  {
    id: 'standard-limits',
    term: { ko: '표준 극한', en: 'standard limits' },
    definition: {
      ko: String.raw`\(|x| < 1\)이면 \(x^n \to 0\), \(x > 1\)이면 \(x^{1/n} \to 1\) — 거듭제곱과 거듭제곱근의 기본 운명.`,
      en: String.raw`If \(|x| < 1\) then \(x^n \to 0\); if \(x > 1\) then \(x^{1/n} \to 1\) — the basic fates of powers and roots.`,
    },
    chapterId: 'sequences',
    sceneId: 'standard-limits',
  },
  {
    id: 'continuity-equivalences',
    term: { ko: '연속성의 동치 조건', en: 'equivalent formulations of continuity' },
    definition: {
      ko: String.raw`\(\varepsilon\)-\(\delta\) 정의, 수열 보존, 열린집합의 역상이 열림 — 세 가지는 같은 연속성을 다른 렌즈로 본 것이다.`,
      en: String.raw`The \(\varepsilon\)-\(\delta\) definition, sequential preservation, and open preimages of open sets — three lenses on the same continuity.`,
    },
    chapterId: 'continuity',
    sceneId: 'continuity-equivalences',
  },
  {
    id: 'derivative-monotonicity',
    term: { ko: '도함수와 단조성', en: 'derivative and monotonicity' },
    definition: {
      ko: String.raw`\(f' \ge 0\)이면 \(f\)는 증가, \(f' > 0\)이면 엄격히 증가 (평균값 정리) — 도함수의 부호가 함수의 오르내림을 결정한다.`,
      en: String.raw`\(f' \ge 0\) makes \(f\) increasing, \(f' > 0\) strictly increasing (by MVT) — the sign of the derivative decides rise and fall.`,
    },
    chapterId: 'differentiation',
    sceneId: 'derivative-monotonicity',
  },
  {
    id: 'dirichlet-function',
    term: { ko: '디리클레 함수', en: 'Dirichlet function' },
    definition: {
      ko: String.raw`유리수에서 1, 무리수에서 0인 함수 — 모든 상합은 1, 모든 하합은 0이라 리만 적분 불가능하다.`,
      en: String.raw`1 on rationals, 0 on irrationals — every upper sum is 1 and every lower sum 0, so it is not Riemann integrable.`,
    },
    chapterId: 'integration',
    sceneId: 'dirichlet-function',
  },
  {
    id: 'riemann-stieltjes',
    term: { ko: '리만-스틸체스 적분', en: 'Riemann–Stieltjes integral' },
    definition: {
      ko: String.raw`\(\int_a^b f\,d\alpha = \lim \sum f(\xi_i)\,\Delta\alpha_i\) — \(\alpha(x) = x\)이면 리만 적분으로 돌아오고, 점프가 있으면 그 점의 함숫값이 적분을 지배한다.`,
      en: String.raw`\(\int_a^b f\,d\alpha = \lim \sum f(\xi_i)\,\Delta\alpha_i\) — reduces to the Riemann integral for \(\alpha(x) = x\); a jump lets one point's value dominate.`,
    },
    chapterId: 'integration',
    sceneId: 'riemann-stieltjes',
  },
  {
    id: 'lebesgue-convergence',
    term: { ko: '르벡 수렴 정리', en: 'Lebesgue convergence theorems' },
    definition: {
      ko: String.raw`단조수렴·파투·지배수렴 — \(\int \lim f_n = \lim \int f_n\)이 성립하는 세 조건. 질량이 도망가면 깨진다.`,
      en: String.raw`Monotone convergence, Fatou, dominated convergence — three conditions for \(\int \lim f_n = \lim \int f_n\). Escaping mass breaks them.`,
    },
    chapterId: 'integration',
    sceneId: 'lebesgue-convergence',
  },
  {
    id: 'fubini-tonelli',
    term: { ko: '푸비니-토넬리 정리', en: 'Fubini–Tonelli theorem' },
    definition: {
      ko: String.raw`음이 아닌 함수(Tonelli)나 적분 가능한 함수(Fubini)는 중적분을 어떤 순서로 계산해도 같다.`,
      en: String.raw`For nonnegative (Tonelli) or integrable (Fubini) functions, iterated integrals agree in either order.`,
    },
    chapterId: 'integration',
    sceneId: 'fubini-tonelli',
  },
  {
    id: 'egorov',
    term: { ko: '에고로프 정리', en: "Egorov's theorem" },
    definition: {
      ko: String.raw`유한 측도에서 a.e. 수렴하면, 측도가 작은 집합을 덜어낸 나머지에선 균등수렴한다.`,
      en: String.raw`On finite measure, a.e. convergence is uniform after removing a set of arbitrarily small measure.`,
    },
    chapterId: 'integration',
    sceneId: 'egorov',
  },
  {
    id: 'borel-cantelli',
    term: { ko: '보렐-칸텔리 보조정리', en: 'Borel–Cantelli lemmas' },
    definition: {
      ko: String.raw`\(\sum m(E_n) < \infty\)이면 무한히 자주 일어나는 점들의 측도는 0. 독립이면 역도 성립.`,
      en: String.raw`If \(\sum m(E_n) < \infty\), the limsup set has measure 0; with independence the converse holds.`,
    },
    chapterId: 'integration',
    sceneId: 'borel-cantelli',
  },
  {
    id: 'riemann-lebesgue',
    term: { ko: '리만-르벡 보조정리', en: 'Riemann–Lebesgue lemma' },
    definition: {
      ko: String.raw`적분 가능한 함수의 푸리에 계수는 0으로 수렴한다 — 빠른 진동이 모든 굴곡을 평균내어 지운다.`,
      en: String.raw`Fourier coefficients of an integrable function tend to 0 — rapid oscillation averages every bump away.`,
    },
    chapterId: 'function-series',
    sceneId: 'riemann-lebesgue',
  },
  {
    id: 'parseval',
    term: { ko: '파르세발 항등식', en: "Parseval's identity" },
    definition: {
      ko: String.raw`\(\frac1\pi\int |f|^2 = \frac{a_0^2}{2} + \sum(a_n^2+b_n^2)\) — 에너지 보존.`,
      en: String.raw`\(\frac1\pi\int |f|^2 = \frac{a_0^2}{2} + \sum(a_n^2+b_n^2)\) — conservation of energy.`,
    },
    chapterId: 'function-series',
    sceneId: 'parseval',
  },
  {
    id: 'holder',
    term: { ko: '횔더 부등식', en: "Hölder's inequality" },
    definition: {
      ko: String.raw`\(\sum|a_kb_k| \le \|a\|_p\|b\|_q\) (\(\frac1p+\frac1q=1\)) — 코시-슈바르츠는 \(p=q=2\).`,
      en: String.raw`\(\sum|a_kb_k| \le \|a\|_p\|b\|_q\) (\(\frac1p+\frac1q=1\)) — Cauchy–Schwarz is \(p=q=2\).`,
    },
    chapterId: 'sequences',
    sceneId: 'holder',
  },
  {
    id: 'thomae-function',
    term: { ko: '토매 함수', en: "Thomae's function" },
    definition: {
      ko: String.raw`\(f(p/q) = 1/q\) (기약분수), \(f(x) = 0\) (무리수) — 모든 무리수에서 연속, 모든 유리수에서 불연속인 팝콘 함수.`,
      en: String.raw`\(f(p/q) = 1/q\) (reduced), \(f(x) = 0\) (irrational) — the popcorn function, continuous at every irrational and discontinuous at every rational.`,
    },
    chapterId: 'continuity',
    sceneId: 'thomae',
  },
  {
    id: 'discontinuous-derivative',
    term: { ko: '불연속인 도함수', en: 'discontinuous derivative' },
    definition: {
      ko: String.raw`\(x^2\sin(1/x)\)는 모든 점에서 미분가능하지만 도함수는 \(0\)에서 불연속 — 미분가능 ⟹ 도함수 연속은 거짓.`,
      en: String.raw`\(x^2\sin(1/x)\) is differentiable everywhere, yet its derivative is discontinuous at \(0\) — differentiable does not imply continuously differentiable.`,
    },
    chapterId: 'differentiation',
    sceneId: 'discontinuous-derivative',
  },
  {
    id: 'gabriel-horn',
    term: { ko: '가브리엘의 나팔', en: "Gabriel's horn" },
    definition: {
      ko: String.raw`\(y = 1/x\) (\(x \ge 1\))의 회전체 — 부피 \(\pi\)는 유한, 겉넓이는 무한대. 화가의 역설.`,
      en: String.raw`The solid of revolution of \(y = 1/x\) (\(x \ge 1\)) — finite volume \(\pi\), infinite surface area. The painter's paradox.`,
    },
    chapterId: 'integration',
    sceneId: 'gabriel-horn',
  },
  {
    id: 'vitali-set',
    term: { ko: '비탈리 집합', en: 'Vitali set' },
    definition: {
      ko: String.raw`선택공리로 \(\mathbb{R}/\mathbb{Q}\)에서 뽑은 대표원들의 집합 — 르벡 측도를 잴 수 없다.`,
      en: String.raw`A choice-set of representatives of \(\mathbb{R}/\mathbb{Q}\) via the axiom of choice — not Lebesgue measurable.`,
    },
    chapterId: 'integration',
    sceneId: 'vitali',
  },
  {
    id: 'differentiation-under-integral',
    term: { ko: '적분기호 아래에서의 미분', en: 'differentiation under the integral sign' },
    definition: {
      ko: String.raw`\(\frac{d}{dx}\int_a^b f(x,t)\,dt = \int_a^b \frac{\partial f}{\partial x}(x,t)\,dt\) — \(\frac{\partial f}{\partial x}\)가 연속이면 성립한다. 라이프니츠 규칙이라고도 한다.`,
      en: String.raw`\(\frac{d}{dx}\int_a^b f(x,t)\,dt = \int_a^b \frac{\partial f}{\partial x}(x,t)\,dt\) — holds when \(\frac{\partial f}{\partial x}\) is continuous. Also called Leibniz's rule.`,
    },
    chapterId: 'integration',
    sceneId: 'differentiation-under-integral',
  },
  {
    id: 'minkowski-inequality',
    term: { ko: '민코프스키 부등식', en: "Minkowski's inequality" },
    definition: {
      ko: String.raw`\(L^p\) 삼각부등식 \(\|f+g\|_p \le \|f\|_p + \|g\|_p\) (\(p \ge 1\)) — 횔더 부등식으로부터 유도된다.`,
      en: String.raw`The \(L^p\) triangle inequality \(\|f+g\|_p \le \|f\|_p + \|g\|_p\) (\(p \ge 1\)) — derived from Hölder's inequality.`,
    },
    chapterId: 'integration',
    sceneId: 'minkowski',
  },
  {
    id: 'connected-set',
    term: { ko: '연결집합', en: 'connected set' },
    definition: {
      ko: String.raw`서로소인 두 비어 있지 않은 열린집합으로 갈라지지 않는 집합. \([0,1]\)이 대표적이고, \(\mathbb{Q}\)는 전혀 해당하지 않는다.`,
      en: String.raw`A set that cannot be split into two disjoint nonempty open sets. \([0,1]\) is the prototype; \(\mathbb{Q}\) fails completely.`,
    },
    chapterId: 'topology',
    sceneId: 'connected',
  },
  {
    id: 'separation',
    term: { ko: '분리', en: 'separation' },
    definition: {
      ko: String.raw`\(X = U \cup V\) 형태의 분해 — \(U, V\)가 \(X\)에서 열려 있고 서로소이며 둘 다 비어 있지 않은 것. 분리가 존재하면 \(X\)는 연결집합이 아니다.`,
      en: String.raw`A decomposition \(X = U \cup V\) with \(U, V\) open in \(X\), disjoint, and both nonempty. If a separation exists, \(X\) is disconnected.`,
    },
    chapterId: 'topology',
    sceneId: 'connected',
  },
  {
    id: 'totally-disconnected',
    term: { ko: '완전 비연결', en: 'totally disconnected' },
    definition: {
      ko: String.raw`두 점 이상을 가진 부분집합이 모두 연결이 아닌 공간 — 연결인 부분집합은 한 점 집합과 \(\emptyset\)뿐이다. \(\mathbb{Q}\)가 대표적이다: 두 유리수 사이에는 늘 무리수 절단이 들어간다.`,
      en: String.raw`A space in which every subset with at least two points is disconnected — the only connected subsets are singletons and \(\emptyset\). \(\mathbb{Q}\) is the classic example: an irrational cut always slips between two rationals.`,
    },
    chapterId: 'topology',
    sceneId: 'connected',
  },
  {
    id: 'complex-number',
    term: { ko: '복소수', en: 'complex number' },
    definition: {
      ko: String.raw`\(z = a + bi\) (\(a, b \in \mathbb{R}\), \(i^2 = -1\)) 꼴의 수 — 평면 위의 점 \((a, b)\)와 같은 대상이다.`,
      en: String.raw`A number of the form \(z = a + bi\) with \(a, b \in \mathbb{R}\) and \(i^2 = -1\) — the same object as the plane point \((a, b)\).`,
    },
    chapterId: 'numbers',
    sceneId: 'complex-numbers',
  },
  {
    id: 'modulus',
    term: { ko: '절댓값', en: 'modulus' },
    definition: {
      ko: String.raw`복소수 \(z = a + bi\)의 절댓값 \(|z| = \sqrt{a^2 + b^2}\) — 원점에서 점 \(z\)까지의 거리이며, 삼각부등식 \(|z + w| \le |z| + |w|\)를 만족한다.`,
      en: String.raw`The modulus \(|z| = \sqrt{a^2 + b^2}\) of \(z = a + bi\) — the distance from the origin to the point \(z\), satisfying the triangle inequality \(|z + w| \le |z| + |w|\).`,
    },
    chapterId: 'numbers',
    sceneId: 'complex-numbers',
  },
  {
    id: 'conjugate',
    term: { ko: '켤레복소수', en: 'conjugate' },
    definition: {
      ko: String.raw`\(z = a + bi\)의 켤레는 \(\bar{z} = a - bi\) — 실수축에 대한 대칭이며, \(z\bar{z} = |z|^2\)를 만족한다.`,
      en: String.raw`The conjugate of \(z = a + bi\) is \(\bar{z} = a - bi\) — reflection across the real axis, satisfying \(z\bar{z} = |z|^2\).`,
    },
    chapterId: 'numbers',
    sceneId: 'complex-numbers',
  },
  {
    id: 'parallelogram-law',
    term: { ko: '평행사변형 법칙', en: 'parallelogram law' },
    definition: {
      ko: String.raw`\(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\) — 내적에서 온 노름이 항상 만족하는 항등식. 노름이 이를 어기면 어떤 내적에서도 유도될 수 없다.`,
      en: String.raw`\(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\) — the identity every inner-product norm satisfies. A norm that violates it is induced by no inner product.`,
    },
    chapterId: 'sequences',
    sceneId: 'parallelogram-law',
  },
  {
    id: 'polarization-identity',
    term: { ko: '극화 항등식', en: 'polarization identity' },
    definition: {
      ko: String.raw`실수 경우 \(\langle x, y \rangle = \frac{\|x+y\|^2 - \|x-y\|^2}{4}\) — 노름만으로 내적을 되읽는 식. 내적은 노름으로 완전히 결정된다.`,
      en: String.raw`In the real case, \(\langle x, y \rangle = \frac{\|x+y\|^2 - \|x-y\|^2}{4}\) — the formula that reads the inner product back off the norm alone. The norm completely determines the inner product.`,
    },
    chapterId: 'sequences',
    sceneId: 'parallelogram-law',
  },
  {
    id: 'jordan-von-neumann-theorem',
    term: { ko: '요르단-폰 노이만 정리', en: 'Jordan–von Neumann theorem' },
    definition: {
      ko: String.raw`노름이 평행사변형 법칙을 만족할 때, 그리고 그때만 그 노름은 극화 항등식으로 주어지는 내적에서 유도된다는 정리.`,
      en: String.raw`The theorem that a norm is induced by an inner product — the one given by the polarization identity — if and only if it satisfies the parallelogram law.`,
    },
    chapterId: 'sequences',
    sceneId: 'parallelogram-law',
  },
  {
    id: 'rectifiable-curve',
    term: { ko: '길이를 잴 수 있는 곡선', en: 'rectifiable curve' },
    definition: {
      ko: String.raw`꺾은선 길이들의 상한 \(\sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\)이 유한한 곡선 — 그 상한이 바로 곡선의 길이이다. 연속이기만 해서는 부족하다: \(x\sin(1/x)\)의 그래프는 길이가 무한하다.`,
      en: String.raw`A curve whose polygonal lengths have a finite supremum, \(\sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\) — that supremum is its length. Continuity alone is not enough: the graph of \(x\sin(1/x)\) has infinite length.`,
    },
    chapterId: 'integration',
    sceneId: 'arc-length',
  },
  {
    id: 'arc-length',
    term: { ko: '곡선의 길이', en: 'arc length' },
    definition: {
      ko: String.raw`곡선 \(\gamma\)의 길이 \(L = \sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\). \(\gamma\)가 \(C^1\)이면 \(L = \int_a^b |\gamma'(t)|\,dt\)와 같다.`,
      en: String.raw`The length \(L = \sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\) of a curve \(\gamma\). When \(\gamma\) is \(C^1\), this equals \(L = \int_a^b |\gamma'(t)|\,dt\).`,
    },
    chapterId: 'integration',
    sceneId: 'arc-length',
  },
  {
    id: 'polygonal-approximation',
    term: { ko: '꺾은선 근사', en: 'polygonal approximation' },
    definition: {
      ko: String.raw`분할점에서의 곡선 값들을 곧은 선분으로 이은 꺾은선과 그 길이 \(L(P) = \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\) — 분할을 세분화하면 삼각부등식에 의해 길이가 줄어들지 않는다.`,
      en: String.raw`The broken line joining the curve's values at partition points, and its length \(L(P) = \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\) — refinement never shortens it, by the triangle inequality.`,
    },
    chapterId: 'integration',
    sceneId: 'arc-length',
  },
  {
    id: 'convolution',
    term: { ko: '합성곱', en: 'convolution' },
    definition: {
      ko: String.raw`\((f * g)(x) = \int f(t)\, g(x - t)\, dt\) — 한 함수를 뒤집어 밀면서 다른 함수와의 겹침을 가중 평균한 것으로, 교환법칙을 만족한다.`,
      en: String.raw`\((f * g)(x) = \int f(t)\, g(x - t)\, dt\) — flip one function, slide it, and take the weighted overlap with the other; the operation commutes.`,
    },
    chapterId: 'integration',
    sceneId: 'convolution',
  },
  {
    id: 'approximate-identity',
    term: { ko: '근사 항등원', en: 'approximate identity' },
    definition: {
      ko: String.raw`질량이 \(1\)이고 원점 근처에 몰린 핵들의 족 \(\varphi_{\varepsilon}\) — 연속점에서 \((f * \varphi_{\varepsilon})(x) \to f(x)\)가 되므로, 합성곱이 항등 연산에 가까워진다.`,
      en: String.raw`A family \(\varphi_{\varepsilon}\) of kernels of mass \(1\) concentrating near the origin — \((f * \varphi_{\varepsilon})(x) \to f(x)\) at continuity points, so convolution approaches the identity operation.`,
    },
    chapterId: 'integration',
    sceneId: 'convolution',
  },
  {
    id: 'support',
    term: { ko: '지지집합', en: 'support' },
    definition: {
      ko: String.raw`함수 \(f\)의 지지집합 \(\operatorname{supp} f\)는 \(\{x : f(x) \ne 0\}\)의 폐포 — \(f\)가 \(0\)이 아닌 영역을 닫힌 집합으로 만든 것이다.`,
      en: String.raw`The support \(\operatorname{supp} f\) of a function \(f\) is the closure of \(\{x : f(x) \ne 0\}\) — the region where \(f\) is nonzero, closed up.`,
    },
    chapterId: 'integration',
    sceneId: 'convolution',
  },
];
