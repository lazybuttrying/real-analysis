import type { ChapterMeta } from '../../contracts.ts';
import { arzelaAscoliProblems } from '../limits/problems/arzela-ascoli';
import { muntzSzaszProblems } from '../limits/problems/muntz-szasz';
import { problems as weierstrassApproxProblems } from '../limits/problems/weierstrass-approx';
import { stoneWeierstrassProblems } from '../limits/problems/stone-weierstrass';

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
export const approximation: ChapterMeta = {
  id: 'approximation',
  title: { ko: '근사', en: 'Approximation' },
  summary: {
    ko: '연속함수를 다항식으로, 함수족을 균등수렴으로 — 근사 이론의 핵심 정리들입니다.',
    en: 'Approximating continuous functions by polynomials and taming families of functions — the core approximation theorems.',
  },
  scenes: [
    {
      id: 'arzela-ascoli',
      title: { ko: '아르첼라-아스콜리 정리', en: 'Arzelà–Ascoli Theorem' },
      order: 1,
      summary: {
        ko: String.raw`연속함수 무리에서 균등수렴하는 부분수열을 뽑을 수 있는지를 봅니다.

조건은 두 가지입니다. 첫째, 모든 함수가 하나의 📦 상자 안에 갇혀야 합니다. 둘째, 모든 함수가 비슷하게 완만히 흔들려야 합니다. 유리점에서 하나씩 뽑는 대각선 논증을 씁니다. 그러면 전체 구간에서 한꺼번에 가까워지는 부분수열이 나옵니다. 거듭제곱 함수열은 1 근처에서 갑자기 가팔라져 둘째 조건이 깨집니다.

예를 들면, 🧑 친구 30명이 운동장을 걷는 모습을 떠올려 보세요. 전원이 울타리 안에 머물러야 해요. 아무도 갑자기 뛰어서도 안 돼요. 그러면 걸음걸이가 점점 닮아가는 그룹을 뽑을 수 있어요. 한 명이 끝에서 갑자기 질주하면 그 그룹은 만들 수 없습니다.`,
        en: String.raw`When can we pull a uniformly convergent subsequence out of a family of continuous functions?

Two conditions do the job. First, every function stays inside one 📦 box. Second, all of them wiggle with similar gentleness. A diagonal argument over the rationals then builds a subsequence. It closes in everywhere at once. The power functions fail the second condition: they turn steep suddenly near 1.

For example, picture 30 🧑 friends walking across a playground. Everyone must stay inside the fence. Nobody may suddenly sprint. Then you can pick a group whose walks grow alike. One friend sprinting at the end ruins the group.`,
      },
      tex: [
        String.raw`F \subset C(K)\ \text{relatively compact}`,
        String.raw`\iff \text{uniformly bounded} + \text{equicontinuous}`,
        String.raw`\|f_{a_k} - f^*\|_\infty = \frac{1}{k+2} \to 0`,
      ],
      prerequisites: ['uniform', 'bolzano-weierstrass'],
      controls: [{ kind: 'slider', key: 'members', label: { ko: '부분수열 항의 수', en: 'Subsequence members' }, min: 2, max: 12, step: 1, init: 6 }],
problems: arzelaAscoliProblems,
    },
    {
      id: 'weierstrass-approx',
      title: { ko: '바이어슈트라스 근사정리', en: 'Weierstrass Approximation Theorem' },
      order: 2,
      summary: {
        ko: String.raw`구간의 모든 연속함수를 다항식만으로 흉내 낼 수 있는지를 봅니다.

번스타인 다항식은 각 점 근처에서 함숫값들을 평균한 것입니다. 차수를 키우면 평균의 무게가 그 점 가까이에 몰립니다. 그래서 울퉁불퉁한 구석까지 다항식이 따라갑니다. 증명의 세부 추정은 아이디어만 봅니다.

예를 들면, 비탈길을 🪜 계단으로 바꾸는 것과 비슷해요. 계단 칸을 잘게 쪼갤수록 어느 지점에서 재도 비탈과 차이가 거의 없어요. 다항식도 차수를 올릴수록 함수 전체에 한꺼번에 붙습니다.`,
        en: String.raw`Can polynomials alone imitate every continuous function on an interval?

A Bernstein polynomial averages the function's values near each point. As the degree grows, the average concentrates near that point. So the polynomial follows even the bumpy corners. The proof's fine estimates are only sketched.

For example, think of replacing a slope with a 🪜 staircase. The finer the steps, the smaller the gap anywhere you measure. Raising the degree presses the polynomial onto the whole function at once.`,
      },
      tex: [
        String.raw`B_n(f)(x) = \sum_{k=0}^{n} f\!\left(\frac{k}{n}\right) \binom{n}{k} x^k (1-x)^{n-k}`,
        String.raw`f \in C[0,1] \implies \|B_n(f) - f\|_\infty \to 0`,
      ],
      prerequisites: ['uniform'],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수 f', en: 'Function f' }, options: ['one', 'id', 'abs', 'square', 'sin'], init: 'abs' },
        { kind: 'slider', key: 'n', label: { ko: '차수 n', en: 'Degree n' }, min: 1, max: 60, step: 1, init: 10 },
      ],
problems: weierstrassApproxProblems,
    },
    {
      id: 'stone-weierstrass',
      title: { ko: '스톤-바이어슈트라스 정리', en: 'Stone–Weierstrass Theorem' },
      order: 3,
      summary: {
        ko: String.raw`다항식이 아닌 재료로도 모든 연속함수를 근사할 수 있는지를 봅니다.

재료 집합에 필요한 것은 세 가지입니다. 덧셈과 곱셈에 닫혀 있을 것. 서로 다른 두 점을 구별할 수 있을 것. 상수를 품을 것. 이 조건만 갖추면 어떤 연속함수든 원하는 만큼 따라갑니다.

예를 들면, 둥근 파도들을 겹치고 겹치면 뾰족한 🏠 지붕 모양도 만들 수 있어요. 이 장면에서는 원 위에서 삼각함수 파도들이 삼각파에 붙는 모습을 확인합니다.`,
        en: String.raw`Can materials other than polynomials approximate every continuous function?

The ingredient set needs three things. Closure under addition and multiplication. The power to tell two different points apart. And the constant functions. With only these, it tracks any continuous function as closely as you like.

For example, layering round waves can build even a pointy 🏠 roof shape. In this scene, waves of sines and cosines close in on the triangle wave on a circle.`,
      },
      tex: [
        String.raw`S_n(x) = \frac{\pi}{2} - \frac{4}{\pi}\sum_{\text{odd } k \le n} \frac{\cos(kx)}{k^2} \xrightarrow{\|\cdot\|_\infty} |x|`,
        String.raw`a_k = \frac{2}{\pi}\int_0^{\pi} x\cos(kx)\,dx = \frac{2}{\pi}\frac{(-1)^k - 1}{k^2}`,
        String.raw`\|S_8 - f\|_\infty \approx 0.0792,\quad \|S_{25} - f\|_\infty \approx 0.0245,\quad \|S_{40} - f\|_\infty \approx 0.0159`,
      ],
      prerequisites: ['weierstrass-approx'],
      controls: [
        { kind: 'slider', key: 'degree', label: { ko: '차수 n', en: 'Degree n' }, min: 1, max: 40, step: 1, init: 8 },
      ],
problems: stoneWeierstrassProblems,
    },
    {
      id: 'muntz-szasz',
      title: { ko: '뮌츠-서스 정리', en: 'Müntz–Szász Theorem' },
      order: 4,
      summary: {
        ko: String.raw`거듭제곱 재료 몇 개를 빼먹어도 근사가 여전히 되는지를 봅니다.

기준은 지수들의 역수 합입니다. 그 합이 끝없이 커지면 재료가 충분히 촘촘합니다. 합이 유한하면 영원히 닿지 못하는 함수가 남습니다. 장면에서는 제곱근 함수를 최소제곱으로 맞추며 두 재료의 오차를 견줍니다.

예를 들면, 📏 자로 길이를 재는 것과 같아요. 눈금이 촘촘히 끝없이 이어지면 어떤 길이든 가깝게 잴 수 있어요. 눈금이 1, 4, 9처럼 듬성하면 영원히 못 재는 길이가 남습니다.`,
        en: String.raw`Can we skip some powers and still approximate everything?

The test is the sum of the reciprocals of the exponents. If that sum grows forever, the ingredients are dense enough. If it stays finite, some function remains forever out of reach. The scene fits the square-root function by least squares and compares a dense set with a sparse one.

For example, think of measuring with a 📏 ruler. Marks packed endlessly close let you measure any length well. Marks that thin out like 1, 4, 9 leave some lengths unmeasurable forever.`,
      },
      tex: [
        String.raw`\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\} \text{ dense in } C[0,1] \iff \sum_{n} \frac{1}{\lambda_n} = \infty`,
        String.raw`N = 4, 6, 8: \|p_{\mathrm{dense}} - \sqrt{\cdot}\,\|_\infty = 0.1003 \to 0.0708 \to 0.0544`,
      ],
      prerequisites: ['stone-weierstrass', 'weierstrass-approx'],
      controls: [
        { kind: 'slider', key: 'N', label: { ko: '차수 N', en: 'Degree N' }, min: 2, max: 8, step: 1, init: 6 },
      ],
      problems: muntzSzaszProblems,
    },
  ],
};
