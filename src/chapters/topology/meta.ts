import type { ChapterMeta } from '../../contracts.ts';
import { baireCategoryProblems } from '../limits/problems/baire-category';
import { baireOneProblems } from '../limits/problems/baire-1';
import { clopenProblems } from '../limits/problems/clopen';
import { fatCantorProblems } from '../limits/problems/fat-cantor';
import { peanoCurveProblems } from '../limits/problems/peano-curve';
import { topologistSineProblems } from '../limits/problems/topologist-sine';
import { problems as cantorFunctionProblems } from '../limits/problems/cantor-function';
import { problems as cantorProblems } from '../limits/problems/cantor';
import { problems as closureProblems } from '../limits/problems/closure';
import { problems as compactProblems } from '../limits/problems/compact';
import { problems as contractionProblems } from '../limits/problems/contraction';
import { problems as metricSpacesProblems } from '../limits/problems/metric-spaces';
import { problems as opensetsProblems } from '../limits/problems/opensets';

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
export const topology: ChapterMeta = {
  id: 'topology',
  title: { ko: '위상', en: 'Topology' },
  summary: {
    ko: '열린집합·콤팩트·완비성 — 실직선의 위상적 구조와 베어 범주 정리, 칸토어 집합을 다룹니다.',
    en: 'Open sets, compactness, completeness — the topology of the real line, the Baire category theorem, Cantor sets.',
  },
  scenes: [
    {
      id: 'opensets',
      title: { ko: '열린집합과 닫힌집합', en: 'Open and Closed Sets' },
      order: 1,
      summary: {
        ko: String.raw`집합 \(U\)가 열려 있다는 것은 모든 점이 내점이라는 뜻 — 각 점을 \(\varepsilon\)-공으로 감쌀 수 있습니다. 수직선 위에서 점 \(x\)와 \(\varepsilon\)을 움직이며 공이 집합 안에 들어가는지 확인합니다.`,
        en: String.raw`A set \(U\) is open when every point is an interior point — each point can be wrapped in an \(\varepsilon\)-ball. Move the point \(x\) and the radius \(\varepsilon\) on the line and watch whether the ball stays inside.`,
      },
      tex: [
        String.raw`U \text{ open } \iff \forall x \in U\ \exists \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \subseteq U`,
        String.raw`F \text{ closed } \iff F^c \text{ open}`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'select', key: 'set', label: { ko: '집합 S', en: 'Set S' }, options: ['open', 'closed', 'half', 'singleton'], init: 'open' },
        { kind: 'slider', key: 'x', label: { ko: '점 x', en: 'Point x' }, min: -0.3, max: 1.3, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'eps', label: { ko: '반지름 ε', en: 'Radius ε' }, min: 0.05, max: 0.6, step: 0.05, init: 0.2 },
      ],
problems: opensetsProblems,
    },
    {
      id: 'clopen',
      title: { ko: 'Clopen 집합', en: 'Clopen Sets' },
      order: 2,
      summary: {
        ko: String.raw`열려 있으면서 닫혀 있는 집합 — clopen. \(\mathbb{R}\)에서는 \(\varnothing\)과 \(\mathbb{R}\)뿐이지만 (완전 증명), 주변 공간이 바뀌면 같은 집합의 운명이 바뀝니다. \([0,1]\)은 \(\mathbb{R}\)에서는 닫혀 있기만 하지만, \([0,1]\cup[2,3]\) 안에서는 clopen입니다.`,
        en: String.raw`Sets that are both open and closed — clopen. In \(\mathbb{R}\) only \(\varnothing\) and \(\mathbb{R}\) qualify (proved in full), but change the ambient space and the same set's fate changes: \([0,1]\) is merely closed in \(\mathbb{R}\), yet clopen inside \([0,1]\cup[2,3]\).`,
      },
      tex: [
        String.raw`A \text{ clopen in } X \iff A \text{ open in } X \text{ and closed in } X`,
        String.raw`[0,1] = \bigl([0,1]\cup[2,3]\bigr) \cap (-0.5, 1.5) = \bigl([0,1]\cup[2,3]\bigr) \cap [-0.5, 1.5]`,
      ],
      prerequisites: ['opensets'],
      controls: [
        { kind: 'select', key: 'case', label: { ko: '경우', en: 'Case' }, options: ['open-interval', 'closed-interval', 'clopen-pieces', 'clopen-gap'], init: 'clopen-pieces' },
        { kind: 'slider', key: 'x', label: { ko: '탐침 x', en: 'Probe x' }, min: -0.6, max: 3.6, step: 0.01, init: 0.5 },
        { kind: 'slider', key: 'eps', label: { ko: '반지름 ε', en: 'Radius ε' }, min: 0.01, max: 2, step: 0.01, init: 0.2 },
      ],
      problems: clopenProblems,
    },
    {
      id: 'closure',
      title: { ko: '폐포와 유계', en: 'Closure and Boundedness' },
      order: 3,
      summary: {
        ko: String.raw`집합 \(A\) 위에 바를 그으면 폐포 \(\overline{A}\) — 빠져나간 극한점들을 빨아들인 집합입니다. 닫힘 ⟺ 극한점을 다 품음 ⟺ 폐포와 같음, 그리고 닫힘 + 유계 ⟺ 컴팩트(하이네-보렐)의 돌림노래를 확인합니다.`,
        en: String.raw`Drawing a bar over \(A\) gives the closure \(\overline{A}\) — the set with its escaped limit points pulled back in. Follow the round-song: closed ⟺ contains its limit points ⟺ equals its closure, and closed + bounded ⟺ compact (Heine-Borel).`,
      },
      tex: [
        String.raw`x \in \overline{A} \iff \forall \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \cap A \neq \varnothing`,
        String.raw`A \text{ closed } \iff \overline{A} = A, \qquad A \text{ bounded } \iff \exists M : \lvert x\rvert \leq M\ \forall x \in A`,
      ],
      prerequisites: ['opensets'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '집합 A', en: 'Set A' }, options: ['open', 'halfclosed', 'reciprocal'], init: 'open' },
        { kind: 'slider', key: 'm', label: { ko: '경계 M', en: 'Bound M' }, min: 0.5, max: 2.5, step: 0.1, init: 1.5 },
      ],
