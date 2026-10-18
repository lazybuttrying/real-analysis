import type { ChapterMeta } from '../../contracts.ts';
import { problems as abelTheoremProblems } from './problems/abel-theorem';
import { problems as abelTestProblems } from './problems/abel-test';
import { problems as absoluteProblems } from './problems/absolute';
import { problems as cauchyProductProblems } from './problems/cauchy-product';
import { problems as baselProblems } from './problems/basel';
import { problems as betaFunctionProblems } from './problems/beta-function';
import { bohrMollerupProblems } from './problems/bohr-mollerup';
import { condensationProblems } from './problems/condensation';
import { problems as diniProblems } from './problems/dini';
import { problems as dirichletTestProblems } from './problems/dirichlet-test';
import { problems as eseriesProblems } from './problems/eseries';
import { eulerProductProblems } from './problems/euler-product';
import { eulerMascheroniProblems } from './problems/euler-mascheroni';
import { problems as gammaProblems } from './problems/gamma';
import { problems as geometricProblems } from './problems/geometric';
import { problems as grandiProblems } from './problems/grandi';
import { problems as harmonicProblems } from './problems/harmonic';
import { problems as improperProblems } from './problems/improper';
import { kummerTestProblems } from './problems/kummer-test';
import { problems as leibnizProblems } from './problems/leibniz';
import { problems as mTestProblems } from './problems/m-test';
import { problems as powerSeriesProblems } from './problems/power-series';
import { riemannRearrangementProblems } from './problems/riemann-rearrangement';
import { problems as rearrangementProblems } from './problems/rearrangement';
import { problems as raabeTestProblems } from './problems/raabe-test';
import { problems as stirlingProblems } from './problems/stirling';
import { problems as telescopingProblems } from './problems/telescoping';
import { problems as testsProblems } from './problems/tests';
import { problems as wallisProblems } from './problems/wallis';
import { problems as zeta4Problems } from './problems/zeta4';

