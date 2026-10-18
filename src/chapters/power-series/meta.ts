import type { ChapterMeta } from '../../contracts.ts';
import { hadamardGapProblems } from '../series/problems/hadamard-gap';
import { problems as abelTheoremProblems } from '../series/problems/abel-theorem';
import { problems as absoluteProblems } from '../series/problems/absolute';
import { problems as cauchyProductProblems } from '../series/problems/cauchy-product';
import { problems as eseriesProblems } from '../series/problems/eseries';
import { problems as powerSeriesProblems } from '../series/problems/power-series';
import { problems as rearrangementProblems } from '../series/problems/rearrangement';
import { problems as zeta4Problems } from '../series/problems/zeta4';
import { riemannRearrangementProblems } from '../series/problems/riemann-rearrangement';
import { tauberProblems } from '../series/problems/tauber';

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
export const powerSeries: ChapterMeta = {
  id: 'power-series',
  title: { ko: '거듭제곱급수', en: 'Power Series' },
  summary: {
    ko: '수렴반경 안의 세계 — 아벨 정리와 타우버 정리, 급수의 재배열과 코시 곱을 다룹니다.',
    en: 'Inside the radius of convergence — Abel and Tauber theorems, rearrangements, Cauchy products.',
  },
  scenes: [
    {
      id: 'power-series',
      title: { ko: '멱급수와 수렴반경', en: 'Power Series and Radius of Convergence' },
      order: 1,
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
      id: 'hadamard-gap',
      title: { ko: 'Hadamard 간극 정리', en: 'Hadamard Gap Theorem' },
      order: 2,
      summary: {
        ko: String.raw`\(S_N(z) = \sum_{k=0}^{N} z^{2^k}\) (간극비 정확히 2): \(r \in \{0.90, 0.95, 0.99\}\)에 대해 \(|S_N(r e^{i\theta})|\)를 그리면 \(N\)이 커질수록 봉우리가 점점 더 많은 각도에서 솟아오릅니다 — 수렴반경이 정확히 1인 간극 급수는 단위원 위의 모든 점에서 특이점이 됩니다. 간극 없는 대조군 \(\sum z^k/(k+1)^2\)는 얌전합니다.`,
        en: String.raw`\(S_N(z) = \sum_{k=0}^{N} z^{2^k}\) (gap ratio exactly 2): plotting \(|S_N(r e^{i\theta})|\) for \(r \in \{0.90, 0.95, 0.99\}\), spikes erupt at more and more angles as \(N\) grows — a gappy series with radius exactly 1 is singular at every point of the unit circle. The gap-free contrast \(\sum z^k/(k+1)^2\) stays calm.`,
      },
      tex: [
        String.raw`\frac{n_{k+1}}{n_k} = \frac{2^{k+1}}{2^k} = 2 > 1, \qquad \frac{1}{R} = \limsup_{n\to\infty} |a_n|^{1/n} = 1`,
        String.raw`\max_\theta |S_{12}(0.99\,e^{i\theta})| \approx 6.3139`,
      ],
      prerequisites: ['power-series'],
      controls: [
        { kind: 'slider', key: 'N', label: { ko: '부분합 차수 N', en: 'Partial-sum degree N' }, min: 1, max: 12, step: 1, init: 6 },
      ],
      problems: hadamardGapProblems,
    },
    {
      id: 'abel-theorem',
      title: { ko: '아벨 정리', en: "Abel's Theorem" },
      order: 3,
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
      id: 'tauber',
      title: { ko: '타우버 정리', en: "Tauber's Theorem" },
      order: 4,
      summary: {
        ko: String.raw`Abel 합 \(\frac{1}{2}\)을 갖는 그란디 급수는 발산합니다 — \(|n\,a_n| = n\)이라 가설 \(a_n = o(1/n)\)이 깨지기 때문입니다. \(d_n = \frac{(-1)^n}{(n+1)\ln(n+2)}\)은 가설을 만족하고, 그 Abel 합 곡선은 보통 합에 닿습니다 — 타우버 정리.`,
        en: String.raw`Grandi's series has Abel sum \(\frac{1}{2}\) yet diverges — because \(|n\,a_n| = n\) breaks the hypothesis \(a_n = o(1/n)\). The series \(d_n = \frac{(-1)^n}{(n+1)\ln(n+2)}\) satisfies it, and its Abel-sum curve reaches the ordinary sum — Tauber's theorem.`,
      },
      tex: [
        String.raw`A(r) = \sum a_n r^n \xrightarrow[r\to 1^{-}]{} L,\ a_n = o(1/n)\ \Rightarrow\ \sum a_n = L`,
        String.raw`\sum_{n=0}^{\infty}(-1)^n r^n = \frac{1}{1+r} \xrightarrow[r\to 1^{-}]{} \frac{1}{2}`,
      ],
      prerequisites: ['abel-theorem', 'grandi'],
      controls: [
        { kind: 'slider', key: 'R', label: { ko: 'r × 100 (R)', en: 'r × 100 (R)' }, min: 50, max: 99, step: 1, init: 90 },
      ],
      problems: tauberProblems,
    },
    {
      id: 'eseries',
      title: { ko: 'e로 가는 두 길', en: 'Two Roads to e' },
      order: 5,
      summary: {
        ko: String.raw`복리 \((1+\frac{1}{n})^n\)과 급수 \(\sum_{k=0}^{\infty} \frac{1}{k!}\)가 \(e\)에 다가가는 속도를 견주어 확인합니다. 팩토리얼 급수가 압도적으로 빠릅니다.`,
        en: String.raw`Compare how fast compound growth \((1+\frac{1}{n})^n\) and the series \(\sum_{k=0}^{\infty} \frac{1}{k!}\) approach \(e\). The factorial series wins by a landslide.`,
      },
      tex: [String.raw`e=\sum_{k=0}^{\infty}\frac{1}{k!}`, String.raw`e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '단계 수 n', en: 'Steps n' }, min: 1, max: 30, step: 1, init: 10 }],
problems: eseriesProblems,
    },
    {
      id: 'zeta4',
      title: { ko: 'ζ(4)와 짝수 거듭제곱', en: 'ζ(4) and Even Powers' },
      order: 6,
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
      order: 7,
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
      order: 8,
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
      order: 9,
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
      order: 10,
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
  ],
};