problems: closureProblems,
    },
    {
      id: 'compact',
      title: { ko: '컴팩트 집합', en: 'Compact Sets' },
      order: 4,
      summary: {
        ko: String.raw`컴팩트 \(\iff\) 닫힘 + 유계(하이네–보렐): \([0,1]\)은 열린 커버의 처음 6개 구간으로 덮이지만, \((0,1]\)은 0 근처의 틈 때문에, \([0,\infty)\)는 무한대의 꼬리 때문에 유한 부분커버를 갖지 않습니다. 볼차노–바이어슈트라스의 수열 버전은 완전히 증명하고, 열린 커버 정의의 동치성은 아이디어 수준에서만 봅니다.`,
        en: String.raw`Compact \(\iff\) closed + bounded (Heine–Borel): \([0,1]\) is covered by the first 6 intervals of its open cover, while \((0,1]\) fails at the gap near 0 and \([0,\infty)\) fails at the infinite tail. Sequential compactness via Bolzano–Weierstrass is proved in full; the open-cover definition's equivalence is shown at the idea level.`,
      },
      tex: [
        String.raw`K \text{ compact } \iff K \text{ closed and bounded}`,
        String.raw`\forall\, \mathcal{U} \text{ open cover of } K\; \exists\, U_1,\dots,U_n \in \mathcal{U} : K \subseteq \bigcup_{k=1}^{n} U_k`,
        String.raw`(a_n) \subset K \Rightarrow \exists\, (a_{n_k}) \to x \in K`,
      ],
      prerequisites: ['closure'],
      controls: [
        { kind: 'select', key: 'set', label: { ko: '집합 K', en: 'Set K' }, options: ['closed', 'halfopen', 'unbounded'], init: 'closed' },
        { kind: 'slider', key: 'step', label: { ko: '유한 부분커버: 앞 k개', en: 'Finite subcover: first k' }, min: 0, max: 8, step: 1, init: 6 },
      ],
      problems: compactProblems,
    },
    {
      id: 'topologist-sine',
      title: { ko: '위상수학자의 사인 곡선', en: "Topologist's Sine Curve" },
      order: 5,
      summary: {
        ko: String.raw`\(\{(x, \sin(1/x)) : x > 0\}\)의 폐포는 \(y\)축 위의 선분 \(\{0\}\times[-1,1]\)을 덧붙입니다. 연결집합의 폐포라 연결이지만, 선분 위의 점에서 곡선으로 가는 길은 없습니다 — 연결이 path-연결보다 약한 이유의 살아있는 예시입니다.`,
        en: String.raw`The closure of \(\{(x, \sin(1/x)) : x > 0\}\) adds the segment \(\{0\}\times[-1,1]\) on the \(y\)-axis. Connected as the closure of a connected set, yet no path runs from the segment into the curve — the living example of why connected is weaker than path-connected.`,
      },
      tex: [
        String.raw`S = \{(x, \sin(1/x)) : x > 0\}, \quad \overline{S} = S \cup \bigl(\{0\} \times [-1,1]\bigr)`,
        String.raw`\overline{S} \text{ connected},\quad \overline{S} \text{ not path-connected}`,
      ],
      prerequisites: ['compact', 'closure'],
      controls: [
        { kind: 'slider', key: 'xMin', label: { ko: '왼쪽 끝 x', en: 'Left end x' }, min: 0.005, max: 1, step: 0.005, init: 0.05 },
        { kind: 'toggle', key: 'showSegment', label: { ko: '극한 선분 표시', en: 'Show limit segment' }, init: true },
        { kind: 'toggle', key: 'showSeq', label: { ko: '수열 표시', en: 'Show sequences' }, init: true },
      ],
      problems: topologistSineProblems,
    },
    {
      id: 'peano-curve',
      title: { ko: '페아노 곡선', en: 'Peano Curve' },
      order: 6,
      summary: {
        ko: String.raw`연속사상 \([0,1] \to [0,1]^2\)가 정사각형을 가득 채울 수 있습니다 — 9개 정사각형 뱀 행렬을 재귀적으로 반복하면 균등수렴하는 근사 곡선들이 전사 연속 극한을 만듭니다. 단사성은 불가능합니다 (Netto 정리, 완전 증명).`,
        en: String.raw`A continuous map \([0,1] \to [0,1]^2\) can fill the whole square — recursively repeating the 9-subsquare snake yields uniformly convergent approximations with a surjective continuous limit. Injectivity is impossible (Netto's theorem, proved in full).`,
      },
      tex: [
        String.raw`\gamma_n \to \gamma \text{ uniformly},\quad \gamma : [0,1] \to [0,1]^2 \text{ continuous and onto}`,
        String.raw`\text{No continuous bijection } [0,1] \to [0,1]^2 \text{ exists}`,
      ],
      prerequisites: ['topologist-sine', 'uniform'],
      controls: [
        { kind: 'slider', key: 'order', label: { ko: '차수 n', en: 'Order n' }, min: 1, max: 4, step: 1, init: 2 },
        { kind: 'slider', key: 't', label: { ko: '매개변수 t', en: 'Parameter t' }, min: 0, max: 1, step: 0.001, init: 0.5 },
        { kind: 'toggle', key: 'showGrid', label: { ko: '격자 표시', en: 'Show grid' }, init: true },
      ],
      problems: peanoCurveProblems,
    },
    {
      id: 'metric-spaces',
      title: { ko: '거리공간', en: 'Metric Spaces' },
      order: 7,
      summary: {
        ko: String.raw`거리를 공리화하면 \(\varepsilon\)-공이 일반화됩니다 — 열린 공 \(B(c, r)\)의 모양은 거리 \(d\)에 달려 있습니다. 유클리드 거리의 원판, 최대 노름의 정사각형, 그리고 극단적인 예시인 이산 거리를 비교합니다.`,
        en: String.raw`Axiomatizing distance generalizes the \(\varepsilon\)-ball — the shape of an open ball \(B(c, r)\) depends on the metric \(d\). Compare the Euclidean disk, the max-norm square, and the extreme discrete metric.`,
      },
      tex: [
        String.raw`d(x,y) \geq 0, \quad d(x,y) = 0 \iff x = y`,
        String.raw`d(x,y) = d(y,x), \quad d(x,z) \leq d(x,y) + d(y,z)`,
        String.raw`B(c, r) = \{x : d(x, c) < r\}`,
      ],
      prerequisites: ['closure'],
      controls: [
        { kind: 'select', key: 'metric', label: { ko: '거리', en: 'Metric' }, options: ['euclid', 'discrete', 'maxnorm'], init: 'euclid' },
        { kind: 'slider', key: 'r', label: { ko: '반지름 r', en: 'Radius r' }, min: 0.2, max: 2, step: 0.1, init: 1 },
      ],
      problems: metricSpacesProblems,
    },
    {
      id: 'contraction',
      title: { ko: '축소사상 원리', en: 'Contraction Mapping Principle' },
      order: 8,
      summary: {
        ko: String.raw`수축사상 \(d(Tx,Ty) \le q\,d(x,y)\) (\(q<1\))은 완비 거리공간에서 유일한 고정점을 갖습니다 — 피카르 반복 \(x_{n+1} = Tx_n\)은 오차공 \(\frac{q^n}{1-q}|x_1-x_0|\)과 함께 조여듭니다. \(T(x) = x/2\) on \((0,1]\)은 완비성이 왜 필수적인지 보여줍니다: 수축사상이지만 고정점이 없습니다.`,
        en: String.raw`A contraction \(d(Tx,Ty) \le q\,d(x,y)\) (\(q<1\)) on a complete metric space has a unique fixed point — the Picard iterates \(x_{n+1} = Tx_n\) tighten inside the error ball \(\frac{q^n}{1-q}|x_1-x_0|\). \(T(x) = x/2\) on \((0,1]\) shows why completeness is essential: a contraction with no fixed point.`,
      },
      tex: [
        String.raw`d(Tx,Ty) \le q\,d(x,y), \quad 0 \le q < 1`,
        String.raw`d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1), \qquad d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)`,
        String.raw`T(x) = x/2 \text{ on } (0,1]: \text{ contraction, no fixed point}`,
      ],
      prerequisites: ['metric-spaces', 'monotone-cauchy'],
      controls: [
        { kind: 'select', key: 'map', label: { ko: '사상 T', en: 'Map T' }, options: ['affine', 'half'], init: 'affine' },
        { kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 12, step: 1, init: 5 },
        { kind: 'slider', key: 'x0', label: { ko: '시작점 x₀', en: 'Start x₀' }, min: 0.1, max: 3, step: 0.1, init: 1 },
      ],
      problems: contractionProblems,
    },
    {
      id: 'baire-category',
      title: { ko: '베어 카테고리 정리', en: 'Baire Category Theorem' },
      order: 9,
      summary: {
        ko: String.raw`완비 거리공간은 nowhere dense인 집합들의 가산합집합이 될 수 없습니다 — 이것이 Baire Category Theorem입니다. \([0, 1]\)의 유리수를 하나씩 피하는 중첩 닫힌구간 \(I_k\)를 따라가면, 길이가 \(0\)으로 수렴하는 교집합 속에 무리수 한 점이 남습니다.`,
        en: String.raw`A complete metric space cannot be a countable union of nowhere dense sets — that is the Baire Category Theorem. Dodging the rationals of \([0, 1]\) one by one with nested closed intervals \(I_k\) leaves a single irrational point in the intersection, whose lengths shrink to \(0\).`,
      },
      tex: [
        String.raw`X = \bigcup_{n=1}^{\infty} E_n,\ \operatorname{int}(\overline{E_n}) = \varnothing \ \text{impossible if } X \text{ complete}`,
        String.raw`\overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k) \setminus \overline{E_{k+1}},\ r_{k+1} < r_k/2 \ \Longrightarrow\ x \in \bigcap_k \overline{B}(x_k, r_k),\ x \notin E_k\ \forall k`,
      ],
      prerequisites: ['metric-spaces', 'contraction'],
      controls: [
        { kind: 'slider', key: 'stage', label: { ko: '단계', en: 'Stage' }, min: 1, max: 14, step: 1, init: 6 },
      ],
problems: baireCategoryProblems,
    },
    {
      id: 'baire-1',
      title: { ko: '베어 1급 함수', en: 'Baire Class 1 Functions' },
      order: 10,
      summary: {
        ko: String.raw`연속함수들의 점별 극한 — Baire 1급 함수. Thomae 함수 \(T(p/q) = 1/q\) (기약분수), \(T(x) = 0\) (무리수)는 서로 겹치지 않는 텐트들의 합 \(f_n\)의 점별 극한입니다. \(T\)는 무리수에서 연속, 유리수에서 불연속 — 연속점 집합이 조밀한 \(G_\delta\)라는 Baire 정리의 살아있는 예시입니다.`,
        en: String.raw`Pointwise limits of continuous functions — Baire class 1. Thomae's function \(T(p/q) = 1/q\) (reduced), \(T(x) = 0\) (irrational) is the pointwise limit of sums \(f_n\) of disjoint tents. \(T\) is continuous at irrationals, discontinuous at rationals — a living example of Baire's theorem that the continuity points contain a dense \(G_\delta\).`,
      },
      tex: [
        String.raw`f_n(x) = \sum_{\substack{1 \le q \le n \\ \gcd(p,q)=1}} \frac{1}{q}\,\mathrm{tri}\!\left(n^3\left(x - \tfrac{p}{q}\right)\right) \to T(x)`,
        String.raw`\text{Baire-1 } f \ \Longrightarrow\ \text{continuity points} \supseteq \text{dense } G_\delta`,
      ],
      prerequisites: ['baire-category', 'continuity'],
      controls: [
        { kind: 'slider', key: 'N', label: { ko: '근사 단계 N', en: 'Approximation stage N' }, min: 2, max: 12, step: 1, init: 5 },
      ],
      problems: baireOneProblems,
    },
    {
      id: 'cantor',
      title: { ko: '칸토어 집합', en: 'Length Zero, Points Uncountable' },
      order: 11,
      summary: {
        ko: String.raw`가운데 3분의 1을 계속 지우면 전체 길이는 \(\left(\frac{2}{3}\right)^n\to 0\)이 되지만, 남는 점은 셀 수 없이 많습니다. 비가산성은 아이디어 수준에서만 언급합니다.`,
        en: String.raw`Deleting middle thirds drives the total length \(\left(\frac{2}{3}\right)^n\to 0\), yet uncountably many points remain. Uncountability is stated at the idea level only.`,
      },
      tex: [String.raw`|C_n|=\left(\frac{2}{3}\right)^n\to 0`, String.raw`|C|=|\mathbb{R}|`],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: cantorProblems,
    },
    {
      id: 'fat-cantor',
      title: { ko: '팻 칸토어 집합', en: 'The Fat Cantor Set' },
      order: 12,
      summary: {
        ko: String.raw`가운데를 덜 파내면 어떻게 될까요 — 매 단계에서 길이 \(4^{-n}\)만 제거하면 남는 집합은 컴팩트하고 nowhere dense이며 perfect인데도 전체 길이가 \(\frac12\)로 수렴합니다. 측도와 위상적 크기는 독립적입니다.`,
        en: String.raw`What if we dig out less? Removing only length \(4^{-n}\) per interval leaves a set that is compact, nowhere dense and perfect — yet keeps total length \(\frac12\). Measure and topological size are independent notions.`,
      },
      tex: [
        String.raw`\sum_{n\ge 1} 2^{n-1} 4^{-n} = \frac12`,
        String.raw`m(C) = \frac12,\quad \mathrm{int}\,C = \varnothing`,
      ],
      prerequisites: ['cantor'],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 7, step: 1, init: 4 }],