/**
 * Pure data. Imports types plus the chapter's per-scene problems data modules
 * (./problems/* — data only, no code, models, views, or shell).
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 */
export const series: ChapterMeta = {
  id: 'series',
  title: { ko: '급수', en: 'Series' },
  summary: {
    ko: '무한급수의 수렴과 발산을 부분합의 움직임으로 확인합니다.',
    en: 'See how infinite series converge or diverge by watching their partial sums move.',
  },
  scenes: [
    {
      id: 'harmonic',
      title: { ko: '조화급수의 발산', en: 'The Harmonic Series Diverges' },
      order: 1,
      summary: {
        ko: String.raw`부분합 \(S_n\)이 \(\ln n + \gamma\)를 따라 아주 느리게, 그러나 끝없이 커지는 모습을 확인합니다.`,
        en: String.raw`The partial sums \(S_n\) follow \(\ln n + \gamma\) upward — very slowly, but without end.`,
      },
      tex: [String.raw`S_n=\sum_{k=1}^{n}\frac{1}{k}`, String.raw`S_n=\ln n+\gamma+o(1)`],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 100000, step: 1, init: 1000 },
        { kind: 'toggle', key: 'logX', label: { ko: 'x축 로그 눈금', en: 'Logarithmic x-axis' }, init: true },
      ],
problems: harmonicProblems,
    },
    {
      id: 'euler-mascheroni',
      title: { ko: '오일러-마스케로니 상수', en: 'The Euler\u2013Mascheroni Constant' },
      order: 2,
      summary: {
        ko: String.raw`조화수 \(H_n\)은 \(\ln n\)처럼 발산하지만, 그 차이 \(\gamma_n = H_n - \ln n\)은 \(\gamma \approx 0.5772\)로 수렴합니다 — 수렴하는 급수 \(\sum (\frac1n - \ln(1+\frac1n))\)가 그 비밀입니다.`,
        en: String.raw`The harmonic numbers \(H_n\) diverge like \(\ln n\), but their gap \(\gamma_n = H_n - \ln n\) settles at \(\gamma \approx 0.5772\) — the secret is the convergent series \(\sum (\frac1n - \ln(1+\frac1n))\).`,
      },
      tex: [
        String.raw`\gamma = \lim_{n\to\infty}(H_n - \ln n) \approx 0.5772`,
        String.raw`\gamma = \sum_{n\ge1}\left(\frac1n - \ln\!\left(1+\frac1n\right)\right)`,
      ],
      prerequisites: ['harmonic'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 200, step: 1, init: 50 },
      ],
      problems: eulerMascheroniProblems,
    },
    {
      id: 'basel',
      title: { ko: '바젤 문제', en: 'The Basel Problem' },
      order: 3,
      summary: {
        ko: String.raw`항 \(\frac{1}{n^2}\)을 3차원 막대로 쌓고 부분합의 계단이 \(\frac{\pi^2}{6}\) 평면에 닿지 못한 채 다가가는 모습을 확인합니다. \(\pi\)가 왜 등장하는지는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`Stack the terms \(\frac{1}{n^2}\) as 3D bars and watch the staircase of partial sums approach the plane at \(\frac{\pi^2}{6}\) without ever touching it. Why \(\pi\) appears at all is only sketched at the idea level.`,
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 14 }],
problems: baselProblems,
    },
    {
      id: 'euler-product',
      title: { ko: '오일러 곱 공식', en: 'The Euler Product' },
      order: 4,
      summary: {
        ko: String.raw`\(\zeta(s) = \sum_{n\ge 1} n^{-s}\)에 \((1-2^{-s})\)를 곱하면 짝수 항이 사라지고, \((1-3^{-s})\)를 곱하면 3의 배수가 사라집니다 — 체로 걸러내면 남는 것은 소수 위의 곱 \(\prod_p (1-p^{-s})^{-1}\)뿐입니다. 처음 \(k\)개 소수의 부분 곱이 \(\zeta(2) = \pi^2/6\)에 다가가는 모습을 확인합니다.`,
        en: String.raw`Multiplying \(\zeta(s) = \sum_{n\ge 1} n^{-s}\) by \((1-2^{-s})\) sieves out the even terms, then \((1-3^{-s})\) removes multiples of 3 — sieving leaves only the product over primes \(\prod_p (1-p^{-s})^{-1}\). Watch the partial product over the first \(k\) primes approach \(\zeta(2) = \pi^2/6\).`,
      },
      tex: [
        String.raw`\zeta(s) = \sum_{n=1}^{\infty}\frac{1}{n^s} = \prod_{p\ \mathrm{prime}}\frac{1}{1-p^{-s}} \qquad (s > 1)`,
        String.raw`\prod_p\frac{1}{1-p^{-2}} = \frac{\pi^2}{6}`,
      ],
      prerequisites: ['basel'],
      controls: [{ kind: 'slider', key: 'k', label: { ko: '소수 개수 k', en: 'Prime count k' }, min: 1, max: 15, step: 1, init: 6 }],
problems: eulerProductProblems,
    },
    {
      id: 'leibniz',
      title: { ko: '라이프니츠 급수', en: 'Leibniz Series' },
      order: 5,
      summary: {
        ko: String.raw`부분합이 \(\frac{\pi}{4}\)를 번갈아 넘고 밑돌며 조여드는 모습을 확인합니다. 이웃한 두 부분합 사이의 간격이 곧 오차의 상한입니다.`,
        en: String.raw`The partial sums overshoot and undershoot \(\frac{\pi}{4}\) in turn, closing in from both sides. The gap between two neighboring partial sums is exactly the error bound.`,
      },
      tex: [
        String.raw`\frac{\pi}{4}=1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots`,
        String.raw`\left|S_N-\frac{\pi}{4}\right|\le\frac{1}{2N+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 60, step: 1, init: 12 }],
problems: leibnizProblems,
    },
    {
      id: 'tests',
      title: { ko: '수렴 판정법 도구상자', en: 'Convergence Tests Toolbox' },
      order: 6,
      summary: {
        ko: String.raw`비율 \(r_k = a_{k+1}/a_k\)가 극한 \(L < 1\)로 모이면 급수가 수렴합니다 — 두 급수에서 비율이 \(0\)과 \(\frac{1}{2}\)로 내려가는 모습을, 비교 판정법에서는 \(\frac{1}{k^2+1}\)이 \(\frac{1}{k^2}\) 아래에 깔리는 모습을 확인합니다.`,
        en: String.raw`When the ratio \(r_k = a_{k+1}/a_k\) settles to a limit \(L < 1\), the series converges — watch the ratios dive to \(0\) and \(\frac{1}{2}\) in two series, and \(\frac{1}{k^2+1}\) tuck itself under \(\frac{1}{k^2}\) for the comparison test.`,
      },
      tex: [
        String.raw`r_k=\frac{a_{k+1}}{a_k}\to L<1\ \Rightarrow\ \sum a_k\ \text{converges}`,
        String.raw`\frac{1}{k^2+1}<\frac{1}{k^2},\quad\sum_{k=1}^{\infty}\frac{1}{k^2}=\frac{\pi^2}{6}`,
      ],
      prerequisites: ['leibniz'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '급수', en: 'Series' }, options: ['factorial', 'n-over-2n', 'inv-square-plus'], init: 'factorial' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 30, step: 1, init: 12 },
      ],
