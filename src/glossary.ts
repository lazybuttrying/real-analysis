import type { LocalizedText } from './contracts.ts';

/**
 * Hand-authored glossary of the key mathematical terms used across the scenes.
 * Pure data: no code, no DOM, no imports beyond types. Read by the prerender
 * script (Node), the client-side glossary page, and the search-index builder.
 *
 * Conventions (same as meta.ts): Korean lives only inside `ko:` strings;
 * inline math uses \(...\) delimiters (never $...$); every entry links to the
 * scene where the term is introduced via chapterId + sceneId.
 */
export interface GlossaryEntry {
  /** Stable kebab-case id, unique across the glossary. Used for #term-<id> anchors. */
  id: string;
  term: LocalizedText;
  /** One or two sentences. May embed \(...\) inline math. */
  definition: LocalizedText;
  chapterId: string;
  sceneId: string;
}

export const glossary: readonly GlossaryEntry[] = [
  // ---------------------------------------------------------------- limits
  {
    id: 'set',
    term: { ko: '집합', en: 'set' },
    definition: {
      ko: String.raw`서로 다른 대상들의 모임. 해석학의 모든 논의는 집합에서 시작한다.`,
      en: `A collection of distinct objects. Every discussion in analysis begins with a set.`,
    },
    chapterId: 'limits',
    sceneId: 'sets',
  },
  {
    id: 'function',
    term: { ko: '함수', en: 'function' },
    definition: {
      ko: String.raw`정의역의 각 원소에 공역의 원소를 정확히 하나씩 대응시키는 규칙.`,
      en: `A rule assigning to each element of a domain exactly one element of a codomain.`,
    },
    chapterId: 'limits',
    sceneId: 'sets',
  },
  {
    id: 'supremum',
    term: { ko: '상한', en: 'supremum' },
    definition: {
      ko: String.raw`집합의 상계 중 가장 작은 것. \(\sup A\)로 쓴다.`,
      en: String.raw`The least of the upper bounds of a set, written \(\sup A\).`,
    },
    chapterId: 'limits',
    sceneId: 'supremum',
  },
  {
    id: 'infimum',
    term: { ko: '하한', en: 'infimum' },
    definition: {
      ko: String.raw`집합의 하계 중 가장 큰 것. \(\inf A\)로 쓴다.`,
      en: String.raw`The greatest of the lower bounds of a set, written \(\inf A\).`,
    },
    chapterId: 'limits',
    sceneId: 'supremum',
  },
  {
    id: 'countable-set',
    term: { ko: '가산집합', en: 'countable set' },
    definition: {
      ko: String.raw`자연수와 일대일로 대응시킬 수 있는 집합. 유리수 집합이 대표적이다.`,
      en: `A set that can be put in one-to-one correspondence with the natural numbers; the rationals are the classic example.`,
    },
    chapterId: 'limits',
    sceneId: 'countable',
  },
  {
    id: 'group',
    term: { ko: '군', en: 'group' },
    definition: {
      ko: String.raw`결합법칙을 만족하는 하나의 연산에 대해 항등원과 역원을 갖춘 집합.`,
      en: `A set with one associative operation, an identity element, and inverses.`,
    },
    chapterId: 'limits',
    sceneId: 'groups-fields',
  },
  {
    id: 'field',
    term: { ko: '체', en: 'field' },
    definition: {
      ko: String.raw`덧셈과 곱셈에 대해 각각 군을 이루고 분배법칙이 성립하는 집합. 유리수와 실수가 대표적이다.`,
      en: `A set forming a group under each of addition and multiplication, with distributivity; the rationals and the reals are examples.`,
    },
    chapterId: 'limits',
    sceneId: 'groups-fields',
  },
  {
    id: 'vector-space',
    term: { ko: '벡터공간', en: 'vector space' },
    definition: {
      ko: String.raw`덧셈과 스칼라 곱셈에 대해 닫힌 집합. \(\mathbb{R}^n\)이 대표적이다.`,
      en: String.raw`A set closed under addition and scalar multiplication; \(\mathbb{R}^n\) is the prototype.`,
    },
    chapterId: 'limits',
    sceneId: 'vector-spaces',
  },
  {
    id: 'isomorphism',
    term: { ko: '동형', en: 'isomorphism' },
    definition: {
      ko: String.raw`구조를 보존하는 전단사. 동형인 두 공간은 "포장만 다른 같은 구조"이다.`,
      en: `A structure-preserving bijection. Isomorphic spaces are "the same structure in different packaging".`,
    },
    chapterId: 'limits',
    sceneId: 'vector-spaces',
  },
  {
    id: 'dimension',
    term: { ko: '차원', en: 'dimension' },
    definition: {
      ko: String.raw`벡터공간의 기저가 갖는 원소의 개수.`,
      en: `The number of elements in a basis of a vector space.`,
    },
    chapterId: 'limits',
    sceneId: 'dimension-rank',
  },
  {
    id: 'rank',
    term: { ko: '랭크', en: 'rank' },
    definition: {
      ko: String.raw`선형사상의 상(image)의 차원.`,
      en: `The dimension of the image of a linear map.`,
    },
    chapterId: 'limits',
    sceneId: 'dimension-rank',
  },
  {
    id: 'sequence-limit',
    term: { ko: '수열의 극한', en: 'limit of a sequence' },
    definition: {
      ko: String.raw`모든 \(\varepsilon > 0\)에 대해 \(n > N\)이면 \(|x_n - L| < \varepsilon\)이도록 \(N\)을 잡을 수 있을 때 \(x_n \to L\)이다.`,
      en: String.raw`\(x_n \to L\) when for every \(\varepsilon > 0\) there is \(N\) with \(|x_n - L| < \varepsilon\) for all \(n > N\).`,
    },
    chapterId: 'limits',
    sceneId: 'epsilon-n',
  },
  {
    id: 'epsilon-delta',
    term: { ko: 'ε-δ 논법', en: 'epsilon-delta argument' },
    definition: {
      ko: String.raw`함수의 극한을 "오차 \(\varepsilon\)마다 허용 오차 \(\delta\)"로 정의하는 엄밀한 방식.`,
      en: String.raw`The rigorous definition of a function limit: for every error \(\varepsilon\) there is a tolerance \(\delta\).`,
    },
    chapterId: 'limits',
    sceneId: 'epsdelta',
  },
  {
    id: 'continuity',
    term: { ko: '연속', en: 'continuity' },
    definition: {
      ko: String.raw`\(x \to a\)일 때 \(f(x) \to f(a)\). 그래프가 끊어지지 않는다.`,
      en: String.raw`\(f(x) \to f(a)\) as \(x \to a\); the graph has no breaks.`,
    },
    chapterId: 'limits',
    sceneId: 'continuity',
  },
  {
    id: 'uniform-continuity',
    term: { ko: '균등연속', en: 'uniform continuity' },
    definition: {
      ko: String.raw`하나의 \(\delta\)가 정의역 전체에서 통하는 연속성. \(1/x\)는 \((0,1]\)에서 연속이지만 균등연속이 아니다.`,
      en: String.raw`Continuity with a single \(\delta\) working across the whole domain; \(1/x\) is continuous but not uniformly continuous on \((0,1]\).`,
    },
    chapterId: 'limits',
    sceneId: 'uniform-continuity',
  },
  {
    id: 'open-set',
    term: { ko: '열린집합', en: 'open set' },
    definition: {
      ko: String.raw`모든 점이 내점인 집합. 경계를 포함하지 않는다.`,
      en: `A set in which every point is an interior point; it contains none of its boundary.`,
    },
    chapterId: 'limits',
    sceneId: 'opensets',
  },
  {
    id: 'closed-set',
    term: { ko: '닫힌집합', en: 'closed set' },
    definition: {
      ko: String.raw`여집합이 열린 집합. 극한점을 모두 포함한다.`,
      en: `A set whose complement is open; it contains all its limit points.`,
    },
    chapterId: 'limits',
    sceneId: 'opensets',
  },
  {
    id: 'closure',
    term: { ko: '폐포', en: 'closure' },
    definition: {
      ko: String.raw`집합에 그 극한점을 모두 더한 것. \(\overline{A}\)로 쓴다.`,
      en: String.raw`A set together with all its limit points, written \(\overline{A}\).`,
    },
    chapterId: 'limits',
    sceneId: 'closure',
  },
  {
    id: 'bounded-set',
    term: { ko: '유계', en: 'bounded' },
    definition: {
      ko: String.raw`어떤 구간(또는 공) 안에 들어가는 집합.`,
      en: `A set that fits inside some interval (or ball).`,
    },
    chapterId: 'limits',
    sceneId: 'closure',
  },
  {
    id: 'metric-space',
    term: { ko: '거리공간', en: 'metric space' },
    definition: {
      ko: String.raw`두 점 사이의 거리 \(d(x,y)\)가 정의된 집합.`,
      en: String.raw`A set equipped with a distance \(d(x,y)\) between points.`,
    },
    chapterId: 'limits',
    sceneId: 'metric-spaces',
  },
  {
    id: 'metric',
    term: { ko: '거리', en: 'metric' },
    definition: {
      ko: String.raw`대칭성, 비음수성, 삼각부등식을 만족하는 거리 함수.`,
      en: `A distance function satisfying symmetry, non-negativity, and the triangle inequality.`,
    },
    chapterId: 'limits',
    sceneId: 'metric-spaces',
  },
  {
    id: 'norm',
    term: { ko: '노름', en: 'norm' },
    definition: {
      ko: String.raw`벡터의 "길이" \(\|x\|\). 거리는 \(d(x,y) = \|x - y\|\)로 만든다.`,
      en: String.raw`The "length" \(\|x\|\) of a vector; the metric is \(d(x,y) = \|x - y\|\).`,
    },
    chapterId: 'limits',
    sceneId: 'sequence-spaces',
  },
  {
    id: 'lp-space',
    term: { ko: String.raw`\(\ell^p\) 공간`, en: String.raw`\(\ell^p\) space` },
    definition: {
      ko: String.raw`\(p\)제곱 합이 유한한 수열들의 공간. \(\ell^1 \subset \ell^2 \subset \ell^\infty\)이다.`,
      en: String.raw`The space of sequences with finite \(p\)-th power sum; \(\ell^1 \subset \ell^2 \subset \ell^\infty\).`,
    },
    chapterId: 'limits',
    sceneId: 'sequence-spaces',
  },
  {
    id: 'irrational',
    term: { ko: '무리수', en: 'irrational number' },
    definition: {
      ko: String.raw`유리수가 아닌 실수. \(\sqrt{2}\)가 대표적이다.`,
      en: String.raw`A real number that is not rational; \(\sqrt{2}\) is the classic example.`,
    },
    chapterId: 'limits',
    sceneId: 'holes',
  },
  {
    id: 'real-number',
    term: { ko: '실수', en: 'real number' },
    definition: {
      ko: String.raw`유리수 코시 수열의 동치류. 유리수의 빈틈을 메워 만든 수이다.`,
      en: `An equivalence class of Cauchy sequences of rationals — the rationals with their gaps filled.`,
    },
    chapterId: 'limits',
    sceneId: 'construction',
  },
  {
    id: 'cauchy-sequence',
    term: { ko: '코시 수열', en: 'Cauchy sequence' },
    definition: {
      ko: String.raw`항들이 서로 끝없이 가까워지는 수열. 실수에서는 수렴과 동치이다.`,
      en: String.raw`A sequence whose terms get arbitrarily close to each other; equivalent to convergence in \(\mathbb{R}\).`,
    },
    chapterId: 'limits',
    sceneId: 'construction',
  },
  {
    id: 'bolzano-weierstrass',
    term: { ko: '볼차노–바이어슈트라스 정리', en: 'Bolzano–Weierstrass theorem' },
    definition: {
      ko: String.raw`유계인 실수 수열은 수렴하는 부분수열을 갖는다.`,
      en: `Every bounded real sequence has a convergent subsequence.`,
    },
    chapterId: 'limits',
    sceneId: 'bolzano-weierstrass',
  },
  {
    id: 'monotone-sequence',
    term: { ko: '단조수열', en: 'monotone sequence' },
    definition: {
      ko: String.raw`항상 증가하거나 항상 감소하는 수열. 유계이면 수렴한다.`,
      en: `A sequence that is always increasing or always decreasing; if bounded, it converges.`,
    },
    chapterId: 'limits',
    sceneId: 'monotone-cauchy',
  },
  {
    id: 'cantor-set',
    term: { ko: '칸토어 집합', en: 'Cantor set' },
    definition: {
      ko: String.raw`구간을 3등분하며 가운데를 계속 덜어내 만든 집합. 길이는 0이지만 비가산이다.`,
      en: `The set left after repeatedly removing middle thirds; it has length zero yet is uncountable.`,
    },
    chapterId: 'limits',
    sceneId: 'cantor',
  },
  {
    id: 'ivt',
    term: { ko: '중간값 정리', en: 'intermediate value theorem' },
    definition: {
      ko: String.raw`연속함수는 두 함숫값 사이의 모든 값을 취한다.`,
      en: `A continuous function takes every value between any two of its values.`,
    },
    chapterId: 'limits',
    sceneId: 'ivt',
  },
  {
    id: 'evt',
    term: { ko: '최대·최소 정리', en: 'extreme value theorem' },
    definition: {
      ko: String.raw`닫힌 구간 위의 연속함수는 최댓값과 최솟값을 갖는다.`,
      en: `A continuous function on a closed interval attains a maximum and a minimum.`,
    },
    chapterId: 'limits',
    sceneId: 'evt',
  },
  {
    id: 'uniform-convergence',
    term: { ko: '균등수렴', en: 'uniform convergence' },
    definition: {
      ko: String.raw`하나의 \(N\)이 모든 \(x\)에 통하는 함수열의 수렴. 극한의 연속성을 보존한다.`,
      en: String.raw`Convergence of a sequence of functions with one \(N\) working for all \(x\); it preserves continuity of the limit.`,
    },
    chapterId: 'limits',
    sceneId: 'uniform',
  },
  {
    id: 'pointwise-convergence',
    term: { ko: '점별수렴', en: 'pointwise convergence' },
    definition: {
      ko: String.raw`각 점마다 따로 수렴하는 것. 극한이 불연속이 될 수 있다.`,
      en: `Convergence at each point separately; the limit may be discontinuous.`,
    },
    chapterId: 'limits',
    sceneId: 'uniform',
  },
  {
    id: 'weierstrass-approx',
    term: { ko: '바이어슈트라스 근사정리', en: 'Weierstrass approximation theorem' },
    definition: {
      ko: String.raw`닫힌 구간 위의 연속함수는 다항식으로 균등하게 근사할 수 있다.`,
      en: `Every continuous function on a closed interval can be uniformly approximated by polynomials.`,
    },
    chapterId: 'limits',
    sceneId: 'weierstrass-approx',
  },
  {
    id: 'bernstein-polynomial',
    term: { ko: '번스타인 다항식', en: 'Bernstein polynomial' },
    definition: {
      ko: String.raw`\(B_n(f)(x) = \sum_{k=0}^{n} f(k/n)\binom{n}{k}x^k(1-x)^{n-k}\). 근사정리의 구성적 증명에 쓰인다.`,
      en: String.raw`\(B_n(f)(x) = \sum_{k=0}^{n} f(k/n)\binom{n}{k}x^k(1-x)^{n-k}\); used in the constructive proof of the approximation theorem.`,
    },
    chapterId: 'limits',
    sceneId: 'weierstrass-approx',
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
    id: 'power-series',
    term: { ko: '멱급수', en: 'power series' },
    definition: {
      ko: String.raw`\(\sum a_n(x-c)^n\) 꼴의 급수.`,
      en: String.raw`A series of the form \(\sum a_n(x-c)^n\).`,
    },
    chapterId: 'series',
    sceneId: 'power-series',
  },
  {
    id: 'radius-of-convergence',
    term: { ko: '수렴반경', en: 'radius of convergence' },
    definition: {
      ko: String.raw`멱급수가 수렴하는 구간의 반지름.`,
      en: `The radius of the interval on which a power series converges.`,
    },
    chapterId: 'series',
    sceneId: 'power-series',
  },
  {
    id: 'euler-number',
    term: { ko: String.raw`자연상수 \(e\)`, en: String.raw`the constant \(e\)` },
    definition: {
      ko: String.raw`\(\lim (1+1/n)^n = \sum 1/n!\). 자연로그의 밑이다.`,
      en: String.raw`The base of the natural logarithm: \(\lim (1+1/n)^n = \sum 1/n!\).`,
    },
    chapterId: 'series',
    sceneId: 'eseries',
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
    id: 'gamma-function',
    term: { ko: '감마함수', en: 'gamma function' },
    definition: {
      ko: String.raw`\(\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt\). 팩토리얼을 실수로 확장한다(\(\Gamma(n+1) = n!\)).`,
      en: String.raw`\(\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt\); the continuous extension of the factorial (\(\Gamma(n+1) = n!\)).`,
    },
    chapterId: 'series',
    sceneId: 'gamma',
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
    id: 'riemann-zeta',
    term: { ko: '리만 제타함수', en: 'Riemann zeta function' },
    definition: {
      ko: String.raw`\(\zeta(s) = \sum 1/n^s\). 바젤 문제는 \(\zeta(2) = \pi^2/6\)이다.`,
      en: String.raw`\(\zeta(s) = \sum 1/n^s\); the Basel problem is \(\zeta(2) = \pi^2/6\).`,
    },
    chapterId: 'series',
    sceneId: 'zeta4',
  },
  {
    id: 'rearrangement-theorem',
    term: { ko: '재배열 정리', en: 'rearrangement theorem' },
    definition: {
      ko: String.raw`절대수렴 급수는 항의 순서를 바꿔도 합이 같다. 조건수렴 급수는 그렇지 않다.`,
      en: `Absolutely convergent series keep their sum under reordering; conditionally convergent ones need not.`,
    },
    chapterId: 'series',
    sceneId: 'rearrangement',
  },
  {
    id: 'conditional-convergence',
    term: { ko: '조건수렴', en: 'conditional convergence' },
    definition: {
      ko: String.raw`수렴하지만 절대수렴하지는 않는 것.`,
      en: `Convergence without absolute convergence.`,
    },
    chapterId: 'series',
    sceneId: 'rearrangement',
  },
  {
    id: 'absolute-convergence',
    term: { ko: '절대수렴', en: 'absolute convergence' },
    definition: {
      ko: String.raw`\(\sum |a_n|\)이 수렴하는 것. 수렴을 보장한다.`,
      en: String.raw`Convergence of \(\sum |a_n|\); it implies convergence.`,
    },
    chapterId: 'series',
    sceneId: 'absolute',
  },
  {
    id: 'improper-integral',
    term: { ko: '이상적분', en: 'improper integral' },
    definition: {
      ko: String.raw`무한 구간이나 무한대 함숫값에 대한 적분을 극한으로 정의한 것.`,
      en: `An integral over an unbounded interval or of an unbounded function, defined as a limit.`,
    },
    chapterId: 'series',
    sceneId: 'improper',
  },
  // -------------------------------------------------------------- calculus
  {
    id: 'differentiable',
    term: { ko: '미분가능', en: 'differentiable' },
    definition: {
      ko: String.raw`그 점에서 접선이 존재하는 것. 미분가능하면 연속이다.`,
      en: `Having a tangent line at the point; differentiability implies continuity.`,
    },
    chapterId: 'calculus',
    sceneId: 'diffcont',
  },
  {
    id: 'mean-value-theorem',
    term: { ko: '평균값 정리', en: 'mean value theorem' },
    definition: {
      ko: String.raw`\([a,b]\)에서 연속이고 \((a,b)\)에서 미분가능하면 \(f'(c) = (f(b)-f(a))/(b-a)\)인 \(c\)가 존재한다.`,
      en: String.raw`If \(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\), some \(c\) satisfies \(f'(c) = (f(b)-f(a))/(b-a)\).`,
    },
    chapterId: 'calculus',
    sceneId: 'mvt',
  },
  {
    id: 'cauchy-mean-value',
    term: { ko: '코시 평균값 정리', en: 'Cauchy mean value theorem' },
    definition: {
      ko: String.raw`두 함수에 대한 평균값 정리. 로피탈 정리의 바탕이다.`,
      en: `The mean value theorem for two functions; the basis of l'Hôpital's rule.`,
    },
    chapterId: 'calculus',
    sceneId: 'cauchy-mvt',
  },
  {
    id: 'taylor-series',
    term: { ko: '테일러 급수', en: 'Taylor series' },
    definition: {
      ko: String.raw`함수를 \(x=a\)에서의 도함수들로 만든 멱급수.`,
      en: String.raw`The power series built from a function's derivatives at \(x=a\).`,
    },
    chapterId: 'calculus',
    sceneId: 'taylor',
  },
  {
    id: 'taylor-theorem',
    term: { ko: '테일러 정리', en: "Taylor's theorem" },
    definition: {
      ko: String.raw`테일러 다항식과 나머지항 \(R_n\)의 정확한 형태를 주는 정리.`,
      en: String.raw`The theorem giving the Taylor polynomial together with the exact form of the remainder \(R_n\).`,
    },
    chapterId: 'calculus',
    sceneId: 'taylor-thm',
  },
  {
    id: 'convex-function',
    term: { ko: '볼록함수', en: 'convex function' },
    definition: {
      ko: String.raw`현이 그래프 위에 뜨는 함수. \(f(tx+(1-t)y) \le tf(x)+(1-t)f(y)\).`,
      en: String.raw`A function whose chords lie above its graph: \(f(tx+(1-t)y) \le tf(x)+(1-t)f(y)\).`,
    },
    chapterId: 'calculus',
    sceneId: 'convex',
  },
  {
    id: 'jensen-inequality',
    term: { ko: '옌센 부등식', en: "Jensen's inequality" },
    definition: {
      ko: String.raw`볼록함수에 대한 "\(f\)의 평균 \(\ge\) 평균의 \(f\)".`,
      en: String.raw`For convex \(f\): \(f\) of the average \(\le\) the average of \(f\).`,
    },
    chapterId: 'calculus',
    sceneId: 'convex',
  },
  {
    id: 'riemann-integral',
    term: { ko: '리만 적분', en: 'Riemann integral' },
    definition: {
      ko: String.raw`구간을 잘게 나누어 만든 리만 합의 극한.`,
      en: `The limit of Riemann sums over finer and finer partitions.`,
    },
    chapterId: 'calculus',
    sceneId: 'riemann',
  },
  {
    id: 'partition',
    term: { ko: '분할', en: 'partition' },
    definition: {
      ko: String.raw`구간을 나눈 점들의 집합.`,
      en: `The set of cut points dividing an interval.`,
    },
    chapterId: 'calculus',
    sceneId: 'riemann',
  },
  {
    id: 'ftc',
    term: { ko: '미적분학의 기본정리', en: 'fundamental theorem of calculus' },
    definition: {
      ko: String.raw`미분과 적분은 서로 역연산이다.`,
      en: `Differentiation and integration are inverse operations.`,
    },
    chapterId: 'calculus',
    sceneId: 'ftc',
  },
  {
    id: 'newton-method',
    term: { ko: '뉴턴 방법', en: "Newton's method" },
    definition: {
      ko: String.raw`\(x_{n+1} = x_n - f(x_n)/f'(x_n)\)으로 근을 찾는 반복법.`,
      en: String.raw`The iteration \(x_{n+1} = x_n - f(x_n)/f'(x_n)\) for finding roots.`,
    },
    chapterId: 'calculus',
    sceneId: 'newton',
  },
  {
    id: 'banach-fixed-point',
    term: { ko: '바나흐 고정점 정리', en: 'Banach fixed-point theorem' },
    definition: {
      ko: String.raw`완비 거리공간 위의 수축사상은 유일한 고정점을 갖는다.`,
      en: `A contraction on a complete metric space has a unique fixed point.`,
    },
    chapterId: 'calculus',
    sceneId: 'banach',
  },
  {
    id: 'contraction',
    term: { ko: '수축사상', en: 'contraction mapping' },
    definition: {
      ko: String.raw`거리를 일정 비율(1 미만) 이하로 줄이는 사상.`,
      en: `A map that shrinks distances by a fixed ratio below 1.`,
    },
    chapterId: 'calculus',
    sceneId: 'banach',
  },
  {
    id: 'fourier-series',
    term: { ko: '푸리에 급수', en: 'Fourier series' },
    definition: {
      ko: String.raw`주기함수를 사인·코사인 급수로 나타낸 것.`,
      en: `A periodic function expressed as a sine-cosine series.`,
    },
    chapterId: 'calculus',
    sceneId: 'fourier',
  },
  {
    id: 'lebesgue-measure',
    term: { ko: '르베그 측도', en: 'Lebesgue measure' },
    definition: {
      ko: String.raw`길이·넓이·부피를 집합에 확장한 것.`,
      en: `The extension of length, area, and volume to sets.`,
    },
    chapterId: 'calculus',
    sceneId: 'measure',
  },
  {
    id: 'measure-zero',
    term: { ko: '측도 0', en: 'measure zero' },
    definition: {
      ko: String.raw`전체 길이를 임의로 작게 잡은 구간들로 덮을 수 있는 집합.`,
      en: `A set coverable by intervals of arbitrarily small total length.`,
    },
    chapterId: 'calculus',
    sceneId: 'measure',
  },
  {
    id: 'lebesgue-integral',
    term: { ko: '르베그 적분', en: 'Lebesgue integral' },
    definition: {
      ko: String.raw`함숫값 기준으로 나누어 적분하는 방식. 리만 적분보다 넓은 함수에 적용된다.`,
      en: `Integration by slicing the range of values; applies to a wider class of functions than the Riemann integral.`,
    },
    chapterId: 'calculus',
    sceneId: 'lebesgue',
  },
];