problems: fatCantorProblems,
    },
    {
      id: 'cantor-function',
      title: { ko: '칸토어 함수', en: 'The Cantor Function' },
      order: 13,
      summary: {
        ko: String.raw`악마의 계단: 연속이고 단조롭게 \(0\)에서 \(1\)로 오르지만, 여집합 구간에서는 상수라서 \(f' = 0\)인 점들의 전체 길이가 \(1\)입니다. \(f(1) - f(0) = 1 \neq \int_0^1 f'\) — 미적분학 기본정리가 "거의 모든 곳에서 미분가능"보다 더 강한 것을 요구하는 이유입니다.`,
        en: String.raw`The Devil's staircase: continuous and nondecreasing from \(0\) to \(1\), yet constant on every complementary interval, so \(f' = 0\) on a set of total length \(1\). \(f(1) - f(0) = 1 \neq \int_0^1 f'\) — why the FTC needs more than differentiability almost everywhere.`,
      },
      tex: [
        String.raw`f(x) = \sum b_k 2^{-k},\quad b_k \in \{0,1\}\ \text{from the ternary expansion}`,
        String.raw`f(1) - f(0) = 1 \neq 0 = \int_0^1 f'`,
      ],
      prerequisites: ['cantor'],
      controls: [
        { kind: 'slider', key: 'stage', label: { ko: '칸토어 집합 단계 n', en: 'Cantor set stage n' }, min: 0, max: 7, step: 1, init: 4 },
      ],
      problems: cantorFunctionProblems,
    },
  ],
};
