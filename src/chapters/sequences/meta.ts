import type { ChapterMeta } from '../../contracts.ts';
import { problems as bolzanoWeierstrassProblems } from '../limits/problems/bolzano-weierstrass';
import { problems as cauchySchwarzProblems } from '../limits/problems/cauchy-schwarz';
import { problems as constructionProblems } from '../limits/problems/construction';
import { problems as epsilonNProblems } from '../limits/problems/epsilon-n';
import { problems as holesProblems } from '../limits/problems/holes';
import { problems as limsupLiminfProblems } from '../limits/problems/limsup-liminf';
import { problems as monotoneCauchyProblems } from '../limits/problems/monotone-cauchy';
import { problems as sequenceSpacesProblems } from '../limits/problems/sequence-spaces';
import { problems as standardLimitsProblems } from '../limits/problems/standard-limits';
import { problems as stolzCesaroProblems } from '../limits/problems/stolz-cesaro';

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
export const sequences: ChapterMeta = {
  id: 'sequences',
  title: { ko: '수열', en: 'Sequences' },
  summary: {
    ko: 'ε-N 논법으로 수열의 수렴을 다루고, 단조·코시 수열과 limsup/liminf의 기술을 익힙니다.',
    en: 'Convergence of sequences via ε-N arguments: monotone and Cauchy sequences, limsup and liminf.',
  },
  scenes: [
    {
      id: 'epsilon-n',
      title: { ko: 'ε-N 극한', en: 'The ε–N Definition' },
      order: 1,
      summary: {
        ko: String.raw`\(\varepsilon\) 띠를 좁혀도 수열의 꼬리가 전부 그 안에 들어가는 순간을 확인합니다. 그때의 \(N\)이 바로 \(\forall\varepsilon>0\ \exists N\)의 \(N\)입니다.`,
        en: String.raw`Watch the moment the whole tail of a sequence fits inside the \(\varepsilon\)-band. That \(N\) is exactly the \(N\) in \(\forall\varepsilon>0\ \exists N\).`,
      },
      tex: [String.raw`\forall\varepsilon>0\ \exists N\ \text{s.t.}\ n>N\Rightarrow|a_n-L|<\varepsilon`],
      controls: [
        {
          kind: 'select',
          key: 'seq',
          label: { ko: '수열', en: 'Sequence' },
          options: ['1/n', '1/n²', '(−1)^n / n', 'n / (n+1)'],
          init: '1/n',
        },
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
      ],
problems: epsilonNProblems,
    },
    {
      id: 'standard-limits',
      title: { ko: '표준 극한: x^n과 x^{1/n}', en: 'Standard Limits: x^n and x^{1/n}' },
      order: 2,
      summary: {
        ko: String.raw`\(|x| < 1\)이면 \(x^n\)이 \(0\)으로 가라앉고, \(x > 0\)이면 \(x^{1/n}\)이 \(1\)로 모입니다. \(x = -1\)에서는 진동하고, \(|x| > 1\)에서는 발산합니다. Bernoulli 부등식이 이 모든 경우를 다룹니다.`,
        en: String.raw`\(x^n\) sinks to \(0\) when \(|x| < 1\); \(x^{1/n}\) gathers at \(1\) when \(x > 0\). At \(x = -1\) it oscillates, and for \(|x| > 1\) it diverges. Bernoulli's inequality handles every case.`,
      },
      tex: [
        String.raw`|x|<1 \Rightarrow x^n \to 0`,
        String.raw`x>1 \Rightarrow x^{1/n} \to 1`,
        String.raw`n^{1/n} \to 1`,
      ],
      prerequisites: ['epsilon-n'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '수열', en: 'Sequence' }, options: ['power', 'root'], init: 'power' },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: -2, max: 2, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'n', label: { ko: '항의 개수 n', en: 'Terms n' }, min: 1, max: 60, step: 1, init: 20 },
      ],
      problems: standardLimitsProblems,
    },
    {
      id: 'sequence-spaces',
      title: { ko: '수열공간과 함수공간', en: 'Sequence and Function Spaces' },
      order: 3,
      summary: {
        ko: String.raw`\(\ell^1, \ell^2, \ell^\infty\)와 \(C[0,1]\) — 점별 연산으로는 벡터공간이고, 노름 \(\|x - y\|\)로는 거리공간입니다. 노름공간이 두 세계를 잇는 다리입니다. \(x_n = 1/n^\alpha\)로 포함관계 \(\ell^1 \subset \ell^2 \subset \ell^\infty\)를 눈으로 확인합니다. \(\ell^p\)와 \(C[0,1]\)이 완비(바나흐 공간)라는 것은 알려진 정리로만 언급합니다.`,
        en: String.raw`\(\ell^1, \ell^2, \ell^\infty\) and \(C[0,1]\) — vector spaces under pointwise operations, metric spaces via the norm \(\|x - y\|\). A normed space bridges both worlds. Watch the inclusion chain \(\ell^1 \subset \ell^2 \subset \ell^\infty\) through \(x_n = 1/n^\alpha\). Completeness of \(\ell^p\) and \(C[0,1]\) (Banach spaces) is stated as a known theorem only.`,
      },
      tex: [
        String.raw`\ell^1 = \{x : \sum |x_n| < \infty\}, \quad \ell^2 = \{x : \sum |x_n|^2 < \infty\}, \quad \ell^\infty = \{x : \sup |x_n| < \infty\}`,
        String.raw`\|x\|_1 = \sum |x_n|, \quad \|x\|_2 = \left(\sum |x_n|^2\right)^{1/2}, \quad \|x\|_\infty = \sup_n |x_n|`,
        String.raw`\ell^1 \subset \ell^2 \subset \ell^\infty, \qquad d(x, y) = \|x - y\|`,
      ],
      prerequisites: ['metric-spaces'],
      controls: [
        { kind: 'select', key: 'view', label: { ko: '보기', en: 'View' }, options: ['balls', 'sequence'], init: 'balls' },
        { kind: 'select', key: 'p', label: { ko: '노름 p', en: 'Norm p' }, options: ['1', '2', 'inf'], init: '2' },
        { kind: 'slider', key: 'alpha', label: { ko: '지수 α', en: 'Exponent α' }, min: 0.2, max: 2, step: 0.05, init: 1 },
      ],
problems: sequenceSpacesProblems,
    },
    {
      id: 'cauchy-schwarz',
      title: { ko: '코시-슈바르츠 부등식', en: 'Cauchy\u2013Schwarz Inequality' },
      order: 4,
      summary: {
        ko: String.raw`\(|\langle x,y\rangle| \le \|x\|\,\|y\|\) — 내적의 절댓값은 노름의 곱을 넘지 않습니다. \(0 \le \|x-ty\|^2\)의 판별식으로 증명하고, 등호는 두 벡터가 평행할 때만 성립합니다.`,
        en: String.raw`\(|\langle x,y\rangle| \le \|x\|\,\|y\|\) — the inner product never exceeds the product of the norms. Proved from the discriminant of \(0 \le \|x-ty\|^2\); equality holds exactly for parallel vectors.`,
      },
      tex: [
        String.raw`|\langle x,y\rangle| \le \|x\|\,\|y\|`,
        String.raw`\|x+y\| \le \|x\|+\|y\|`,
      ],
      prerequisites: ['sequence-spaces'],
      controls: [
        { kind: 'slider', key: 'angle', label: { ko: '각도 θ', en: 'Angle θ' }, min: 0, max: Math.PI * 2, step: Math.PI / 180, init: 0 },
        { kind: 'toggle', key: 'showProjection', label: { ko: '정사영 표시', en: 'Show projection' }, init: true },
      ],
      problems: cauchySchwarzProblems,
    },
    {
      id: 'holes',
      title: { ko: '유리수의 구멍', en: 'Why ℝ Has No Holes' },
      order: 5,
      summary: {
        ko: String.raw`\(x_{n+1}=\frac{x_n+2/x_n}{2}\)의 모든 항은 유리수지만, 극한 \(\sqrt{2}\)는 유리수가 아닙니다. 유리수 집합 \(\mathbb{Q}\)에는 구멍이 있다는 뜻입니다. 무리수임의 엄밀한 증명은 다루지 않고 아이디어 수준에서만 봅니다.`,
        en: String.raw`Every term of \(x_{n+1}=\frac{x_n+2/x_n}{2}\) is rational, yet the limit \(\sqrt{2}\) is not. The rationals \(\mathbb{Q}\) have a hole — shown at the idea level, without a full irrationality proof.`,
      },
      tex: [String.raw`x_{n+1}=\frac{x_n+2/x_n}{2}\to\sqrt{2}`, String.raw`\sqrt{2}\notin\mathbb{Q}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: holesProblems,
    },
    {
      id: 'construction',
      title: { ko: '실수의 구성', en: 'Construction of the Real Numbers' },
      order: 6,
      summary: {
        ko: String.raw`실수란 유리수 코시수열의 동치류입니다. \(\sqrt{2}\)의 소수점 자릿수를 늘려 가면 유리수 항들이 구멍으로 모여듭니다 — 그 모임 자체가 실수 \(\sqrt{2}\)입니다. 완비성의 정체는 이 구성에 있습니다.`,
        en: String.raw`A real number is an equivalence class of Cauchy sequences of rationals. Lengthening the decimal expansion of \(\sqrt{2}\) marches rational terms into the hole — the march itself is the real number \(\sqrt{2}\). Completeness is what this construction buys.`,
      },
      tex: [
        String.raw`(x_n) \sim (y_n) \iff x_n - y_n \to 0`,
        String.raw`\sqrt{2} = [(1, 1.4, 1.41, 1.414, \dots)]`,
      ],
      prerequisites: ['holes'],
      controls: [
        { kind: 'select', key: 'seq', label: { ko: '수열', en: 'Sequence' }, options: ['decimal', 'newton'], init: 'decimal' },
        { kind: 'slider', key: 'n', label: { ko: '항의 개수 n', en: 'Terms n' }, min: 1, max: 6, step: 1, init: 4 },
      ],
problems: constructionProblems,
    },
    {
      id: 'bolzano-weierstrass',
      title: { ko: '볼차노–바이어슈트라스', en: 'A Convergent Subsequence Always Hides Inside' },
      order: 7,
      summary: {
        ko: '유계수열 속에는 항상 수렴하는 부분수열이 숨어 있습니다. 구간을 반으로 접어 점이 무한히 모이는 쪽을 따라가면 됩니다.',
        en: 'Every bounded sequence hides a convergent subsequence. Halve the interval and follow the half holding infinitely many terms.',
      },
      tex: [String.raw`(a_n)\ \text{bounded}\Rightarrow\exists\ (a_{n_k})\ \text{convergent}`],
      controls: [
        { kind: 'slider', key: 'steps', label: { ko: '이분 단계', en: 'Bisection steps' }, min: 1, max: 8, step: 1, init: 4 },
        { kind: 'select', key: 'seed', label: { ko: '난수 시드', en: 'Random seed' }, options: ['7', '21', '99'], init: '7' },
      ],
problems: bolzanoWeierstrassProblems,
    },
    {
      id: 'monotone-cauchy',
      title: { ko: '단조수열과 코시수열', en: 'Monotone and Cauchy Sequences' },
      order: 8,
      summary: {
        ko: String.raw`\(a_n = 1 - 2^{-n}\)은 증가하면서 위로 유계이므로 상한 \(1\)에 수렴합니다(단조수렴 정리). 꼬리 지름이 \(0\)으로 줄어드는 모습을 보며, 모든 수렴수열이 코시수열임을 확인합니다.`,
        en: String.raw`\(a_n = 1 - 2^{-n}\) increases and is bounded above, so it converges to its supremum \(1\) (monotone convergence). Watch the tail diameter shrink to \(0\): every convergent sequence is Cauchy.`,
      },
      tex: [
        String.raw`a_n = 1 - 2^{-n} \uparrow 1`,
        String.raw`\max_{m,k \geq N} \lvert a_m - a_k\rvert \to 0`,
      ],
      prerequisites: ['bolzano-weierstrass'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '보이는 항 개수', en: 'Terms shown' }, min: 1, max: 12, step: 1, init: 8 },
        { kind: 'slider', key: 'tailN', label: { ko: '꼬리 시작 N', en: 'Tail start N' }, min: 1, max: 10, step: 1, init: 4 },
      ],
problems: monotoneCauchyProblems,
    },
    {
      id: 'limsup-liminf',
      title: { ko: '상극한과 하극한', en: 'Lim sup and Lim inf' },
      order: 9,
      summary: {
        ko: String.raw`꼬리들의 상한과 하한이 모이는 곳: \(a_n = (-1)^n(1+1/n)\)에서 \(\limsup a_n = 1\), \(\liminf a_n = -1\). \(\limsup a_n = \liminf a_n \iff \lim a_n\) 존재.`,
        en: String.raw`Where the suprema and infima of tails settle: for \(a_n = (-1)^n(1+1/n)\), \(\limsup a_n = 1\) and \(\liminf a_n = -1\). \(\limsup a_n = \liminf a_n \iff \lim a_n\) exists.`,
      },
      tex: [
        String.raw`\limsup a_n = \lim_{N\to\infty}\sup_{n\ge N} a_n`,
        String.raw`\liminf a_n = \lim_{N\to\infty}\inf_{n\ge N} a_n`,
        String.raw`\limsup a_n = \liminf a_n \iff \lim a_n \text{ exists}`,
      ],
      prerequisites: ['monotone-cauchy'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms shown' }, min: 2, max: 60, step: 1, init: 24 },
      ],
      problems: limsupLiminfProblems,
    },
    {
      id: 'stolz-cesaro',
      title: { ko: '체자로 정리', en: 'Stolz–Cesàro Theorem' },
      order: 10,
      summary: {
        ko: String.raw`수열 버전 로피탈: \((b_n)\)이 엄격히 증가하며 무한대로 발산하고 \(\lim \frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L\)이면 \(\lim \frac{a_n}{b_n} = L\). \(a_n = 1^2+\cdots+n^2\), \(b_n = n^3\)에서 차분 비율이 먼저, 전체 비율이 뒤따라 \(\frac{1}{3}\)에 모이는 것을 보세요.`,
        en: String.raw`The sequence version of l'Hôpital: if \((b_n)\) is strictly increasing and unbounded and \(\lim \frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L\), then \(\lim \frac{a_n}{b_n} = L\). Watch the difference ratio settle at \(\frac{1}{3}\) first and the full ratio follow for \(a_n = 1^2+\cdots+n^2\), \(b_n = n^3\).`,
      },
      tex: [
        String.raw`\lim \frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L \implies \lim \frac{a_n}{b_n} = L`,
        String.raw`\lim_{n\to\infty}\frac{1^2+\cdots+n^2}{n^3} = \frac{1}{3}`,
      ],
      prerequisites: ['limsup-liminf', 'monotone-cauchy'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms shown' }, min: 10, max: 300, step: 1, init: 60 },
      ],
      problems: stolzCesaroProblems,
    },
  ],
};
