import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'standard-basis-r2',
    statement: {
      ko: String.raw`\(\{(1, 0), (0, 1)\}\)이 \(\mathbb{R}^2\)의 기저임을 보이세요.`,
      en: String.raw`Show that \(\{(1, 0), (0, 1)\}\) is a basis of \(\mathbb{R}^2\).`,
    },
    display: [String.raw`(x, y) = x(1, 0) + y(0, 1)`],
    preset: { preset: 'identity' },
    presetCaption: {
      ko: String.raw`항등행렬 — 표준기저 벡터를 그대로 보존합니다.`,
      en: String.raw`The identity matrix — it preserves the standard basis vectors.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`선형독립: \(c_1(1, 0) + c_2(0, 1) = (0, 0)\)이라 하면 좌표별로 \(c_1 = 0\), \(c_2 = 0\)이므로 자명한 결합만 영벡터를 만듭니다.`,
          en: String.raw`Independence: if \(c_1(1, 0) + c_2(0, 1) = (0, 0)\), coordinates give \(c_1 = 0\) and \(c_2 = 0\), so only the trivial combination yields the zero vector.`,
        },
      },
      {
        text: {
          ko: String.raw`생성: 임의의 \((x, y) \in \mathbb{R}^2\)에 대해 \((x, y) = x(1, 0) + y(0, 1)\)이므로 두 벡터의 선형결합으로 전체 \(\mathbb{R}^2\)가 만들어집니다.`,
          en: String.raw`Span: for any \((x, y) \in \mathbb{R}^2\), \((x, y) = x(1, 0) + y(0, 1)\), so the two vectors linearly span all of \(\mathbb{R}^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`독립이고 생성하므로 \(\{(1, 0), (0, 1)\}\)은 \(\mathbb{R}^2\)의 기저이며, \(\dim \mathbb{R}^2 = 2\)입니다.`,
          en: String.raw`Independent and spanning, hence \(\{(1, 0), (0, 1)\}\) is a basis of \(\mathbb{R}^2\), and \(\dim \mathbb{R}^2 = 2\).`,
        },
      },
    ],
  },
  {
    id: 'rank-nullity-3x2',
    statement: {
      ko: String.raw`\(A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}\)를 \(T: \mathbb{R}^3 \to \mathbb{R}^2\)로 보고, 랭크와 널리티를 구해 차원–랭크 정리를 확인하세요.`,
      en: String.raw`View \(A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}\) as \(T: \mathbb{R}^3 \to \mathbb{R}^2\); find its rank and nullity and verify the rank–nullity theorem.`,
    },
    display: [String.raw`\operatorname{rank} T + \operatorname{nullity} T = 2 + 1 = 3 = \dim \mathbb{R}^3`],
    preset: { preset: 'rank1' },
    presetCaption: {
      ko: String.raw`랭크 1 행렬 — 1차원 핵이 원점으로 접히고 1차원 상이 남습니다.`,
      en: String.raw`A rank-1 matrix — the one-dimensional kernel collapses to the origin, leaving a one-dimensional image.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`두 행 \((1, 2, 3)\)와 \((4, 5, 6)\) 중 어느 것도 다른 하나의 스칼라 배수가 아니므로(예: \(4 \cdot (1, 2, 3) = (4, 8, 12) \ne (4, 5, 6)\)) 두 행은 선형독립입니다. 따라서 행공간(열공간)의 차원인 랭크는 \(\operatorname{rank} T = 2\)입니다.`,
          en: String.raw`Neither row is a scalar multiple of the other (e.g. \(4 \cdot (1, 2, 3) = (4, 8, 12) \ne (4, 5, 6)\)), so the rows \((1, 2, 3)\) and \((4, 5, 6)\) are linearly independent. Hence the rank, the dimension of the row (column) space, is \(\operatorname{rank} T = 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`벡터 \((-1, 2, -1)^T\)를 대입하면 \(1(-1) + 2(2) + 3(-1) = -1 + 4 - 3 = 0\)이고 \(4(-1) + 5(2) + 6(-1) = -4 + 10 - 6 = 0\)이므로 이는 핵의 0이 아닌 원소입니다. 따라서 \(\dim \ker T \ge 1\)입니다.`,
          en: String.raw`Substituting \((-1, 2, -1)^T\) gives \(1(-1) + 2(2) + 3(-1) = -1 + 4 - 3 = 0\) and \(4(-1) + 5(2) + 6(-1) = -4 + 10 - 6 = 0\), so it is a nonzero element of the kernel. Thus \(\dim \ker T \ge 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`랭크 2인 \(2 \times 3\) 행렬의 핵은 정확히 1차원입니다(두 독립 방정식이 3차원을 1차원만큼 깎음). 따라서 널리티는 \(1\)이고, \(\operatorname{rank} T + \operatorname{nullity} T = 2 + 1 = 3 = \dim \mathbb{R}^3\)으로 차원–랭크 정리가 성립합니다.`,
          en: String.raw`For a rank-2 \(2 \times 3\) matrix, the kernel is exactly one-dimensional (two independent equations cut three dimensions down to one). So the nullity is \(1\), and \(\operatorname{rank} T + \operatorname{nullity} T = 2 + 1 = 3 = \dim \mathbb{R}^3\), verifying the rank–nullity theorem.`,
        },
      },
    ],
  },
  {
    id: 'rank-by-reduction',
    statement: {
      ko: String.raw`행렬 \(\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}\)의 랭크를 행 축소로 구하고, 열공간의 기저를 찾으세요.`,
      en: String.raw`Find the rank of \(\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}\) by row reduction, and exhibit a basis of its column space.`,
    },
    display: [String.raw`\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix} \xrightarrow{R_2 - 2R_1} \begin{pmatrix} 1 & 2 \\ 0 & 0 \end{pmatrix}`],
    preset: { preset: 'projection' },
    presetCaption: {
      ko: String.raw`투영 행렬 — 1차원 핵과 1차원 상을 보여주는 또 다른 랭크 1 예시.`,
      en: String.raw`A projection matrix — another rank-1 example with a one-dimensional kernel and image.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`행 연산 \(R_2 \to R_2 - 2R_1\)을 적용하면 행렬은 \(\begin{pmatrix} 1 & 2 \\ 0 & 0 \end{pmatrix}\)이 됩니다. 0이 아닌 행이 하나이므로 행공간의 차원, 즉 랭크는 \(1\)입니다.`,
          en: String.raw`Applying \(R_2 \to R_2 - 2R_1\) gives \(\begin{pmatrix} 1 & 2 \\ 0 & 0 \end{pmatrix}\). There is exactly one nonzero row, so the dimension of the row space — the rank — is \(1\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 열은 \((2, 4)^T = 2(1, 2)^T\)이므로 한 열은 다른 열의 스칼라 배수입니다. 열 \((1, 2)^T\) 하나만으로 열공간 전체가 생성됩니다.`,
          en: String.raw`The columns satisfy \((2, 4)^T = 2(1, 2)^T\), so one column is a scalar multiple of the other. The single column \((1, 2)^T\) spans the whole column space.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 열공간의 기저는 \(\{(1, 2)^T\}\)이고, \(\dim\)(열공간) \(= 1 =\) 랭크입니다.`,
          en: String.raw`Hence a basis of the column space is \(\{(1, 2)^T\}\), and \(\dim\)(column space) \(= 1 =\) the rank.`,
        },
      },
    ],
  },
];
