import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's problems.ts (sibling data module).
 */
export const fourierEpicyclesProblems: readonly ProblemMeta[] = [
  {
    id: 'pair-at-zero',
    statement: {
      ko: String.raw`두 팔 프리셋에서 \(t = 0\)일 때 끝점 \(P(0)\)을 구하고, 왜 모든 팔이 한 방향으로 정렬되는지 설명하세요.`,
      en: String.raw`For the two-arm preset, find the endpoint \(P(0)\) at \(t = 0\) and explain why every arm points the same way.`,
    },
    display: [String.raw`P(t) = 1.4\,e^{-it} + 1.0\,e^{7it}, \qquad P(0) = 2.4`],
    preset: { preset: 'pair', arms: 2, phase: 0 },
    presetCaption: {
      ko: String.raw`\(t = 0\): 두 팔이 양의 실수 축 위에 겹쳐 정렬됩니다.`,
      en: String.raw`At \(t = 0\) the two arms align on the positive real axis.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(e^{i f \cdot 0} = 1\)이 모든 정수 \(f\)에 대해 성립하므로, 각 항은 길이 그대로 실수 축 위에 놓입니다.`,
          en: String.raw`Since \(e^{i f \cdot 0} = 1\) for every integer \(f\), each term lies on the real axis at its full length.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(P(0) = 1.4 + 1.0 = 2.4\)이며, 이는 길이 합과 같은 최대 도달 거리입니다.`,
          en: String.raw`Hence \(P(0) = 1.4 + 1.0 = 2.4\), the largest possible reach, equal to the sum of the lengths.`,
        },
      },
    ],
  },
  {
    id: 'integer-frequencies-close',
    statement: {
      ko: String.raw`주파수가 모두 정수이면 에피사이클 곡선은 \(2\pi\) 주기로 닫힘을 보이세요. 세 팔 프리셋으로 확인하세요.`,
      en: String.raw`Show that when every frequency is an integer, the epicycle curve closes with period \(2\pi\). Verify with the three-arm preset.`,
    },
    display: [String.raw`P(t + 2\pi) = \sum_k L_k e^{i f_k (t + 2\pi)} = \sum_k L_k e^{i f_k t} = P(t)`],
    preset: { preset: 'trio', arms: 3, phase: 0.8 },
    presetCaption: {
      ko: String.raw`주파수 \(-21, 35, 3\): 전부 정수이므로 곡선은 정확히 닫힙니다.`,
      en: String.raw`Frequencies \(-21, 35, 3\) are all integers, so the curve closes exactly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`정수 \(f\)에 대해 \(e^{i f (t + 2\pi)} = e^{i f t} e^{i 2\pi f} = e^{i f t}\)입니다. 뒤의 인자는 정확히 1이기 때문입니다.`,
          en: String.raw`For an integer \(f\), \(e^{i f (t + 2\pi)} = e^{i f t} e^{i 2\pi f} = e^{i f t}\), because the last factor is exactly 1.`,
        },
      },
      {
        text: {
          ko: String.raw`모든 항이 그대로 돌아오므로 합 \(P\)도 그대로 돌아옵니다. 즉 곡선은 \(t \in [0, 2\pi]\) 한 바퀴로 완성됩니다.`,
          en: String.raw`Every term returns to itself, so the sum \(P\) does too: the whole curve is drawn in one sweep \(t \in [0, 2\pi]\).`,
        },
      },
      {
        text: {
          ko: String.raw`주파수가 정수가 아니면 이 인자가 1이 아니어서 곡선이 닫히지 않을 수 있습니다. 닫힘은 정수 주파수의 산술적 성질입니다.`,
          en: String.raw`For a non-integer frequency that factor is not 1 and the curve may fail to close. Closure is an arithmetic property of integer frequencies.`,
        },
      },
    ],
  },
  {
    id: 'triangle-inequality-disk',
    statement: {
      ko: String.raw`끝점은 언제나 반지름이 길이 합인 원판 안에 머무름을 보이고, 세 팔 프리셋에서 그 반지름이 정확히 \(3\)임을 확인하세요.`,
      en: String.raw`Show that the endpoint always stays in the disk whose radius is the sum of the arm lengths, and check that for the three-arm preset this radius is exactly \(3\).`,
    },
    display: [String.raw`|P(t)| \le \sum_k L_k = 1.38 + 0.99 + 0.63 = 3.00`],
    preset: { preset: 'trio', arms: 3, phase: 2.1 },
    presetCaption: {
      ko: String.raw`점선 원이 반지름 \(3\)인 경계입니다. 끝점은 절대 이 원을 벗어나지 않습니다.`,
      en: String.raw`The dashed circle is the radius \(3\) bound. The endpoint never leaves it.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`삼각부등식으로 \(|P(t)| = \left|\sum_k L_k e^{i f_k t}\right| \le \sum_k L_k \left|e^{i f_k t}\right| = \sum_k L_k\)입니다. 각 지수 인자의 절댓값은 1이기 때문입니다.`,
          en: String.raw`By the triangle inequality, \(|P(t)| = \left|\sum_k L_k e^{i f_k t}\right| \le \sum_k L_k \left|e^{i f_k t}\right| = \sum_k L_k\), since each exponential factor has modulus 1.`,
        },
      },
      {
        text: {
          ko: String.raw`세 팔 프리셋의 길이 합은 \(1.38 + 0.99 + 0.63 = 3.00\)이므로, 끝점은 반지름 \(3\)인 원판 안에 있습니다.`,
          en: String.raw`The three-arm preset has length sum \(1.38 + 0.99 + 0.63 = 3.00\), so its endpoint stays in the disk of radius \(3\).`,
        },
      },
      {
        text: {
          ko: String.raw`등호는 \(t = 0\)처럼 모든 팔이 같은 방향을 가리킬 때만 성립합니다.`,
          en: String.raw`Equality holds only when every arm points the same way, as at \(t = 0\).`,
        },
      },
    ],
  },
];
