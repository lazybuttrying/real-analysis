import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's problems.ts (sibling data module).
 */
export const jacobianGridProblems: readonly ProblemMeta[] = [
  {
    id: 'polar-jacobian',
    statement: {
      ko: String.raw`극좌표 변환 \((r, \theta) \mapsto (r\cos\theta, r\sin\theta)\)의 야코비 행렬과 행렬식을 구하세요.`,
      en: String.raw`Find the Jacobian matrix and determinant of the polar map \((r, \theta) \mapsto (r\cos\theta, r\sin\theta)\).`,
    },
    display: [
      String.raw`J = \begin{pmatrix} \cos\theta & -r\sin\theta \\ \sin\theta & r\cos\theta \end{pmatrix}, \qquad \det J = r\cos^2\theta + r\sin^2\theta = r`,
    ],
    preset: { map: 'polar', cellI: 3, cellJ: 1 },
    presetCaption: {
      ko: String.raw`극좌표에서는 셀이 원점에서 멀수록 같은 각도 폭이어도 넓게 벌어집니다. 그 배율이 \(r\)입니다.`,
      en: String.raw`In polar coordinates a cell fans out wider as it moves from the origin, at the same angle width. The factor is \(r\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`편도함수는 \(\frac{\partial x}{\partial r} = \cos\theta\), \(\frac{\partial x}{\partial \theta} = -r\sin\theta\), \(\frac{\partial y}{\partial r} = \sin\theta\), \(\frac{\partial y}{\partial \theta} = r\cos\theta\)입니다.`,
          en: String.raw`The partials are \(\frac{\partial x}{\partial r} = \cos\theta\), \(\frac{\partial x}{\partial \theta} = -r\sin\theta\), \(\frac{\partial y}{\partial r} = \sin\theta\), \(\frac{\partial y}{\partial \theta} = r\cos\theta\).`,
        },
      },
      {
        text: {
          ko: String.raw`행렬식은 \(r\cos^2\theta + r\sin^2\theta = r\)입니다. 각도에 의존하지 않고 반지름에만 비례합니다.`,
          en: String.raw`The determinant is \(r\cos^2\theta + r\sin^2\theta = r\): independent of the angle, proportional to the radius alone.`,
        },
      },
    ],
  },
  {
    id: 'polar-cell-exact',
    statement: {
      ko: String.raw`이 씬의 격자에서 \(r \in [1.8, 2.4]\), \(\theta \in [\frac{2\pi}{5}, \frac{4\pi}{5}]\)인 칸의 넓이 비율이 정확히 중심 반지름 \(2.1\)과 같음을 보이세요.`,
      en: String.raw`On this scene's grid, show that the cell \(r \in [1.8, 2.4]\), \(\theta \in [\frac{2\pi}{5}, \frac{4\pi}{5}]\) has area ratio exactly equal to its center radius \(2.1\).`,
    },
    display: [
      String.raw`\frac{\text{image area}}{\text{domain area}} = \frac{\frac12 (2.4^2 - 1.8^2)\,\Delta\theta}{0.6\,\Delta\theta} = \frac{1.8 + 2.4}{2} = 2.1`,
    ],
    preset: { map: 'polar', cellI: 3, cellJ: 1 },
    presetCaption: {
      ko: String.raw`초록 칸이 바로 이 칸입니다. 화면의 측정 비율과 계산이 일치합니다.`,
      en: String.raw`The green cell is this cell. The measured ratio on screen matches the computation.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부채꼴 고리 조각의 넓이는 \(\frac12 (r_2^2 - r_1^2)\,\Delta\theta\)이고, 정의역 칸의 넓이는 \((r_2 - r_1)\,\Delta\theta = 0.6\,\Delta\theta\)입니다.`,
          en: String.raw`An annular sector has area \(\frac12 (r_2^2 - r_1^2)\,\Delta\theta\), and the domain cell has area \((r_2 - r_1)\,\Delta\theta = 0.6\,\Delta\theta\).`,
        },
      },
      {
        text: {
          ko: String.raw`비율은 \(\frac{\frac12 (r_2^2 - r_1^2)}{r_2 - r_1} = \frac{r_1 + r_2}{2}\)로, 정확히 중심 반지름입니다. 극좌표에서는 측정 비율과 중심에서의 행렬식이 우연이 아니라 항등식으로 일치합니다.`,
          en: String.raw`The ratio is \(\frac{\frac12 (r_2^2 - r_1^2)}{r_2 - r_1} = \frac{r_1 + r_2}{2}\), exactly the center radius. For polar coordinates the measured ratio and the central determinant agree by identity, not by luck.`,
        },
      },
    ],
  },
  {
    id: 'square-map-det',
    statement: {
      ko: String.raw`복소 제곱 변환 \((u, v) \mapsto (u^2 - v^2, 2uv)\)의 행렬식이 \(4(u^2 + v^2)\)임을 보이고, 칸의 측정 넓이 비율이 중심값과 정확히 같지 않은 이유를 설명하세요.`,
      en: String.raw`Show the complex square map \((u, v) \mapsto (u^2 - v^2, 2uv)\) has determinant \(4(u^2 + v^2)\), and explain why a cell's measured area ratio is not exactly the center value here.`,
    },
    display: [String.raw`J = \begin{pmatrix} 2u & -2v \\ 2v & 2u \end{pmatrix}, \qquad \det J = 4u^2 + 4v^2`],
    preset: { map: 'square', cellI: 3, cellJ: 2 },
    presetCaption: {
      ko: String.raw`원점에서 멀어질수록 셀이 더 크게 늘어납니다. 칸 안에서도 배율이 계속 변합니다.`,
      en: String.raw`Cells stretch more as they leave the origin. The factor keeps changing inside one cell.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`편도함수를 모으면 \(J = \begin{pmatrix} 2u & -2v \\ 2v & 2u \end{pmatrix}\)이고, 행렬식은 \(4u^2 + 4v^2 = 4(u^2 + v^2)\)입니다.`,
          en: String.raw`Collecting partials gives \(J = \begin{pmatrix} 2u & -2v \\ 2v & 2u \end{pmatrix}\) with determinant \(4u^2 + 4v^2 = 4(u^2 + v^2)\).`,
        },
      },
      {
        text: {
          ko: String.raw`측정 비율은 칸 전체에 걸친 행렬식의 평균에 가깝고, 중심값은 한 점의 값일 뿐입니다. 행렬식이 칸 안에서 변하면 둘은 어긋납니다.`,
          en: String.raw`The measured ratio is close to the cell-wide average of the determinant, while the center value is a single point's value. When the determinant varies inside the cell, the two differ.`,
        },
      },
      {
        text: {
          ko: String.raw`칸을 잘게 나눌수록 행렬식의 변동이 작아져서, 측정 비율은 중심값으로 수렴합니다. 이것이 치환적분에서 행렬식이 등장하는 이유입니다.`,
          en: String.raw`Finer cells vary less, so the measured ratio converges to the center value. This is why the determinant appears in change of variables.`,
        },
      },
    ],
  },
];