problems: testsProblems,
    },
    {
      id: 'raabe-test',
      title: { ko: '라베 판정법', en: "Raabe's Test" },
      order: 7,
      summary: {
        ko: String.raw`비율이 1로 가서 비율 판정법이 항복할 때, 한 단계 더 깊이 본 양 \(R_n = n(a_n/a_{n+1} - 1)\)이 1 위/아래 어디에 안착하는지로 수렴을 가릅니다.`,
        en: String.raw`When the ratio drifts to 1 and the ratio test surrenders, the finer quantity \(R_n = n(a_n/a_{n+1} - 1)\) settles above or below 1 and decides convergence.`,
      },
      tex: [
        String.raw`L=\\lim_{n\\to\\infty}n\\left(\\frac{a_n}{a_{n+1}}-1\\right)`,
        String.raw`L>1\\Rightarrow\\sum a_n\\ \\text{converges},\\quad L<1\\Rightarrow\\ \text{diverges}`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['central', 'log'], init: 'central' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Terms n' }, min: 10, max: 500, step: 10, init: 100 },
      ],
problems: raabeTestProblems,
    },
    {
      id: 'kummer-test',
      title: { ko: '쿰머 판정법', en: "Kummer's Test" },
      order: 8,
      summary: {
        ko: String.raw`양의 보조수열 \((p_n)\)로 비율을 가중하면 \(K_n = p_n\frac{a_n}{a_{n+1}} - p_{n+1}\)이 0 위/아래 어디에 머무는지로 수렴을 가릅니다. \(p_n = 1\)이면 비율 판정법, \(p_n = n\)이면 라베 판정법이 됩니다.`,
        en: String.raw`Weighting the ratio by a positive auxiliary sequence \((p_n)\), the sign of \(K_n = p_n\frac{a_n}{a_{n+1}} - p_{n+1}\) decides convergence. \(p_n = 1\) recovers the ratio test, \(p_n = n\) recovers Raabe's test.`,
      },
      tex: [
        String.raw`K_n := p_n\frac{a_n}{a_{n+1}} - p_{n+1} \ge c > 0 \ \Rightarrow\ \sum a_n\ \text{converges}`,
        String.raw`K_n \le 0,\ \sum\frac{1}{p_n} = \infty \ \Rightarrow\ \sum a_n\ \text{diverges}`,
      ],
      prerequisites: ['raabe-test', 'tests'],
      controls: [
        { kind: 'select', key: 'pKind', label: { ko: 'p_n', en: 'p_n' }, options: ['p1', 'pn', 'pnlogn'], init: 'pn' },
        { kind: 'select', key: 'aSel', label: { ko: '매개변수 a', en: 'Parameter a' }, options: ['a2', 'ahalf'], init: 'a2' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Terms n' }, min: 10, max: 500, step: 10, init: 100 },
      ],
problems: kummerTestProblems,
    },
    {
      id: 'condensation',
      title: { ko: '코시 응축 판정법', en: 'Cauchy Condensation Test' },
      order: 9,
      summary: {
        ko: String.raw`\(a_n\)의 항들을 \([2^n, 2^{n+1})\) 블록으로 묶어 보세요 — 블록 합이 응축 항 \(2^n a_{2^n}\) 사이에 끼면서, 원래 급수와 응축된 급수가 운명을 같이합니다.`,
        en: String.raw`Group the terms \(a_n\) into blocks \([2^n, 2^{n+1})\): each block sum is sandwiched between condensed terms \(2^n a_{2^n}\), so the original and condensed series share their fate.`,
      },
      tex: [
        String.raw`2^n a_{2^{n+1}} \le \sum_{k=2^n}^{2^{n+1}-1} a_k \le 2^n a_{2^n}`,
        String.raw`\sum_{n\ge 1}\frac{1}{n^p}\ \text{converges} \iff p>1`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '수열', en: 'Sequence' }, options: ['inv-n', 'inv-n2', 'inv-n-logn'], init: 'inv-n' },
        { kind: 'slider', key: 'block', label: { ko: '블록 번호 n', en: 'Block index n' }, min: 0, max: 6, step: 1, init: 2 },
      ],
      problems: condensationProblems,
    },
    {
      id: 'power-series',
      title: { ko: '멱급수와 수렴반경', en: 'Power Series and Radius of Convergence' },
      order: 10,
      summary: {
        ko: String.raw`멱급수 \(\sum a_n x^n\)은 반경 \(R\) 안에서는 절대 수렴하고 밖에서는 발산합니다 — 세 가지 전형적인 급수로 수렴반경을 확인하고, 경계 \(\lvert x\rvert = R\)은 점마다 따로 판정합니다.`,
        en: String.raw`A power series \(\sum a_n x^n\) converges absolutely inside its radius \(R\) and diverges outside — watch three archetypal series pin down their radii, and see why the boundary \(\lvert x\rvert = R\) must be decided case by case.`,
      },
      tex: [
        String.raw`\frac{1}{R}=\limsup_{n\to\infty}\lvert a_n\rvert^{1/n}`,
        String.raw`\sum_{n=0}^{\infty}\frac{x^n}{n!}\ \text{has}\ R=\infty,\quad \sum_{n=0}^{\infty}n!\,x^n\ \text{has}\ R=0,\quad \sum_{n=0}^{\infty}x^n\ \text{has}\ R=1`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '급수', en: 'Series' }, options: ['exp', 'factorial', 'geom'], init: 'exp' },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: -3, max: 3, step: 0.1, init: 1 },
        { kind: 'slider', key: 'n', label: { ko: '항의 개수 N', en: 'Terms N' }, min: 1, max: 30, step: 1, init: 15 },
      ],
      problems: powerSeriesProblems,
    },
    {
      id: 'abel-theorem',
      title: { ko: '아벨 정리', en: "Abel's Theorem" },
      order: 11,
      summary: {
        ko: String.raw`수렴급수 \(\sum a_n \to S\)에 대해 멱급수 \(\sum a_n x^n\)은 \(x \to 1^{-}\)에서 \(S\)로 다가갑니다 — 아벨 정리. 발산하는 그란디 급수도 이 한계에서는 \(\frac{1}{2}\)를 가리키지만, 그것은 급수의 "합"이 아니라 Abel 합입니다.`,
        en: String.raw`For a convergent series \(\sum a_n \to S\), the power series \(\sum a_n x^n\) approaches \(S\) as \(x \to 1^{-}\) — Abel's theorem. Even the divergent Grandi series points to \(\frac{1}{2}\) in this limit, but that is the Abel sum, never "the sum" of the series.`,
      },
      tex: [
        String.raw`\sum a_n \to S \ \Rightarrow\ \lim_{x\to 1^{-}}\sum a_n x^n = S`,
        String.raw`\sum_{n=0}^{\infty}(-1)^n x^n = \frac{1}{1+x} \xrightarrow[x\to 1^{-}]{} \frac{1}{2}`,
      ],
      prerequisites: ['power-series', 'grandi'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '급수', en: 'Series' }, options: ['grandi', 'alt-harmonic'], init: 'grandi' },
        { kind: 'slider', key: 'x', label: { ko: 'x (1의 왼쪽에서 접근)', en: 'x (approaching 1 from below)' }, min: 0, max: 0.99, step: 0.01, init: 0.8 },
        { kind: 'slider', key: 'n', label: { ko: '부분합 항 수 N', en: 'Partial sum terms N' }, min: 1, max: 200, step: 1, init: 40 },
      ],
      problems: abelTheoremProblems,
    },
    {
      id: 'eseries',
      title: { ko: 'e로 가는 두 길', en: 'Two Roads to e' },
      order: 12,
      summary: {
        ko: String.raw`복리 \((1+\frac{1}{n})^n\)과 급수 \(\sum_{k=0}^{\infty} \frac{1}{k!}\)가 \(e\)에 다가가는 속도를 견주어 확인합니다. 팩토리얼 급수가 압도적으로 빠릅니다.`,
        en: String.raw`Compare how fast compound growth \((1+\frac{1}{n})^n\) and the series \(\sum_{k=0}^{\infty} \frac{1}{k!}\) approach \(e\). The factorial series wins by a landslide.`,
      },
      tex: [String.raw`e=\sum_{k=0}^{\infty}\frac{1}{k!}`, String.raw`e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '단계 수 n', en: 'Steps n' }, min: 1, max: 30, step: 1, init: 10 }],
problems: eseriesProblems,
    },
    {
      id: 'telescoping',
      title: { ko: '망원급수', en: 'Telescoping Series' },
      order: 13,
      summary: {
        ko: String.raw`각 항을 \(\frac{1}{n} - \frac{1}{n+1}\)로 쪼개면 이웃끼리 서로 지워지고 처음의 1과 사라져 가는 꼬리만 남는 모습을 확인합니다.`,
        en: String.raw`Split each term into \(\frac{1}{n} - \frac{1}{n+1}\) and the neighbors cancel each other, leaving only the very first 1 and a vanishing tail.`,
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1`,
        String.raw`\frac{1}{n(n+1)}=\frac{1}{n}-\frac{1}{n+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 24, step: 1, init: 10 }],
problems: telescopingProblems,
    },
    {
      id: 'geometric',
      title: { ko: '기하급수: 정사각형 채우기', en: 'Geometric Series: Filling the Square' },
      order: 14,
      summary: {
        ko: '단위 정사각형을 남은 부분의 절반씩 채워 나가면 빈틈이 매 단계 절반으로 줄며 합이 1이 되는 모습을 확인합니다.',
        en: 'Fill a unit square by always taking half of what remains: the gap halves at every step and the total becomes 1.',
      },
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 단계 n', en: 'Subdivision steps n' }, min: 1, max: 12, step: 1, init: 6 }],
problems: geometricProblems,
    },
    {
      id: 'wallis',
      title: { ko: '월리스 곱', en: 'Wallis Product' },
      order: 15,
      summary: {
        ko: String.raw`유리수 인수들을 하나씩 곱해 나갈수록 실행 곱이 \(\frac{\pi}{2}\) 위아래로 흔들리며 조여드는 모습을 확인합니다.`,
        en: String.raw`Multiply the rational factors in one at a time and watch the running product swing above and below \(\frac{\pi}{2}\), closing in as the swings shrink.`,
      },
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '인수 쌍의 수 n', en: 'Factor pairs n' }, min: 1, max: 40, step: 1, init: 12 }],
problems: wallisProblems,
    },
    {
      id: 'stirling',
      title: { ko: '스털링 근사', en: "Stirling's Approximation" },
      order: 16,
      summary: {
        ko: String.raw`로그 눈금에서 \(n!\)와 스털링 근사가 거의 겹쳐지고 상대오차가 대략 \(\frac{1}{12n}\)으로 줄어드는 모습을 확인합니다. \(\pi\)가 들어오는 경로는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`On a log scale, \(n!\) and the Stirling approximation nearly coincide, and the relative error shrinks like \(\frac{1}{12n}\). Where \(\pi\) enters is only sketched at the idea level.`,
      },
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 20 }],
problems: stirlingProblems,
    },
    {
      id: 'gamma',
      title: { ko: '감마함수', en: 'The Gamma Function' },
      order: 17,
      summary: {
        ko: String.raw`팩토리얼을 실수로 늘인 함수 — \(\Gamma(x+1) = x\Gamma(x)\)라서 \(\Gamma(n+1) = n!\)입니다. \(x > 0\)에서 이상적분이 수렴함을 확인합니다.`,
        en: String.raw`The factorial stretched to real arguments — \(\Gamma(x+1) = x\Gamma(x)\), so \(\Gamma(n+1) = n!\). Watch the improper integral converge for \(x > 0\).`,
      },
      tex: [
        String.raw`\Gamma(x) = \int_0^\infty t^{x-1} e^{-t}\,dt \quad (x > 0)`,
        String.raw`\Gamma(x+1) = x\,\Gamma(x)`,
      ],
      prerequisites: ['stirling'],
      controls: [{ kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: 0.1, max: 4, step: 0.05, init: 2 }],
problems: gammaProblems,
    },
    {
      id: 'beta-function',
      title: { ko: '베타 함수', en: 'The Beta Function' },
      order: 18,
      summary: {
        ko: String.raw`\\(t^{p-1}(1-t)^{q-1}\\) 곡선 아래 넓이가 베타 함수 — \\(p\\), \\(q\\) 슬라이더로 모양이 바뀌는 모습을 보세요. 감마함수와의 관계 \\(B(p,q) = \\Gamma(p)\\Gamma(q)/\\Gamma(p+q)\\)도 함께 다룹니다.`,
        en: String.raw`The area under \\(t^{p-1}(1-t)^{q-1}\\) is the beta function — morph its shape with the \\(p\\), \\(q\\) sliders. Also covers \\(B(p,q) = \\Gamma(p)\\Gamma(q)/\\Gamma(p+q)\\), the bridge to the gamma function.`,
      },
      tex: [
        String.raw`B(p,q)=\\int_0^1 t^{p-1}(1-t)^{q-1}\\,dt\\quad(p,q>0)`,
        String.raw`B(p,q)=\\frac{\\Gamma(p)\\Gamma(q)}{\\Gamma(p+q)}`,
      ],
      prerequisites: ['gamma'],
      controls: [
        { kind: 'slider', key: 'p', label: { ko: 'p', en: 'p' }, min: 0.2, max: 5, step: 0.1, init: 2 },
        { kind: 'slider', key: 'q', label: { ko: 'q', en: 'q' }, min: 0.2, max: 5, step: 0.1, init: 3 },
      ],
problems: betaFunctionProblems,
    },
    {
      id: 'bohr-mollerup',
      title: { ko: '보어-몰레루프 정리', en: 'Bohr–Mollerup Theorem' },
      order: 19,
      summary: {
        ko: String.raw`\(f(1) = 1\)과 \(f(x+1) = x\,f(x)\)만으로는 팩토리얼의 연속 확장이 하나로 정해지지 않습니다 — impostor \(\Gamma(x)(1 + a\sin 2\pi x)\)가 모든 정수점에서 \(\Gamma\)와 완전히 일치하면서도 살아남기 때문입니다. secant 테스트로 로그볼록성이 \(\Gamma\)의 진짜 지문임을 직접 확인하세요.`,
        en: String.raw`\(f(1) = 1\) and \(f(x+1) = x\,f(x)\) do not pin down the continuous extension of the factorial — the impostor \(\Gamma(x)(1 + a\sin 2\pi x)\) matches \(\Gamma\) at every integer and survives. Watch the secant test expose log-convexity as \(\Gamma\)'s true fingerprint.`,
      },
      tex: [
        String.raw`f(1) = 1`,
        String.raw`f(x+1) = x\,f(x) \quad (x > 0)`,
        String.raw`\ln f \text{ is convex on } (0,\infty)`,
        String.raw`f = \Gamma`,
      ],
      prerequisites: ['gamma'],
      controls: [
        { kind: 'slider', key: 'amp', label: { ko: '진폭 a', en: 'Amplitude a' }, min: 0, max: 0.5, step: 0.05, init: 0.3 },
        { kind: 'slider', key: 'probe', label: { ko: '현 테스트 위치 x₀', en: 'Secant probe x₀' }, min: 0.2, max: 1.8, step: 0.1, init: 0.6 },
      ],
problems: bohrMollerupProblems,
    },
    {
      id: 'grandi',
      title: { ko: '그란디 급수', en: 'Grandi Series' },
      order: 20,
      summary: {
        ko: String.raw`부분합이 1과 0을 영원히 오가므로 이 급수에는 합이 없습니다. \(\frac{1}{2}\)는 부분합들의 평균(체사로 평균)일 뿐, 급수의 합이 아닙니다.`,
        en: String.raw`The partial sums bounce between 1 and 0 forever, so this series has no sum. \(\frac{1}{2}\) is only the average of the partial sums (the Cesàro mean), not a sum of the series.`,
      },
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 16 }],
problems: grandiProblems,
    },
    {
      id: 'zeta4',
      title: { ko: 'ζ(4)와 짝수 거듭제곱', en: 'ζ(4) and Even Powers' },
      order: 21,
      summary: {
        ko: String.raw`\(\frac{1}{n^4}\)의 부분합이 \(\frac{\pi^4}{90}\)에 빠르게 닿는 모습과, 짝수 거듭제곱마다 \(\zeta\)값이 \(\pi\)의 거듭제곱으로 닫히는 패턴을 확인합니다.`,
        en: String.raw`The partial sums of \(\frac{1}{n^4}\) reach \(\frac{\pi^4}{90}\) quickly — and at every even power, the \(\zeta\) value closes into a power of \(\pi\).`,
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}`,
        String.raw`\zeta(2)=\frac{\pi^2}{6},\quad \zeta(6)=\frac{\pi^6}{945}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 20, step: 1, init: 8 }],
