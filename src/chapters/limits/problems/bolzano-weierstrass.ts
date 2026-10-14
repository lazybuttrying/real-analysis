import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'alternating-subseq',
          statement: {
            ko: String.raw`수열 \(a_n = (-1)^n\)의 수렴하는 부분수열을 두 개 찾고, 각각의 극한을 구하세요.`,
            en: String.raw`Find two convergent subsequences of \(a_n = (-1)^n\) and compute their limits.`,
          },
          display: [String.raw`a_{2k} \to 1, \qquad a_{2k+1} \to -1`],
          preset: { steps: 4, seed: '7' },
          presetCaption: {
            ko: String.raw`데모 수열의 이분 과정 (4단계) — '반으로 접어 따라가기'라는 같은 아이디어입니다.`,
            en: String.raw`Bisection on the demo sequence (4 steps) — the same "halve and follow" idea.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`짝수 항만 취하면 \(a_{2k} = (-1)^{2k} = 1\) (모든 \(k\)에 대해)이므로, 부분수열 \((a_{2k})\)는 상수수열 \(1, 1, 1, \ldots\)이고 \(1\)로 수렴합니다.`,
                en: String.raw`Taking even indices, \(a_{2k} = (-1)^{2k} = 1\) for every \(k\), so \((a_{2k})\) is the constant sequence \(1, 1, 1, \ldots\), converging to \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`홀수 항만 취하면 \(a_{2k+1} = (-1)^{2k+1} = -1\) (모든 \(k\)에 대해)이므로, \((a_{2k+1})\)은 \(-1\)로 수렴합니다.`,
                en: String.raw`Taking odd indices, \(a_{2k+1} = (-1)^{2k+1} = -1\) for every \(k\), so \((a_{2k+1})\) converges to \(-1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\((2k)\)와 \((2k+1)\)은 모두 엄격히 증가하는 자연수열이므로, 이들은 진짜 부분수열입니다. 유계수열 \((-1)^n\) 안에는 서로 다른 극한을 갖는 수렴 부분수열이 둘 이상 숨어 있었던 것입니다.`,
                en: String.raw`Both \((2k)\) and \((2k+1)\) are strictly increasing index sequences, so these are genuine subsequences. The bounded sequence \((-1)^n\) was hiding more than one convergent subsequence, with different limits.`,
              },
            },
          ],
        },
        {
          id: 'sine-subseq',
          statement: {
            ko: String.raw`\((\sin n)\)이 유계수열임을 보이고, 볼차노–바이어슈트라스 정리로부터 수렴하는 부분수열이 존재함을 결론지으세요.`,
            en: String.raw`Show that \((\sin n)\) is bounded, and conclude via Bolzano–Weierstrass that a convergent subsequence exists.`,
          },
          display: [String.raw`|\sin n| \leq 1 \ \Longrightarrow\ \exists\, n_1 < n_2 < \cdots:\ \lim_{k \to \infty} \sin(n_k) \in [-1,1]`],
          preset: { steps: 6, seed: '21' },
          presetCaption: {
            ko: String.raw`데모 수열의 이분 과정 (6단계) — 유계성이 핵심 가설입니다.`,
            en: String.raw`Bisection on the demo sequence (6 steps) — boundedness is the key hypothesis.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`모든 정수 \(n\)에 대해 \(|\sin n| \leq 1\)이므로, 수열 \((\sin n)\)은 유계입니다.`,
                en: String.raw`\(|\sin n| \leq 1\) for every integer \(n\), so \((\sin n)\) is a bounded sequence.`,
              },
            },
            {
              text: {
                ko: String.raw`볼차노–바이어슈트라스 정리에 의해, 수렴하는 부분수열 \((\sin(n_k))\)가 존재합니다 (극한은 \([-1,1]\) 안의 어떤 값입니다).`,
                en: String.raw`By the Bolzano–Weierstrass theorem, a convergent subsequence \((\sin(n_k))\) exists (its limit is some value in \([-1,1]\)).`,
              },
            },
            {
              text: {
                ko: String.raw`정리는 존재만 보장할 뿐 어떤 부분수열인지는 알려주지 않습니다. 수치적인 예시로, \(\sin(35489) \approx 0.9999990\), \(\sin(36199) \approx 0.9999991\)처럼 \(1\) 근처에 항들이 모이는 모습을 볼 수 있습니다 — 이는 예시일 뿐 증명이 아닙니다.`,
                en: String.raw`The theorem only guarantees existence; it does not say which subsequence. As a numerical illustration (not a proof), terms pile up near \(1\): \(\sin(35489) \approx 0.9999990\) and \(\sin(36199) \approx 0.9999991\).`,
              },
            },
          ],
        },
        {
          id: 'unbounded-counterexample',
          statement: {
            ko: String.raw`\(a_n = n\)은 수렴하는 부분수열을 갖지 않음을 증명하세요. 유계성 가설이 왜 필요한지 보여줍니다.`,
            en: String.raw`Prove that \(a_n = n\) has no convergent subsequence — showing why the boundedness hypothesis is essential.`,
          },
          display: [String.raw`n_k \geq k \to \infty`],
          preset: { steps: 8, seed: '99' },
          presetCaption: {
            ko: String.raw`데모는 \([0,1]\) 안에 갇혀 있기에 이분이 통합니다. 유계성이 없으면 이 그림 자체가 그려지지 않습니다.`,
            en: String.raw`The demo stays trapped in \([0,1]\), which is why bisection works. Without boundedness this picture cannot even be drawn.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((n_k)\)를 \((n)\)의 임의의 부분수열이라 하자. 지표가 엄격히 증가하므로 귀납법으로 \(n_k \geq k\)를 얻는다: \(n_1 \geq 1\)이고, \(n_{k+1} > n_k \geq k\)이므로 \(n_{k+1} \geq k+1\)이다.`,
                en: String.raw`Let \((n_k)\) be any subsequence of \((n)\). Its indices are strictly increasing, so \(n_k \geq k\) by induction: \(n_1 \geq 1\), and \(n_{k+1} > n_k \geq k\) gives \(n_{k+1} \geq k+1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(n_k \geq k \to \infty\)이므로, 모든 부분수열은 위로 비유계이고 발산한다.`,
                en: String.raw`Hence \(n_k \geq k \to \infty\): every subsequence is unbounded above, hence divergent.`,
              },
            },
            {
              text: {
                ko: String.raw`수렴하는 수열은 유계이므로, 비유계인 \((n_k)\)는 수렴할 수 없다. 따라서 \((n)\)은 수렴하는 부분수열을 하나도 갖지 않는다 — 볼차노–바이어슈트라스의 유계성 가설을 빼면 정리가 거짓이 된다.`,
                en: String.raw`A convergent sequence is bounded, so the unbounded \((n_k)\) cannot converge. Thus \((n)\) has no convergent subsequence at all — dropping the boundedness hypothesis makes the theorem false.`,
              },
            },
          ],
        },
      ];
