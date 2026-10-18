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
        ko: String.raw`연속함수들의 집합이 균등수렴하는 부분수열을 품을 조건 — 균등 유계와 동등연속이면 대각선 논증으로 균등수렴 부분수열을 뽑아냅니다. \(x^n\)은 왜 안 되는지 대비해 보세요.`,
        en: String.raw`When does a family of continuous functions hide a uniformly convergent subsequence? Uniform boundedness plus equicontinuity lets the diagonal argument extract one. Contrast with \(x^n\), where it fails.`,
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
        ko: String.raw`\([0,1]\) 위의 연속함수는 다항식으로 균등하게 근사됩니다 — 번스타인 다항식 \(B_n(f)\)가 \(f\)에 다가가는 모습을 \(n\)을 키우며 확인합니다. 수렴 증명의 세부 추정은 아이디어 수준에서만 봅니다.`,
        en: String.raw`Every continuous function on \([0,1]\) is uniformly approximable by polynomials — watch the Bernstein polynomials \(B_n(f)\) close in on \(f\) as \(n\) grows. The fine estimates of the convergence proof are sketched at the idea level.`,
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
        ko: String.raw`점들을 분리하고 상수를 포함하는 부분대수는 균등하게 조밀합니다 — 원 위의 삼각다항식이 삼각파 \(|x|\)에 다가가며 대수적 다항식 없이 조밀성을 보여줍니다.`,
        en: String.raw`A subalgebra that separates points and contains the constants is uniformly dense — trigonometric polynomials on the circle close in on the triangle wave \(|x|\), with no algebraic polynomial in sight.`,
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
        ko: String.raw`\(\sqrt{x}\)를 최소제곱으로 근사하며 확인합니다 — 지수 \(\lambda_n = n\)인 조밀 기저 \(\{1, x, \ldots, x^N\}\)의 오차는 \(0.1003 \to 0.0708 \to 0.0544\)로 줄지만, \(\sum \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\)인 희소 기저 \(\{1, x, x^4, \ldots, x^{N^2}\}\)의 오차는 \(0.16\) 부근에 묶입니다.`,
        en: String.raw`Approximate \(\sqrt{x}\) by least squares and watch the theorem decide: the dense basis \(\{1, x, \ldots, x^N\}\) (\(\lambda_n = n\), \(\sum \frac{1}{n} = \infty\)) shrinks its error \(0.1003 \to 0.0708 \to 0.0544\), while the sparse basis \(\{1, x, x^4, \ldots, x^{N^2}\}\) (\(\sum \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\)) stays stuck near \(0.16\).`,
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
