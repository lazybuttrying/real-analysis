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
  sections: [
    { id: 'power-basics', title: { ko: '멱급수의 기본', en: 'Power Series Basics' }, sceneIds: ['power-series', 'hadamard-gap', 'abel-theorem', 'tauber'] },
    { id: 'constants', title: { ko: '상수로 가는 급수', en: 'Series for Constants' }, sceneIds: ['eseries', 'zeta4'] },
    { id: 'rearrangement-products', title: { ko: '재배열과 곱', en: 'Rearrangements and Products' }, sceneIds: ['rearrangement', 'absolute', 'riemann-rearrangement', 'cauchy-product'] },
  ],
  scenes: [
    {
      id: 'power-series',
      title: { ko: '멱급수와 수렴반경', en: 'Power Series and Radius of Convergence' },
      order: 1,
      summary: {
        ko: String.raw`멱급수가 어느 범위 안에서 수렴하고 밖에서 무너지는지를 봅니다.

중심에서 반경 안쪽은 안전지대입니다. 안에서는 절댓값을 씌워도 수렴합니다. 바깥에서는 항 자체가 0으로 가지 못합니다. 경계선 위의 점들은 저마다 운명이 다릅니다.

예를 들면, 🏠 집의 와이파이와 비슷해요. 집 안에서는 잘 터지고, 멀어지면 끊겨요. 현관 앞에서는 될 때도 있고 안 될 때도 있어서 직접 확인해야 해요.`,
        en: String.raw`Where does a power series converge, and where does it fall apart?

Inside the radius lies a safe zone. There the series converges even with absolute values. Outside, the terms themselves fail to shrink to zero. Points on the boundary each have their own fate.

For example, think of Wi-Fi in a 🏠 house. It works well inside and drops as you walk away. Right at the door it may or may not connect, so you check case by case.`,
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
        ko: String.raw`항 사이 간격이 점점 벌어지는 급수의 경계 행동을 봅니다.

지수가 1, 2, 4, 8처럼 두 배씩 뛰면 빈칸이 커집니다. 그 빈칸 때문에 수렴원 위의 어느 점으로도 이어질 수 없습니다. 원 안에서는 멀쩡히 수렴하는데도 그렇습니다. 간격 없는 비교 급수는 얌전히 행동합니다.

예를 들면, 🪜 계단 칸이 1, 2, 4, 8칸씩 벌어지는 계단과 같아요. 처음에는 잘 오르지만, 나중에는 한 칸이 너무 멀어 벽 끝까지 닿을 수 없어요.`,
        en: String.raw`What happens at the boundary when a series has growing gaps?

Exponents doubling like 1, 2, 4, 8 leave bigger and bigger holes. The holes block continuation to every point of the circle. This happens even though the series converges nicely inside. The gap-free comparison series stays calm.

For example, imagine a 🪜 staircase whose steps spread by 1, 2, 4, 8. The first steps are easy. Soon one step is too far, and the wall's end is out of reach.`,
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
        ko: String.raw`급수의 합과 멱급수의 극한이 1에서 이어지는지를 봅니다.

원래 급수가 수렴하면, 1에 다가가는 멱급수도 같은 값을 향합니다. 아래 식이 그 내용입니다. 발산하는 그란디 급수도 이 극한에서는 2분의 1을 가리킵니다. 하지만 그것은 합이 아니라 아벨 합이라는 별도 약속입니다.

예를 들면, 🧑 친구가 1과 0을 번갈아 외치는 게임과 비슷해요. 뒤로 갈수록 목소리를 조금씩 줄이면, 전체 평균이 2분의 1 근처에서 잔잔해져요.`,
        en: String.raw`Does the sum of a series match the limit of its power series at 1?

If the series converges, the power series heads to the same value as x nears 1, as in the formula below. Even the divergent Grandi series points to one half in this limit. But that value is an Abel sum, a separate convention, not the sum.

For example, imagine a 🧑 friend shouting 1 and 0 in turns. If each shout is a bit quieter than the last, the running average settles near one half.`,
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
        ko: String.raw`아벨 합이 있으면 진짜 합도 있는지 거꾸로 묻는 장면입니다.

답은 조건이 붙을 때만 그렇습니다. 항들이 1 나누기 n보다 빠르게 작아져야 합니다. 그란디 급수는 항이 줄지 않아 이 조건이 깨집니다. 조건을 만족하는 급수에서는 아벨 합의 곡선이 보통 합에 닿습니다.

예를 들면, 🏠 집 현관까지 걸어가는 것과 같아요. 발걸음이 점점 작아져야 현관에 딱 멈출 수 있어요. 발걸음이 줄지 않으면 앞뒤로 계속 지나치기만 합니다.`,
        en: String.raw`If an Abel sum exists, must the ordinary sum exist too?

Only under an extra condition. The terms must shrink faster than one over n. Grandi's series breaks it, since its terms never shrink. When the condition holds, the Abel-sum curve reaches the ordinary sum.

For example, think of walking to the door of a 🏠 house. Your steps must keep shrinking to stop right at the door. Steps that never shrink just carry you past it, back and forth.`,
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
        ko: String.raw`e에 다가가는 두 길의 속도를 견주는 장면입니다.

복리 길은 횟수를 늘려도 한 걸음씩 느리게 다가갑니다. 팩토리얼 급수는 항이 순식간에 작아집니다. 몇 항만 더해도 자릿수가 금방 맞아떨어집니다.

예를 들면, 🐷 저금통의 💰 돈에 이자가 붙고 그 이자에 또 이자가 붙는 복리와 같아요. 횟수를 늘릴수록 e에 가까워지지만, 급수 쪽이 훨씬 먼저 도착해요.`,
        en: String.raw`Two roads lead to e — which one gets there faster?

The compound-growth road creeps forward step by step. The factorial series has terms that shrink almost instantly. A handful of terms already pins down many digits.

For example, think of 💰 money in a 🐷 piggy bank earning interest on its interest. More rounds push it toward e, but the series arrives far sooner.`,
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
        ko: String.raw`네제곱 역수들을 모두 더하면 무엇이 나오는지를 봅니다.

부분합은 몇 항만으로 답에 바짝 붙습니다. 항이 네제곱으로 작아져 꼬리가 아주 짧기 때문입니다. 짝수 거듭제곱에서는 늘 원주율의 거듭제곱으로 닫힌 답이 나옵니다.

예를 들면, 🍰 케이크를 빠르게 줄어드는 조각으로 나눠 쌓는 것과 같아요. 조각이 금방 작아져서 전체 높이가 몇 조각만으로 정해져요.`,
        en: String.raw`What do the reciprocals of fourth powers add up to?

The partial sums hug the answer after only a few terms. Fourth powers shrink the tail to almost nothing. At every even power, the closed answer is a power of pi times a fraction.

For example, picture stacking 🍰 cake slices that shrink fast. Each slice is soon tiny, so a few slices fix the total height.`,
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
        ko: String.raw`조건수렴 급수의 항 순서를 바꾸면 합이 어떻게 되는지를 봅니다.

양의 항도 음의 항도 끝없이 쌓여 있습니다. 그래서 어느 쪽을 먼저 꺼내느냐로 합을 밀고 당길 수 있습니다. 절댓값까지 수렴하는 급수에서는 이런 일이 없습니다.

예를 들면, 🐷 저금통에 💰 동전을 넣었다 뺐다 하는 순서를 바꾸는 것과 같아요. 넣을 동전과 뺄 동전이 끝없이 많으면, 순서만으로 잔액을 바꿀 수 있어요.`,
        en: String.raw`What happens to the sum when we reorder a conditionally convergent series?

Positive terms and negative terms both pile up without end. So choosing which side to draw from first pushes the sum around. Nothing like this happens when the absolute series converges.

For example, think of putting 💰 coins into a 🐷 piggy bank and taking them out. If both piles of coins are endless, the order alone changes the balance.`,
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
        ko: String.raw`절댓값 급수가 수렴하면 원래 급수도 따라 수렴하는지를 봅니다.

절댓값을 씌운 합이 유한하면 이야기가 끝납니다. 부호 있는 부분합은 그 안에서 출렁이다 한 점에 안착합니다. 반대로 절댓값은 발산해도 부호가 번갈면 상쇄가 도와 수렴하기도 합니다.

예를 들면, 🧑 사람이 앞으로 한 걸음, 뒤로 조금 걷는 것과 같아요. 걸음 폭을 전부 더해도 유한하면, 결국 어느 한 지점에 멈추게 돼요.`,
        en: String.raw`If the absolute-value series converges, must the original follow?

A finite absolute total settles everything. The signed partial sums wobble inside it and land on one point. In reverse, alternating signs can rescue a series whose absolute total diverges.

For example, picture a 🧑 person stepping forward, then a little back. If all the step lengths add to a finite total, the walker ends up standing somewhere definite.`,
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
        ko: String.raw`재배열만으로 원하는 합을 직접 만들어 보는 장면입니다.

탐욕 규칙은 간단합니다. 목표보다 작으면 양의 항을, 크면 음의 항을 꺼냅니다. 항이 점점 작아져서 지나치는 폭도 함께 줄어듭니다. 그래서 어떤 실수를 골라도 그 합에 정확히 붙습니다.

예를 들면, 🚗 자동차 핸들을 돌리는 것과 비슷해요. 지나치면 반대로, 모자라면 더 돌리는 식으로 조금씩 몰면 원하는 지점에 딱 멈출 수 있어요.`,
        en: String.raw`Can rearranging alone manufacture any sum we want?

The greedy rule is simple. Below the target, take a positive term; above it, take a negative one. The terms shrink, so each overshoot shrinks too. That is why any real target can be hit exactly.

For example, think of steering a 🚗 car. Turn more when short of the spot, back when past it. Small corrections land you exactly where you aim.`,
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
        ko: String.raw`두 급수를 곱하면 항들이 어떻게 짝지어지는지를 봅니다.

곱의 각 항은 격자의 대각선을 따라 짝을 모아 만든 것입니다. 아래 식이 그 규칙입니다. 한쪽이 절대수렴하면 곱은 두 합의 곱으로 안착합니다. 둘 다 조건수렴이면 대각선의 합 자체가 무너질 수 있습니다.

예를 들면, 📦 상자들을 바둑판처럼 놓고 대각선으로 하나씩 주워 담는 것과 같아요. 주울 것들이 충분히 빨리 작아지면 바구니 속 총합이 정해져요.`,
        en: String.raw`How do the terms pair up when two series are multiplied?

Each product term gathers pairs along a diagonal of the lattice, as in the formula below. If one side converges absolutely, the product lands on the product of the sums. If both converge only conditionally, the diagonal sums can collapse.

For example, picture 📦 boxes in a grid, picked up one diagonal at a time. If the boxes shrink fast enough, the basket's total settles down.`,
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
