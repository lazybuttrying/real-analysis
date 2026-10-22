import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'discrete-axioms',
          statement: {
            ko: String.raw`이산 거리 \(d(x,y)=0\) (\(x=y\)일 때), \(1\) (그 외)이 거리 공리를 만족함을 증명하세요.`,
            en: String.raw`Prove the discrete metric \(d(x,y)=0\) if \(x=y\), \(1\) otherwise, satisfies the metric axioms.`,
          },
          display: [
            String.raw`d(x,y) \geq 0,\quad d(x,y)=0 \iff x=y`,
            String.raw`d(x,y)=d(y,x),\quad d(x,z) \leq d(x,y)+d(y,z)`,
          ],
          preset: { metric: 'discrete', r: 0.5 },
          presetCaption: {
            ko: String.raw`이산 거리, \(r = 0.5\) — \(B(p_0, 0.5) = \{p_0\}\)`,
            en: String.raw`Discrete metric, \(r = 0.5\) — \(B(p_0, 0.5) = \{p_0\}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(d(x,y)\)의 값은 \(0\) 또는 \(1\)뿐이므로 \(d(x,y) \geq 0\)이다. 정의에 의해 \(x = y\)일 때 정확히 \(d(x,y) = 0\)이고, \(x \neq y\)일 때 \(d(x,y) = 1\)이므로 \(d(x,y) = 0 \iff x = y\)이다.`,
                en: String.raw`\(d(x,y)\) takes only the values \(0\) or \(1\), so \(d(x,y) \geq 0\). By definition \(d(x,y) = 0\) exactly when \(x = y\), and \(d(x,y) = 1\) when \(x \neq y\), so \(d(x,y) = 0 \iff x = y\).`,
              },
            },
            {
              text: {
                ko: String.raw`대칭성: \(x = y\)이면 \(d(x,y) = 0 = d(y,x)\)이고, \(x \neq y\)이면 \(d(x,y) = 1 = d(y,x)\)이므로 \(d(x,y) = d(y,x)\)이다.`,
                en: String.raw`Symmetry: if \(x = y\) then \(d(x,y) = 0 = d(y,x)\), and if \(x \neq y\) then \(d(x,y) = 1 = d(y,x)\), so \(d(x,y) = d(y,x)\).`,
              },
            },
            {
              text: {
                ko: String.raw`삼각 부등식을 경우로 나누어 보인다. \(x = z\)이면 좌변 \(d(x,z) = 0 \leq d(x,y) + d(y,z)\)이다.

\(x \neq z\)이면 좌변 \(d(x,z) = 1\)이다. 이때 임의의 \(y\)에 대해, \(y\)가 \(x\)와 같으면 우변은 \(0 + 1 = 1\), \(y\)가 \(z\)와 같으면 \(1 + 0 = 1\), \(y\)가 둘 다와 다르면 \(1 + 1 = 2\)이므로, 어느 경우에도 \(1 \leq d(x,y) + d(y,z)\)이다.`,
                en: String.raw`For the triangle inequality, argue by cases. If \(x = z\) then the left side is \(d(x,z) = 0 \leq d(x,y) + d(y,z)\).

If \(x \neq z\) then the left side is \(d(x,z) = 1\). For any \(y\): if \(y\) equals \(x\) the right side is \(0 + 1 = 1\); if \(y\) equals \(z\) it is \(1 + 0 = 1\); if \(y\) equals neither it is \(1 + 1 = 2\). In every case \(1 \leq d(x,y) + d(y,z)\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(d(x,z) \leq d(x,y) + d(y,z)\)가 모든 \(x, y, z\)에 대해 성립한다 — 이산 거리는 거리 공리를 모두 만족한다.`,
                en: String.raw`Hence \(d(x,z) \leq d(x,y) + d(y,z)\) holds for all \(x, y, z\) — the discrete metric satisfies all the metric axioms.`,
              },
            },
          ],
        },
        {
          id: 'discrete-open',
          statement: {
            ko: String.raw`이산 거리 공간에서는 모든 부분집합이 열린집합임을 증명하세요.`,
            en: String.raw`Prove every subset of a discrete metric space is open.`,
          },
          display: [String.raw`B(x, 1/2) = \{x\}`],
          preset: { metric: 'discrete', r: 0.5 },
          presetCaption: {
            ko: String.raw`\(r = 0.5 < 1\) — 모든 한 점 집합이 열린 공이다.`,
            en: String.raw`\(r = 0.5 < 1\) — every singleton is an open ball.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(A\)를 이산 거리 공간의 임의의 부분집합이라 하자. \(A = \emptyset\)이면 확인할 점이 없어 \(A\)는 자명하게 열린집합이다.

그 외의 경우 \(x \in A\)를 잡자.`,
                en: String.raw`Let \(A\) be any subset of a discrete metric space. If \(A = \emptyset\), then \(A\) is open vacuously — there is no point of \(A\) at which openness could fail.

Otherwise take \(x \in A\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(r = 1/2\)이라 두면 \(B(x, 1/2) = \{x\}\)이다: \(d(x,y) < 1/2\)이면 \(d(x,y)\)의 값이 \(0\) 또는 \(1\)뿐이므로 \(d(x,y) = 0\)이어야 하고, 이는 \(y = x\)를 뜻한다.`,
                en: String.raw`With \(r = 1/2\) we have \(B(x, 1/2) = \{x\}\): if \(d(x,y) < 1/2\) then, since \(d(x,y)\) is only \(0\) or \(1\), we must have \(d(x,y) = 0\), i.e. \(y = x\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(B(x, 1/2) = \{x\} \subseteq A\)이다. \(x\)가 임의였으므로 \(A\)의 모든 점은 내점 — \(A\)는 열린집합이다.`,
                en: String.raw`Hence \(B(x, 1/2) = \{x\} \subseteq A\). Since \(x\) was arbitrary, every point of \(A\) is an interior point — \(A\) is open.`,
              },
            },
          ],
        },
        {
          id: 'discrete-convergent',
          statement: {
            ko: String.raw`이산 거리 공간에서 수렴하는 수열은 결국 상수 수열임을 증명하세요.`,
            en: String.raw`Prove a convergent sequence in a discrete metric space is eventually constant.`,
          },
          display: [String.raw`d(x_n, x) < 1/2 \implies x_n = x`],
          preset: { metric: 'discrete', r: 1.5 },
          presetCaption: {
            ko: String.raw`\(r = 1.5 > 1\) — 공이 전체 6점이 된다.`,
            en: String.raw`\(r = 1.5 > 1\) — the ball becomes all six points.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x_n \to x\)라 하자. 수렴의 정의에서 \(\varepsilon = 1/2\)에 대해, \(n \geq N\)이면 \(d(x_n, x) < 1/2\)인 \(N\)이 존재한다.`,
                en: String.raw`Let \(x_n \to x\). By the definition of convergence, with \(\varepsilon = 1/2\) there is an \(N\) such that \(d(x_n, x) < 1/2\) for all \(n \geq N\).`,
              },
            },
            {
              text: {
                ko: String.raw`이산 거리에서 \(d(x_n, x) < 1/2\)이면 \(d(x_n, x)\)의 가능한 값이 \(0\)뿐이므로 \(d(x_n, x) = 0\)이어야 하고, 이는 \(x_n = x\)를 뜻한다.`,
                en: String.raw`In the discrete metric, \(d(x_n, x) < 1/2\) forces \(d(x_n, x) = 0\) since \(0\) is the only attainable value, and that means \(x_n = x\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(n \geq N\)인 모든 \(n\)에 대해 \(x_n = x\) — 수열은 결국 상수 수열이다.`,
                en: String.raw`Thus \(x_n = x\) for all \(n \geq N\) — the sequence is eventually constant.`,
              },
            },
          ],
        },
      ];
