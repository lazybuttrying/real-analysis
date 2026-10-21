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
        ko: String.raw`함수급수가 균등수렴하는지 한 번에 판정하는 법을 봅니다.

각 항을 모든 점에서 누르는 상한이 핵심입니다. 그 상한들의 합이 수렴하면 꼬리가 전체 구간에서 동시에 작아집니다. 그래서 오차 띠가 한꺼번에 좁아집니다.

예를 들면, 물건들을 덮는 📦 상자 뚜껑과 같아요. 뚜껑 크기의 합이 유한하게 잡히면 어느 물건도 삐져나올 수 없어요.`,
        en: String.raw`One test that settles uniform convergence of a series of functions all at once.

The key is a cap that dominates each term at every point. If the caps themselves sum finitely, the tail shrinks across the whole interval together. So the error band tightens everywhere at once.

For example, think of 📦 box lids covering every item. If the lid sizes add up finitely, nothing can poke out anywhere.`,
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
        ko: String.raw`단조로운 함수열은 점별수렴만으로 균등수렴이 되는지를 봅니다.

닫힌 구간에서는 가능합니다. 한 번 따라잡으면 뒤처지지 않는 단조성 덕분입니다. 각 점에서 필요한 기다림을 모아도 유한한 상한으로 묶입니다. 그래서 전체가 한꺼번에 가까워집니다.

예를 들면, 🪜 계단을 오르는 것과 비슷해요. 뒤로 물러서지 않고 한 칸씩 오르면, 마지막 칸에 닿는 순간 전원이 다 올라온 셈이에요.`,
        en: String.raw`When does pointwise convergence of a monotone family upgrade to uniform?

On a closed interval, it does. Monotonicity means no function falls behind once it catches up. The waiting times at all points tie into one finite bound. So the whole family closes in together.

For example, think of climbing a 🪜 staircase. If nobody steps back, reaching the last step means the whole group has arrived.`,
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
        ko: String.raw`둥근 사인파들을 겹쳐 각진 정사각파를 만드는 장면입니다.

항을 더할수록 평평한 부분은 정사각파에 붙습니다. 하지만 점프 지점 옆의 울림은 줄지 않습니다. 항의 수를 아무리 늘려도 그 혹이 남아 있습니다.

예를 들면, 📷 사진 속 🏢 건물을 확대해 보는 것과 비슷해요. 픽셀이 작아질수록 모양은 선명해져요. 그래도 경계 옆 자글자글한 자국은 끝까지 남아요.`,
        en: String.raw`Round sine waves are layered to build a sharp square wave.

More terms press the flat parts onto the wave. But the ringing beside each jump does not shrink. No number of terms removes that bump.

For example, zoom into a 🏢 building in a 📷 photo. Smaller pixels sharpen the shape. Yet the jagged marks along the edges stay to the end.`,
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
        ko: String.raw`진동이 빨라지면 푸리에 계수가 어떻게 되는지를 봅니다.

빠르게 출렁이는 파동은 함수의 울퉁불퉁함을 평균 내어 지웁니다. 한 파장 안에서는 함수가 거의 상수처럼 보이기 때문입니다. 그래서 진동수가 커질수록 계수는 0으로 사라집니다.

예를 들면, 🧵 줄을 아주 빠르게 흔드는 것과 같아요. 출렁임이 번져 흐릿한 띠로 보이고, 위아래가 서로 지워져 가운데만 남아요.`,
        en: String.raw`What happens to Fourier coefficients as oscillation speeds up?

A rapidly wiggling wave averages away the function's bumps. Within one wavelength the function looks nearly constant. So as the frequency grows, every coefficient dies to zero.

For example, shake a 🧵 string very fast. The wiggle blurs into a faint band, the ups and downs cancelling to leave only the middle.`,
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
        ko: String.raw`울림 많은 푸리에 부분합들을 평균 내면 어떻게 되는지를 봅니다.

부분합들을 평균하면 혹들이 서로 상쇄됩니다. 평균의 핵은 양수이고 가운데에 뾰족하게 몰려 있습니다. 그래서 평균은 원래 함수에 전체 구간에서 한꺼번에 붙습니다.

예를 들면, 흔들린 📷 사진 여러 장을 겹치는 것과 같아요. 한 장 한 장의 출렁임이 겹침 속에서 서로 지워져 또렷해져요.`,
        en: String.raw`What happens when the ringing Fourier partial sums are averaged?

Averaging the partial sums cancels their bumps against each other. The averaging kernel is positive and piled sharply at the center. So the averages settle onto the function across the whole interval at once.

For example, overlay several shaky 📷 photos. Each photo's wobble cancels in the stack, and the picture turns clear.`,
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
        ko: String.raw`함수의 에너지가 계수 쪽에서도 똑같이 잡히는지를 봅니다.

원래 함수의 제곱 합과 계수들의 제곱합은 정확히 같습니다. 아래 식이 그 내용입니다. 항을 더할수록 잡아내는 에너지 비율이 1에 가까워집니다.

예를 들면, 🐷 저금통 속 💰 동전을 단위별로 세어 다시 합치는 것과 같아요. 세는 방식을 바꿔도 전체 금액은 그대로예요.`,
        en: String.raw`Is a function's energy captured exactly on the coefficient side?

The function's total square equals the coefficients' total square, as in the formula below. Adding modes pushes the captured share of energy toward all of it. Nothing is lost and nothing is invented.

For example, count the 💰 coins in a 🐷 piggy bank by denomination and add them up. Changing how you count never changes the total.`,
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
        ko: String.raw`점프 옆의 혹이 왜 사라지지 않는지를 파고드는 장면입니다.

혹 근처를 확대하면 개수가 달라도 같은 곡선으로 겹쳐집니다. 첫 봉우리의 높이는 약 1.179로 정해져 있습니다. 항을 늘리면 혹이 좁아질 뿐 낮아지지는 않습니다.

예를 들면, 📷 사진을 확대해 모서리를 들여다보는 것과 같아요. 확대할수록 자글거림은 좁아지지만 튀어나온 정도는 그대로예요.`,
        en: String.raw`Why does the bump beside a jump refuse to die?

Zooming into the bump collapses every case onto one curve. Its first peak is fixed near 1.179. More terms narrow the bump but never lower it.

For example, zoom into the corner of a 📷 photo. The jagged part gets narrower as you zoom, but how far it sticks out stays the same.`,
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
