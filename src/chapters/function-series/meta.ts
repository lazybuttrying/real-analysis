import type { ChapterMeta } from '../../contracts.ts';
import { fejerTheoremProblems } from '../calculus/problems/fejer-theorem';
import { gibbsPhenomenonProblems } from '../calculus/problems/gibbs-phenomenon';
import { problems as diniProblems } from '../series/problems/dini';
import { problems as fourierProblems } from '../calculus/problems/fourier';
import { problems as mTestProblems } from '../series/problems/m-test';
import { parsevalProblems } from '../series/problems/parseval';
import { riemannLebesgueProblems } from '../series/problems/riemann-lebesgue';

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
export const functionSeries: ChapterMeta = {
  id: 'function-series',
  title: { ko: '함수급수와 푸리에', en: 'Series of Functions & Fourier' },
  summary: {
    ko: '함수들의 급수가 언제 균등수렴하는지, 그리고 푸리에급수와 깁스 현상을 다룹니다.',
    en: 'When series of functions converge uniformly — plus Fourier series and the Gibbs phenomenon.',
  },
  scenes: [
    {
      id: 'm-test',
      title: { ko: 'M-판정법', en: 'The Weierstrass M-Test' },
      order: 1,
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
      order: 2,
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
      id: 'fourier',
      title: { ko: '푸리에 정사각파', en: 'The Ringing That Never Dies' },
      order: 3,
      summary: {
        ko: String.raw`정사각파에 사인파를 겹쳐봅니다. 점프점 옆의 울림은 \(N\)을 키워도 사라지지 않습니다.`,
        en: String.raw`Layer sine waves onto a square wave. The ringing beside each jump never dies out, no matter how large \(N\) gets.`,
      },
      tex: [String.raw`S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N} \frac{\sin((2k-1)x)}{2k-1}`],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 50, step: 1, init: 8 }],
problems: fourierProblems,
    },
    {
      id: 'riemann-lebesgue',
      title: { ko: '리만-르벡 보조정리', en: 'Riemann–Lebesgue Lemma' },
      order: 4,
      summary: {
        ko: String.raw`푸리에 계수는 0으로 갑니다 — \(\int f(x)\sin(nx)\,dx \to 0\). 빠르게 진동하는 파동은 \(f\)의 울퉁불퉁함을 평균내어 지워버립니다.`,
        en: String.raw`Fourier coefficients die out — \(\int f(x)\sin(nx)\,dx \to 0\). Rapid oscillation averages away every bump of \(f\).`,
      },
      tex: [
        String.raw`a_n = \frac1\pi\int_{-\pi}^{\pi} f(x)\cos(nx)\,dx \to 0`,
        String.raw`b_n = \frac1\pi\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx \to 0`,
      ],
      prerequisites: ['fourier'],
      controls: [
        { kind: 'select', key: 'mode', label: { ko: '함수', en: 'Function' }, options: ['step', 'tent', 'smooth'], init: 'step' },
        { kind: 'slider', key: 'n', label: { ko: '진동수 n', en: 'Frequency n' }, min: 1, max: 40, step: 1, init: 12 },
        { kind: 'select', key: 'kind', label: { ko: '계수', en: 'Coefficient' }, options: ['a', 'b'], init: 'b' },
      ],
      problems: riemannLebesgueProblems,
    },
    {
      id: 'fejer-theorem',
      title: { ko: 'Fejér 정리', en: "Fejér's Theorem" },
      order: 5,
      summary: {
        ko: String.raw`푸리에 부분합의 체자로 평균 \(\sigma_N\)은 연속함수에 균등수렴합니다 — Fejér kernel이 근사 항등원이기 때문입니다. 울림 많은 \(S_N\)과 매끈한 \(\sigma_N\)을 겹쳐보세요.`,
        en: String.raw`The Cesàro means \(\sigma_N\) of Fourier partial sums converge uniformly for continuous functions — because the Fejér kernel is an approximate identity. Overlay the ringing \(S_N\) with the smooth \(\sigma_N\).`,
      },
      tex: [
        String.raw`\sigma_N = \frac{S_0+\cdots+S_{N-1}}{N} \xrightarrow{\|\cdot\|_\infty} f`,
        String.raw`K_N(t) = \frac1N\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \ge 0`,
      ],
      prerequisites: ['fourier'],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 40, step: 1, init: 8 }],
problems: fejerTheoremProblems,
    },
    {
      id: 'parseval',
      title: { ko: '파르세발 항등식', en: "Parseval's Identity" },
      order: 6,
      summary: {
        ko: String.raw`에너지는 보존됩니다 — \(\frac1\pi\int_{-\pi}^{\pi} |f|^2 = \frac{a_0^2}{2} + \sum (a_n^2 + b_n^2)\). 처음 \(N\)개 모드가 잡아내는 에너지 비율을 보세요.`,
        en: String.raw`Energy is conserved — \(\frac1\pi\int_{-\pi}^{\pi} |f|^2 = \frac{a_0^2}{2} + \sum (a_n^2 + b_n^2)\). Watch the fraction of energy captured by the first \(N\) modes.`,
      },
      tex: [
        String.raw`\frac1\pi\int_{-\pi}^{\pi} |f|^2 = \frac{a_0^2}{2} + \sum_{n=1}^{\infty}(a_n^2 + b_n^2)`,
      ],
      prerequisites: ['fejer-theorem'],
      controls: [
        { kind: 'select', key: 'mode', label: { ko: '함수', en: 'Function' }, options: ['square', 'sawtooth', 'parabola'], init: 'square' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 40, step: 1, init: 12 },
      ],
      problems: parsevalProblems,
    },
    {
      id: 'gibbs-phenomenon',
      title: { ko: 'Gibbs 현상', en: 'The Gibbs Phenomenon' },
      order: 7,
      summary: {
        ko: String.raw`점프점 옆의 혹이 왜 사라지지 않는가 — 스케일을 \(t = 2Nx\)로 바꾸면 \(S_N\)이 \((2/\pi)\mathrm{Si}(t)\)에 붙고, 첫 봉우리는 \((2/\pi)\mathrm{Si}(\pi) \approx 1.179\)에 수렴합니다. 오버슈트는 점프의 약 8.95%.`,
        en: String.raw`Why the bump beside the jump never dies — rescaling by \(t = 2Nx\) collapses \(S_N\) onto \((2/\pi)\mathrm{Si}(t)\), and the first peak tends to \((2/\pi)\mathrm{Si}(\pi) \approx 1.179\). The overshoot is about 8.95% of the jump.`,
      },
      tex: [
        String.raw`S_N'(x) = \frac{2}{\pi}\frac{\sin(2Nx)}{\sin x}`,
        String.raw`\text{peak} \to \frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898`,
      ],
      prerequisites: ['fourier'],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 2, max: 60, step: 1, init: 12 }],
problems: gibbsPhenomenonProblems,
    },
  ],
};