problems: zeta4Problems,
    },
    {
      id: 'rearrangement',
      title: { ko: '재배열 정리', en: 'Rearranging Changes the Sum' },
      order: 22,
      summary: {
        ko: String.raw`조건수렴 급수는 순서를 바꾸면 합이 바뀝니다 — \(\ln 2 \approx 0.6931\)이 \(\frac{3}{2}\ln 2 \approx 1.0397\)로. 라이프니츠 장면의 짝꿍입니다.`,
        en: String.raw`Reordering a conditionally convergent series changes its sum — \(\ln 2 \approx 0.6931\) becomes \(\frac{3}{2}\ln 2 \approx 1.0397\). Twin of the Leibniz scene.`,
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n} = \ln 2 \xrightarrow{(+,+,-)} \frac{3}{2}\ln 2`],
      prerequisites: ['leibniz'],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms' }, min: 6, max: 300, step: 1, init: 60 }],
problems: rearrangementProblems,
    },
    {
      id: 'absolute',
      title: { ko: '절대수렴 정리', en: 'Absolute Convergence' },
      order: 23,
      summary: {
        ko: String.raw`절댓값을 씌운 급수가 수렴하면 원래 급수도 수렴합니다 — 두 부분합 곡선 \(S_n\)과 \(T_n\)이 함께 안착하는 모습과, 조화급수처럼 절댓값은 발산해도 부호 덕분에 수렴하는 경우를 견주어 확인합니다.`,
        en: String.raw`If the absolute-value series converges, so does the original — compare the two partial-sum walks \(S_n\) and \(T_n\) settling together against the harmonic-like case where the signs rescue a divergent absolute series.`,
      },
      tex: [
        String.raw`\sum|a_k|\ \text{converges}\ \Rightarrow\ \sum a_k\ \text{converges}`,
        String.raw`\sum_{k=1}^{\infty}\frac{(-1)^k}{k^2}=-\frac{\pi^2}{12},\quad\sum_{k=1}^{\infty}\frac{(-1)^k}{k}=-\ln 2`,
      ],
      prerequisites: ['rearrangement'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '급수', en: 'Series' }, options: ['abs', 'cond'], init: 'abs' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 200, step: 1, init: 60 },
      ],
problems: absoluteProblems,
    },
    {
      id: 'riemann-rearrangement',
      title: { ko: '리만 재배열 정리', en: "Riemann's Rearrangement Theorem" },
      order: 24,
      summary: {
        ko: String.raw`조건수렴 급수는 재배열로 어떤 실수든 만들 수 있습니다 — 탐욕 블록 규칙이 교대조화급수(원래 합 \(\ln 2\))를 당신이 고른 목표로 몰아넣는 과정을 직접 보세요.`,
        en: String.raw`A conditionally convergent series can be rearranged to sum to any real number — watch the greedy block rule steer the alternating harmonic series (which sums to \(\ln 2\) in its natural order) onto a target of your choice.`,
      },
      tex: [
        String.raw`\sum a_n\ \text{converges conditionally}\ \Longrightarrow\ \forall\, s\in\mathbb{R}\ \ \exists\ \text{rearrangement with sum } s`,
      ],
      prerequisites: ['rearrangement', 'absolute'],
      controls: [
        { kind: 'slider', key: 'target', label: { ko: '목표 합 s', en: 'Target sum s' }, min: -2, max: 3, step: 0.1, init: 1.0 },
        { kind: 'slider', key: 'terms', label: { ko: '항의 개수', en: 'Number of terms' }, min: 20, max: 400, step: 20, init: 120 },
      ],
problems: riemannRearrangementProblems,
    },
    {
      id: 'cauchy-product',
      title: { ko: '코시 곱', en: 'The Cauchy Product' },
      order: 25,
      summary: {
        ko: String.raw`\((\sum a_n)(\sum b_n) = \sum c_n\), \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\) — 대각선으로 격자를 휩쓰는 합. 메르텐스 정리(한쪽이 절대수렴하면 곱이 성립)와, 둘 다 조건수렴일 때 깨지는 반례를 봅니다.`,
        en: String.raw`\((\sum a_n)(\sum b_n) = \sum c_n\) with \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\) — sweeping the lattice along diagonals. Mertens' theorem (absolute convergence on one side saves the product) and the counterexample when both converge only conditionally.`,
      },
      tex: [
        String.raw`c_n = \sum_{k=0}^{n} a_k b_{n-k}`,
        String.raw`\sum |a_n| < \infty,\ \sum b_n = B\ \Rightarrow\ \sum c_n = AB`,
      ],
      prerequisites: ['absolute', 'rearrangement'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 30, step: 1, init: 10 },
        { kind: 'select', key: 'pair', label: { ko: '급수 쌍', en: 'Series pair' }, options: ['exp', 'alternating'], init: 'exp' },
      ],
      problems: cauchyProductProblems,
    },
    {
      id: 'dirichlet-test',
      title: { ko: '디리클레 판정법', en: "Dirichlet's Test" },
      order: 26,
      summary: {
        ko: String.raw`부분합이 \(1/|\sin(x/2)|\) 안에 갇혀 흔들리는 \(\sin(kx)\)와 \(0\)으로 가라앉는 \(1/n\)이 만나 \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\)이 수렴합니다 — 디리클레 판정법.`,
        en: String.raw`The partial sums of \(\sin(kx)\) wobble, trapped inside \(1/|\sin(x/2)|\), and the \(1/n\) weight sinking to \(0\) tames them into the convergent series \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\) — Dirichlet's test.`,
      },
      tex: [
        String.raw`\sum_{k=1}^{N}\sin(kx) = \frac{\sin\frac{Nx}{2}\,\sin\frac{(N+1)x}{2}}{\sin\frac{x}{2}},\quad \left|\sum_{k=1}^{N}\sin(kx)\right| \le \frac{1}{|\sin(x/2)|}`,
        String.raw`\sum_{n=1}^{\infty}\frac{\sin(nx)}{n} = \frac{\pi-x}{2},\quad x \in (0, 2\pi)`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'slider', key: 'terms', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 1, max: 80, step: 1, init: 30 },
        { kind: 'slider', key: 'x', label: { ko: 'x 값', en: 'x value' }, min: 0.2, max: 3.0, step: 0.01, init: 1.0 },
      ],
      problems: dirichletTestProblems,
    },
    {
      id: 'abel-test',
      title: { ko: '아벨 판정법', en: "Abel's Test" },
      order: 27,
      summary: {
        ko: String.raw`\\(\\sum a_n\\)이 수렴하고 \\((b_n)\\)이 단조·유계이면 \\(\\sum a_n b_n\\)도 수렴합니다 — 디리클레 판정법의 짝꿍. \\((b_n)\\)이 0으로 가지 않아도 된다는 점이 다릅니다.`,
        en: String.raw`If \\(\\sum a_n\\) converges and \\((b_n)\\) is monotone and bounded, then \\(\\sum a_n b_n\\) converges — the companion to Dirichlet's test. The difference: \\((b_n)\\) need not tend to 0.`,
      },
      tex: [
        String.raw`\\sum a_n\\ \\text{converges},\\ (b_n)\\ \\text{monotone bounded}\\ \\Rightarrow\\ \\sum a_n b_n\\ \\text{converges}`,
        String.raw`\\sum_{k=m}^{n}a_k b_k = A_n b_{n+1} - A_{m-1}b_m + \\sum_{k=m}^{n}A_k(b_k-b_{k+1})`,
      ],
      prerequisites: ['dirichlet-test'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['shifted', 'scaled'], init: 'shifted' },
        { kind: 'slider', key: 'n', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 10, max: 500, step: 10, init: 120 },
      ],
