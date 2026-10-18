import type { ChapterMeta } from '../../contracts.ts';
import { problems as binomialProblems } from '../limits/problems/binomial';
import { problems as countableProblems } from '../limits/problems/countable';
import { problems as dimensionRankProblems } from '../limits/problems/dimension-rank';
import { problems as groupsFieldsProblems } from '../limits/problems/groups-fields';
import { problems as integersRationalsProblems } from '../limits/problems/integers-rationals';
import { problems as naturalNumbersProblems } from '../limits/problems/natural-numbers';
import { problems as setsProblems } from '../limits/problems/sets';
import { problems as supremumProblems } from '../limits/problems/supremum';
import { problems as vectorSpacesProblems } from '../limits/problems/vector-spaces';

/**
 * Pure data. Imports types plus per-scene problems data modules
 * (../{limits,series,calculus}/problems/* — data only, no code, models, views, or shell). Node build scripts and every chapter's navigation read
 * this file. Every text is stored per language; the shell picks one via the
 * URL language segment. Summaries embed math as inline TeX between \( and \)
 * (see splitInlineMath in contracts.ts).
 *
 * NOTE (10-chapter split): this is a LOGICAL chapter. The scene files
 * (models/, scenes/, problems/) live in the legacy scene stores
 * src/chapters/{limits,series,calculus}/ and are referenced here via
 * relative paths. See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
export const numbers: ChapterMeta = {
  id: 'numbers',
  title: { ko: '수의 체계', en: 'Number Systems' },
  summary: {
    ko: '자연수에서 실수까지 — 수 체계를 공리부터 쌓아 올리고, 셀 수 있는 무한과 셀 수 없는 무한을 구분합니다.',
    en: 'From naturals to reals — building the number systems from axioms, and telling countable infinities from uncountable ones.',
  },
  scenes: [
    {
      id: 'natural-numbers',
      title: { ko: '자연수와 귀납법', en: 'Natural Numbers and Induction' },
      order: 1,
      summary: {
        ko: String.raw`자연수는 페아노 공리에서 출발한다: \(P(1)\)과 \(P(k) \Rightarrow P(k+1)\)이면 모든 자연수 \(n\)에 대해 \(P(n)\)이 성립한다 — 덧셈과 곱셈도 귀납적으로 정의되며, 이 원리 하나로 무한히 많은 명제를 한 번에 증명한다.`,
        en: String.raw`The natural numbers start from the Peano axioms: \(P(1)\) plus \(P(k) \Rightarrow P(k+1)\) yields \(P(n)\) for every natural number \(n\) — addition and multiplication are also defined recursively, and this one principle proves infinitely many statements at once.`,
      },
      tex: [
        String.raw`P(1) \land (P(k) \Rightarrow P(k+1)) \Rightarrow \forall n \in \mathbb{N},\; P(n)`,
        String.raw`\sum_{k=1}^{n} k = \frac{n(n+1)}{2}`,
        String.raw`(1+x)^n \geq 1 + nx \quad (x > -1)`,
        String.raw`2^n > n`,
      ],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '도미노 개수', en: 'Domino count' }, min: 1, max: 10, step: 1, init: 6 },
      ],
      problems: naturalNumbersProblems,
    },
    {
      id: 'binomial',
      title: { ko: '이항정리', en: 'The Binomial Theorem' },
      order: 2,
      summary: {
        ko: String.raw`이항정리 \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\)를 귀납법으로 증명한다 — 파스칼의 항등식 \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\)이 귀납 단계를 이루고, 파스칼 삼각형의 행 \(n\)을 눈으로 확인한다.`,
        en: String.raw`The binomial theorem \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) proved by induction — Pascal's identity \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\) is the inductive step, and row \(n\) of Pascal's triangle is drawn live.`,
      },
      tex: [
        String.raw`(x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k`,
        String.raw`\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}`,
        String.raw`\sum_{k=0}^{n}\binom{n}{k} = 2^n`,
      ],
      prerequisites: ['natural-numbers'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '선택된 행', en: 'Selected row' }, min: 0, max: 8, step: 1, init: 4 },
      ],
      problems: binomialProblems,
    },
    {
      id: 'integers-rationals',
      title: { ko: '정수와 유리수', en: 'Integers and Rationals' },
      order: 3,
      summary: {
        ko: String.raw`정수는 자연수 순서쌍의 동치류 \((a,b)\sim(c,d)\iff a+d=b+c\), 유리수는 정수 순서쌍의 동치류 \((a,b)\sim(c,d)\iff ad=bc\)로 얻어진다. "동치류로 수를 만든다"는 기술은 유리수에서 실수를 만들 때 다시 등장한다.`,
        en: String.raw`Integers arise as equivalence classes of natural pairs with \((a,b)\sim(c,d)\iff a+d=b+c\), and rationals as classes of integer pairs with \((a,b)\sim(c,d)\iff ad=bc\). The "numbers as equivalence classes" trick returns when the reals are built from the rationals.`,
      },
      tex: [
        String.raw`(a,b)\sim(c,d)\iff a+d=b+c`,
        String.raw`(a,b)\sim(c,d)\iff ad=bc`,
        String.raw`p<q \implies p<\frac{p+q}{2}<q`,
        String.raw`\frac{a}{b}\cdot\frac{b}{a}=1`,
      ],
      prerequisites: ['natural-numbers'],
      controls: [
        {
          kind: 'select',
          key: 'set',
          label: { ko: '수 집합', en: 'Number set' },
          options: ['naturals', 'integers', 'rationals'],
          init: 'rationals',
        },
        { kind: 'slider', key: 'denom', label: { ko: '최대 분모', en: 'Max denominator' }, min: 1, max: 8, step: 1, init: 4 },
      ],
      problems: integersRationalsProblems,
    },
    {
      id: 'sets',
      title: { ko: '집합과 함수', en: 'Sets and Functions' },
      order: 4,
      summary: {
        ko: String.raw`집합의 연산 \(A \cup B\), \(A \cap B\), \(A^c\)와 드모르간 법칙, 그리고 단사·전사·전단사를 그림으로 확인합니다.`,
        en: String.raw`See set operations \(A \cup B\), \(A \cap B\), \(A^c\), De Morgan's laws, and injective / surjective / bijective maps as pictures.`,
      },
      tex: [
        String.raw`(A \cup B)^c = A^c \cap B^c`,
        String.raw`f \text{ bijective} \iff \exists g: g \circ f = \mathrm{id}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'op',
          label: { ko: '집합 연산', en: 'Set operation' },
          options: ['union', 'intersection', 'complement', 'difference', 'symdiff'],
          init: 'union',
        },
        {
          kind: 'select',
          key: 'fnmode',
          label: { ko: '함수 모양', en: 'Map shape' },
          options: ['injective', 'surjective', 'bijective', 'neither'],
          init: 'bijective',
        },
      ],
problems: setsProblems,
    },
    {
      id: 'supremum',
      title: { ko: '상한과 완비성', en: 'The Supremum Axiom' },
      order: 5,
      summary: {
        ko: String.raw`위로 유계인 집합은 가장 작은 상한 \(\sup S\)를 갖습니다 — 실수의 빈틈을 메우는 공리, 유리수의 구멍 장면의 짝꿍입니다.`,
        en: String.raw`Every bounded-above set has a least upper bound \(\sup S\) — the axiom filling the gaps in the rationals, twin of the rational-holes scene.`,
      },
      tex: [String.raw`\sup\left\{1-\frac{1}{n}\right\} = 1`, String.raw`S \ne \varnothing \text{ bounded above } \Rightarrow \sup S \text{ exists}`],
      controls: [
        {
          kind: 'select',
          key: 'set',
          label: { ko: '집합', en: 'Set' },
          options: ['one-minus', 'sqrt2'],
          init: 'one-minus',
        },
        {
          kind: 'slider',
          key: 'bound',
          label: { ko: '상한 후보', en: 'Upper-bound candidate' },
          min: 0.5,
          max: 2,
          step: 0.01,
          init: 1.4,
        },
      ],
problems: supremumProblems,
    },
    {
      id: 'countable',
      title: { ko: '가산과 비가산', en: 'Countable vs Uncountable' },
      order: 6,
      summary: {
        ko: String.raw`유리수는 한 줄로 나열할 수 있지만 실수는 그럴 수 없습니다 — 칸토어의 대각선 논법으로 확인합니다.`,
        en: String.raw`The rationals fit into a single list; the reals do not — verified by Cantor's diagonal argument.`,
      },
      tex: [String.raw`\mathbb{Q} = \{q_1, q_2, \dots\}`, String.raw`(0,1) \text{ is uncountable}`],
      controls: [
        {
          kind: 'select',
          key: 'panel',
          label: { ko: '장면', en: 'Panel' },
          options: ['rationals', 'diagonal'],
          init: 'rationals',
        },
        { kind: 'slider', key: 'n', label: { ko: '나열 개수', en: 'Listed count' }, min: 1, max: 64, step: 1, init: 20 },
      ],
problems: countableProblems,
    },
    {
      id: 'groups-fields',
      title: { ko: '군과 체', en: 'Groups vs Fields' },
      order: 7,
      summary: {
        ko: String.raw`군은 되돌릴 수 있는 움직임(결합·항등원·역원), 체는 사칙연산이 되는 세계입니다. 부분군 판정법과 \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\)의 차이를 봅니다.`,
        en: String.raw`A group is reversible moves (associativity, identity, inverses); a field is a world where all four operations work. Includes the subgroup test and \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\).`,
      },
      tex: [
        String.raw`(a+b)+c = a+(b+c),\ \ \exists\,0,\ \ \forall a\,\exists(-a)`,
        String.raw`a(b+c) = ab+ac,\qquad 2\mathbb{Z} \le \mathbb{Z},\ \ \mathbb{Q} \le \mathbb{R}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'table',
          label: { ko: '곱셈표', en: 'Table' },
          options: ['z6', 'z5'],
          init: 'z6',
        },
      ],
problems: groupsFieldsProblems,
    },
    {
      id: 'vector-spaces',
      title: { ko: '벡터공간과 동형', en: 'Vector Spaces and Isomorphism' },
      order: 8,
      summary: {
        ko: String.raw`벡터공간은 체 위의 아벨군에 스칼라곱을 얹은 구조입니다 — \(\mathbb{R}^n\), 수열공간, 연속함수공간은 포장만 다를 뿐 같은 구조입니다. 계수 \((a, b)\)를 움직이면 직선 \(y = a+bx\)와 점 \((a, b)\)가 함께 움직입니다.`,
        en: String.raw`A vector space is an abelian group over a field with scalar multiplication — \(\mathbb{R}^n\), sequence spaces, and spaces of continuous functions are the same structure in different packaging. Move \((a, b)\) and the line \(y = a+bx\) and the point \((a, b)\) move together.`,
      },
      tex: [
        String.raw`(V,+) \text{ abelian over } F,\qquad c(v+w) = cv + cw`,
        String.raw`\Phi: P_2 \to \mathbb{R}^3,\quad a+bx+cx^2 \mapsto (a,b,c)`,
      ],
      prerequisites: ['groups-fields'],
      controls: [
        { kind: 'slider', key: 'a', label: { ko: '계수 a', en: 'Coefficient a' }, min: -2, max: 2, step: 0.1, init: 1 },
        { kind: 'slider', key: 'b', label: { ko: '계수 b', en: 'Coefficient b' }, min: -2, max: 2, step: 0.1, init: 0.5 },
      ],
problems: vectorSpacesProblems,
    },
    {
      id: 'dimension-rank',
      title: { ko: '차원과 랭크', en: 'Dimension and Rank' },
      order: 9,
      summary: {
        ko: String.raw`동형이 "같은 구조"라면, 차원과 랭크는 그 구조의 크기를 재는 자입니다. 격자가 행렬에 눌려 펴지는 모습을 보며 \(\dim\ker T + \mathrm{rank}\,T = \dim V\)를 확인합니다.`,
        en: String.raw`If isomorphism means "same structure", dimension and rank measure its size. Watch the grid get squeezed by a matrix and verify \(\dim\ker T + \mathrm{rank}\,T = \dim V\).`,
      },
      tex: [
        String.raw`\dim\ker T + \mathrm{rank}\,T = \dim V`,
        String.raw`\mathrm{rank}\,A = \dim(\text{column space of } A)`,
      ],
      prerequisites: ['vector-spaces'],
      controls: [
        {
          kind: 'select',
          key: 'preset',
          label: { ko: '행렬', en: 'Matrix' },
          options: ['identity', 'rank1', 'projection', 'zero'],
          init: 'identity',
        },
      ],
problems: dimensionRankProblems,
    },
  ],
};
