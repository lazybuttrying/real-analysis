import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Weierstrass function scene.
 * Imports nothing except types. Every number below was verified against the model:
 *   tail(6) = (1/2)^7/(1/2) = (1/2)^6 = 0.015625;
 *   tail(8) = (1/2)^8 = 0.00390625;
 *   tail(2) = (1/2)^2 = 0.25;
 *   weierstrassPartial(0, n) = sum_{k=0}^n (1/2)^k = 2 - (1/2)^n:
 *     n=2 -> 1.75, n=6 -> 1.984375, n=8 -> 1.99609375;
 *   weierstrassPartial(1, 8) = -(2 - (1/2)^8) = -1.99609375 (13^k odd, so
 *     cos(13^k pi) = -1 for every k);
 *   a*b = 6.5 > 1 + 3*pi/2 ~= 5.7123889804;
 *   (a*b)^8 = 6.5^8 ~= 3186448.13, so a spike difference quotient
 *     ~= 2*(a*b)^8 ~= 6.37e6 at n = 8;
 *   W_2'(x) = -pi sin(pi x) - (13 pi/2) sin(13 pi x) - (169 pi/4) sin(169 pi x)
 *     (termwise: d/dx [a^k cos(b^k pi x)] = -a^k b^k pi sin(b^k pi x)).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'weierstrass-continuous',
    statement: {
      ko: String.raw`바이어슈트라스 함수 \(W(x) = \sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) (\(a = \frac12\), \(b = 13\))가 \(\mathbb{R}\) 전체에서 연속임을 바이어슈트라스 M-판정법으로 증명하세요. (힌트: 급수 장의 m-test 장면.)`,
      en: String.raw`Prove via the Weierstrass M-test that the Weierstrass function \(W(x) = \sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) (\(a = \frac12\), \(b = 13\)) is continuous on all of \(\mathbb{R}\). (Hint: the m-test scene in the series chapter.)`,
    },
    display: [
      String.raw`u_n(x) = a^n \cos(b^n \pi x), \qquad |u_n(x)| \le \left(\tfrac12\right)^n =: M_n`,
      String.raw`\sum_{n=0}^{\infty} M_n = 2 < \infty \;\xrightarrow{\text{M-test}}\; \sum u_n \text{ converges uniformly on } \mathbb{R}`,
      String.raw`|W(x) - W_N(x)| \le \sum_{n=N+1}^{\infty} M_n = \left(\tfrac12\right)^N \quad \text{for every } x`,
    ],
    preset: { n: 6 },
    presetCaption: {
      ko: String.raw`\(n = 6\): 꼬리 상한 \((1/2)^6 = 0.015625\) — 이 곡선은 진짜 \(W\)와 모든 \(x\)에서 0.016 이내에 있다 (\(W_6(0) = 1.984375\)).`,
      en: String.raw`\(n = 6\): tail bound \((1/2)^6 = 0.015625\) — this curve sits within 0.016 of the true \(W\) at every \(x\) (\(W_6(0) = 1.984375\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 항 \(u_n(x) = a^n \cos(b^n \pi x)\)는 연속함수이다. 모든 \(x\)에 대해 \(|\cos| \le 1\)이므로 \(|u_n(x)| \le a^n = \left(\frac12\right)^n =: M_n\)이고, \(\sum_{n=0}^{\infty} M_n = \sum_{n=0}^{\infty} \left(\frac12\right)^n = 2 < \infty\)이다. 바이어슈트라스 M-판정법(급수 장의 m-test 장면)에 의해 \(\sum u_n\)은 \(\mathbb{R}\)에서 균등 수렴한다.`,
          en: String.raw`Each term \(u_n(x) = a^n \cos(b^n \pi x)\) is continuous. Since \(|\cos| \le 1\), \(|u_n(x)| \le a^n = \left(\frac12\right)^n =: M_n\) for every \(x\), and \(\sum_{n=0}^{\infty} M_n = \sum_{n=0}^{\infty} \left(\frac12\right)^n = 2 < \infty\). By the Weierstrass M-test (the m-test scene in the series chapter), \(\sum u_n\) converges uniformly on \(\mathbb{R}\).`,
        },
      },
      {
        text: {
          ko: String.raw`연속함수들의 균등 극한은 연속이다: \(x_0\)을 고정하면 \(|W(x) - W(x_0)| \le |W(x) - W_N(x)| + |W_N(x) - W_N(x_0)| + |W_N(x_0) - W(x_0)|\)이고, 처음과 마지막 항은 꼬리 상한 \((1/2)^N\)으로, 가운데 항은 연속인 유한합 \(W_N\)으로 작게 만들 수 있다. 따라서 \(W\)는 \(x_0\)에서 연속이고, \(x_0\)은 임의였으므로 \(W\)는 \(\mathbb{R}\) 전체에서 연속이다.`,
          en: String.raw`A uniform limit of continuous functions is continuous: fix \(x_0\); then \(|W(x) - W(x_0)| \le |W(x) - W_N(x)| + |W_N(x) - W_N(x_0)| + |W_N(x_0) - W(x_0)|\). The first and last terms are small by the tail bound \((1/2)^N\), the middle one by the continuity of the finite sum \(W_N\). Hence \(W\) is continuous at \(x_0\), and \(x_0\) was arbitrary, so \(W\) is continuous on all of \(\mathbb{R}\).`,
        },
      },
      {
        text: {
          ko: String.raw`숫자로 확인하자: \(N = 6\)일 때 \(|W(x) - W_6(x)| \le (1/2)^6 = 0.015625\)가 모든 \(x\)에 대해 성립한다 — 화면의 곡선은 진짜 \(W\)에서 0.016 이내에 있다. \(N\)을 키우면 꼬리 상한 \((1/2)^N\)은 0으로 가므로, 화면의 \(W_N\)은 \(W\)에 균등하게 다가간다.`,
          en: String.raw`Check the numbers: at \(N = 6\), \(|W(x) - W_6(x)| \le (1/2)^6 = 0.015625\) for every \(x\) — the curve on screen sits within 0.016 of the true \(W\). Raising \(N\) drives the tail bound \((1/2)^N\) to 0, so the on-screen \(W_N\) approaches \(W\) uniformly.`,
        },
      },
    ],
  },
  {
    id: 'weierstrass-nowhere-differentiable',
    statement: {
      ko: String.raw`정리를 서술하세요: \(b\)가 홀수이고 \(ab > 1 + \frac{3\pi}{2}\)이면 바이어슈트라스 함수 \(W\)는 어떤 점에서도 미분가능하지 않습니다 (우리의 \(a = \frac12\), \(b = 13\)은 \(ab = 6.5 > 5.712\)을 만족합니다). 아래 증명은 아이디어 수준의 개요(sketch)입니다 — 메커니즘은 정확히 전달하되, 고전적 증명의 상수 추적을 한 줄 한 줄 재현하지는 않습니다.`,
      en: String.raw`State the theorem: if \(b\) is odd and \(ab > 1 + \frac{3\pi}{2}\), then the Weierstrass function \(W\) is differentiable at no point (our \(a = \frac12\), \(b = 13\) satisfy \(ab = 6.5 > 5.712\)). The argument below is an idea-level sketch — it conveys the mechanism faithfully but does not reproduce the classical proof's constant-tracking line by line.`,
    },
    display: [
      String.raw`ab = 6.5 > 1 + \frac{3\pi}{2} \approx 5.712, \qquad b = 13 \text{ odd}`,
      String.raw`\text{at scale } b^{-n}\text{: the } n\text{-th harmonic completes a full spike, so some } x_n \to x_0 \text{ has}`,
      String.raw`\left|\frac{W(x_n) - W(x_0)}{x_n - x_0}\right| \gtrsim (ab)^n \to \infty \quad \text{(idea sketch, not the full proof)}`,
    ],
    preset: { n: 8 },
    presetCaption: {
      ko: String.raw`\(n = 8\): 꼬리 상한 \((1/2)^8 = 0.00390625\) — 매끄러운 항을 8개나 더했는데도 곡선은 모든 스케일에서 들쭉날쭉하다 (\(W_8(0) = 1.99609375\), \(W_8(1) = -1.99609375\)).`,
      en: String.raw`\(n = 8\): tail bound \((1/2)^8 = 0.00390625\) — eight smooth terms added, yet the curve is jagged at every scale (\(W_8(0) = 1.99609375\), \(W_8(1) = -1.99609375\)).`,
    },
    isHint: true,
    proof: [
      {
        text: {
          ko: String.raw`정리 (Weierstrass–Hardy): \(b\)가 홀수인 정수이고 \(ab > 1 + \frac{3\pi}{2}\)이면 \(W(x) = \sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\)는 어떤 점에서도 미분가능하지 않다. 우리는 \(a = \frac12\), \(b = 13\)을 쓰므로 \(ab = 6.5 > 1 + \frac{3\pi}{2} \approx 5.712\)이다 — 조건을 만족한다.`,
          en: String.raw`Theorem (Weierstrass–Hardy): if \(b\) is an odd integer and \(ab > 1 + \frac{3\pi}{2}\), then \(W(x) = \sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) is differentiable at no point. We use \(a = \frac12\), \(b = 13\), so \(ab = 6.5 > 1 + \frac{3\pi}{2} \approx 5.712\) — the condition holds.`,
        },
      },
      {
        text: {
          ko: String.raw`메커니즘 — 스케일 \(b^{-n}\)에서 들여다보기: \(n\)번째 조화항 \(\cos(b^n \pi x)\)는 길이가 \(b^{-n}\) 정도인 구간마다 한 주기를 완성하므로, 임의의 점 \(x_0\) 근처에는 \(|x_n - x_0| \lesssim b^{-n}\)이면서 \(n\)번째 코사인이 거의 골에서 봉우리까지 (\(\approx 2\)만큼) 움직이는 스파이크 점 \(x_n\)이 있다. 이 스파이크를 가로지르는 \(n\)번째 항의 차분몫은 \(a^n \cdot (\approx 2) / (\approx b^{-n}) \approx 2(ab)^n = 2 \cdot 6.5^n \to \infty\)이다 (\(n = 8\)에서 \(\approx 6.37 \times 10^6\)).`,
          en: String.raw`The mechanism — zooming in at scale \(b^{-n}\): the \(n\)-th harmonic \(\cos(b^n \pi x)\) completes a full period over every interval of length about \(b^{-n}\), so near any point \(x_0\) there is a spike point \(x_n\) with \(|x_n - x_0| \lesssim b^{-n}\) where the \(n\)-th cosine swings nearly trough-to-peak (about \(2\)). Across this spike, the \(n\)-th term's difference quotient is \(a^n \cdot (\approx 2) / (\approx b^{-n}) \approx 2(ab)^n = 2 \cdot 6.5^n \to \infty\) (about \(6.37 \times 10^6\) at \(n = 8\)).`,
        },
      },
      {
        text: {
          ko: String.raw`나머지 항들은 이 스파이크를 이기지 못한다: \(k < n\)인 항들은 이 스케일에서 거의 평평하므로(미분하면 \(a^k b^k \pi\)가 나오고, 공비가 \(ab\)인 기하급수라 스파이크보다 작은 상수를 갖는다), \(k > n\)인 항들은 꼬리 상한 \(2a^{n+1}/(1-a)\)로 균등하게 작다. 고전적 증명은 스파이크 점을 정교하게 선택해 세 부분의 상수를 모두 추적하고, \(ab > 1 + \frac{3\pi}{2}\)라는 조건이 정확히 "스파이크의 상수가 이긴다"는 부등식임을 보인다.`,
          en: String.raw`The remaining terms cannot beat the spike: the terms with \(k < n\) are nearly flat at this scale (differentiating brings out \(a^k b^k \pi\), a geometric sum with ratio \(ab\) and a strictly smaller constant than the spike's), and the terms with \(k > n\) are uniformly tiny by the tail bound \(2a^{n+1}/(1-a)\). The classical proof chooses the spike points delicately, tracks all three constants, and shows that \(ab > 1 + \frac{3\pi}{2}\) is exactly the inequality saying "the spike's constant wins."`,
        },
      },
      {
        text: {
          ko: String.raw`정직한 표시: 이것은 아이디어 수준의 개요이다. 완전한 증명은 스파이크 점을 구성하고 세 부분의 상수를 끝까지 추적하는 고전적 Weierstrass–Hardy 구성으로, 여기서는 한 줄 한 줄 재현하지 않는다. 전달하려는 핵심은 이것이다 — 차분몫이 스파이크 수열 \(x_n \to x_0\)을 따라 무한대로 발산하므로, 어떤 유한한 수도 \(W'(x_0)\)이 될 수 없고, \(x_0\)은 임의였으므로 \(W\)는 어디에서도 미분가능하지 않다.`,
          en: String.raw`Honest label: this is an idea-level sketch. The full proof is the classical Weierstrass–Hardy construction — building the spike points and tracking all three constants to the end — which we do not reproduce line by line here. The takeaway it conveys is this: the difference quotient blows up to infinity along the spike sequence \(x_n \to x_0\), so no finite number can serve as \(W'(x_0)\); \(x_0\) was arbitrary, so \(W\) is differentiable nowhere.`,
        },
      },
    ],
  },
  {
    id: 'weierstrass-uniform-limit',
    statement: {
      ko: String.raw`각 부분합 \(W_N\)은 유한개의 코사인 합이므로 \(\mathbb{R}\)에서 매끄럽게(무한히) 미분가능합니다. 그런데 \(W_N \to W\)는 균등 수렴이고(문제 1), \(W\)는 어디에서도 미분가능하지 않습니다(문제 2). 따라서 미분가능한 함수들의 균등 극한은 미분가능하지 않을 수 있음을 결론지으세요.`,
      en: String.raw`Each partial sum \(W_N\) is a finite sum of cosines, hence smoothly (infinitely) differentiable on \(\mathbb{R}\). Yet \(W_N \to W\) uniformly (problem 1) while \(W\) is differentiable nowhere (problem 2). Conclude that a uniform limit of differentiable functions need not be differentiable.`,
    },
    display: [
      String.raw`W_N(x) = \sum_{n=0}^{N} a^n \cos(b^n \pi x) \quad \text{smooth on } \mathbb{R}`,
      String.raw`W_N \xrightarrow{\text{uniformly}} W, \qquad |W - W_N| \le \left(\tfrac12\right)^N \to 0`,
      String.raw`W \text{ differentiable nowhere (problem 2)}`,
    ],
    preset: { n: 2 },
    presetCaption: {
      ko: String.raw`\(n = 2\): 매끄러운 항 3개의 합 (\(W_2(0) = 1.75\), 꼬리 상한 \((1/2)^2 = 0.25\)) — 이렇게 매끄러운 것들의 균등 극한이 미분가능하지 않을 수 있다.`,
      en: String.raw`\(n = 2\): a sum of three smooth terms (\(W_2(0) = 1.75\), tail bound \((1/2)^2 = 0.25\)) — a uniform limit of such smooth things can fail to be differentiable.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(W_N\)은 유한합이므로 항별 미분이 정당하다: \(W_N'(x) = -\sum_{n=0}^{N} a^n b^n \pi \sin(b^n \pi x)\)가 모든 \(x\)에서 존재한다. 예를 들어 \(W_2'(x) = -\pi\sin(\pi x) - \frac{13\pi}{2}\sin(13\pi x) - \frac{169\pi}{4}\sin(169\pi x)\)이다 (\(a^1 b^1 \pi = \frac{13\pi}{2}\), \(a^2 b^2 \pi = \frac{169\pi}{4}\)). 화면의 모든 곡선은 매끄러운 함수이다.`,
          en: String.raw`Each \(W_N\) is a finite sum, so termwise differentiation is legitimate: \(W_N'(x) = -\sum_{n=0}^{N} a^n b^n \pi \sin(b^n \pi x)\) exists at every \(x\). For instance \(W_2'(x) = -\pi\sin(\pi x) - \frac{13\pi}{2}\sin(13\pi x) - \frac{169\pi}{4}\sin(169\pi x)\) (since \(a^1 b^1 \pi = \frac{13\pi}{2}\) and \(a^2 b^2 \pi = \frac{169\pi}{4}\)). Every curve on screen is a smooth function.`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 문제 1의 꼬리 상한 \(|W - W_N| \le (1/2)^N \to 0\)에 의해 \(W_N \to W\)는 \(\mathbb{R}\)에서 균등 수렴이다. 그리고 문제 2에 의해 극한 \(W\)는 어떤 점에서도 미분가능하지 않다.`,
          en: String.raw`But by problem 1's tail bound \(|W - W_N| \le (1/2)^N \to 0\), we have \(W_N \to W\) uniformly on \(\mathbb{R}\). And by problem 2, the limit \(W\) is differentiable at no point.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 미분가능한 함수들의 균등 극한은 미분가능하지 않을 수 있다 — 연속성은 균등 극한에서 보존되지만(문제 1의 논증), 미분가능성은 그렇지 않다. 이것이 해석학이 항별 미분에 더 강한 수렴(예: 도함수들의 균등 수렴)을 요구하는 이유이다.`,
          en: String.raw`Hence a uniform limit of differentiable functions need not be differentiable — continuity is preserved under uniform limits (problem 1's argument), but differentiability is not. This is why analysis demands stronger convergence (e.g. uniform convergence of the derivatives) before differentiating termwise.`,
        },
      },
    ],
  },
];