problems: abelTestProblems,
    },
    {
      id: 'm-test',
      title: { ko: 'M-판정법', en: 'The Weierstrass M-Test' },
      order: 28,
      summary: {
        ko: String.raw`각 항을 모든 \(x\)에서 누르는 수열 \(M_n\)이 있으면 급수는 균등수렴합니다 — \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2} =: M_n\), \(\sum M_n = \frac{\pi^2}{6}\)이므로 부분합 오차 띠가 전체 \(x\) 구간에서 한꺼번에 좁아집니다.`,
        en: String.raw`If a majorant \(M_n\) dominates every term at all \(x\) and \(\sum M_n\) converges, the series converges uniformly — here \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2} =: M_n\) and \(\sum M_n = \frac{\pi^2}{6}\), so the partial-sum error band tightens across the whole \(x\)-interval at once.`,
      },
      tex: [
        String.raw`|f_n(x)| \le M_n\ \forall x,\quad \sum M_n<\infty\ \Rightarrow\ \sum f_n\ \text{converges uniformly}`,
        String.raw`\sup_x|S(x)-S_N(x)| \le \sum_{k>N}\frac{1}{k^2},\quad N=8:\ \approx 0.1175`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'slider', key: 'terms', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 1, max: 40, step: 1, init: 8 },
      ],
      problems: mTestProblems,
    },
    {
      id: 'dini',
      title: { ko: '디니 정리', en: "Dini's Theorem" },
      order: 29,
      summary: {
        ko: String.raw`컴팩트 집합 위에서는 단조인 연속함수열의 점별수렴이 균등수렴이 됩니다 — 열린 덮개 \(E_n\)들의 유한 부분덮개가 한 번에 잡아줍니다. M-판정법의 쌍대 도구.`,
        en: String.raw`On a compact set, a monotone sequence of continuous functions converging pointwise converges uniformly — a finite subcover of the open sets \(E_n\) grabs them all at once. The twin tool of the M-test.`,
      },
      tex: [
        String.raw`f_n \uparrow f\ \text{continuous on compact } K \Rightarrow f_n \to f\ \text{uniformly}`,
        String.raw`\max_{[0,1]}\left|x - \frac{nx}{n+1}\right| = \frac{1}{n+1}`,
      ],
      prerequisites: ['m-test'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항 번호 n', en: 'Index n' }, min: 1, max: 60, step: 1, init: 8 },
        { kind: 'select', key: 'domain', label: { ko: '정의역', en: 'Domain' }, options: ['compact', 'noncompact'], init: 'compact' },
      ],
      problems: diniProblems,
    },
    {
      id: 'improper',
      title: { ko: '이상적분', en: 'Improper Integrals' },
      order: 30,
      summary: {
        ko: String.raw`\(\int_1^\infty \frac{dx}{x^p}\)는 \(p > 1\)일 때만 수렴하고, \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\)처럼 특이점 쪽도 다룹니다 — p급수와의 쌍대 장면.`,
        en: String.raw`\(\int_1^\infty \frac{dx}{x^p}\) converges only for \(p > 1\), plus the singular kind \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\) — the twin of the p-series scene.`,
      },
      tex: [
        String.raw`\int_1^{\infty}\frac{dx}{x^p} = \frac{1}{p-1}\ \ (p>1)`,
        String.raw`\int_0^1\frac{dx}{\sqrt{x}} = 2`,
      ],
      prerequisites: ['harmonic'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '적분 종류', en: 'Integral kind' }, options: ['tail', 'singular'], init: 'tail' },
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 0.5, max: 2, step: 0.01, init: 1 },
        { kind: 'slider', key: 'R', label: { ko: '위끝 R', en: 'Upper limit R' }, min: 2, max: 50, step: 1, init: 10 },
        { kind: 'slider', key: 'eps', label: { ko: '아래끝 ε', en: 'Lower limit ε' }, min: 0.001, max: 0.5, step: 0.001, init: 0.01 },
      ],
problems: improperProblems,
    }
  ],
};
