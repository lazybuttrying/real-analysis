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
          ko: String.raw`두 행 \((1, 2, 3)\)와 \((4, 5, 6)\)는 모두 0이 아닌 벡터입니다 — 이 확인이 필요합니다: 0인 행은 다른 행의 \(0\)배이므로, "스칼라 배수가 아니다"라는 판정은 0이 아닌 행에서만 독립을 줍니다. 어느 행도 다른 행의 스칼라 배수가 아니므로(예: \(4 \cdot (1, 2, 3) = (4, 8, 12) \ne (4, 5, 6)\), 첫 좌표로 강제되는 배수 \(4\)가 둘째 좌표에서 실패합니다) 두 행은 선형독립이라 행 랭크는 \(2\)입니다. 열 랭크도 직접 확인합니다(행 랭크 \(=\) 열 랭크를 인용하지 않습니다): 처음 두 열 \((1, 4)^T\), \((2, 5)^T\)에 대해 \(\det \begin{pmatrix} 1 & 2 \\ 4 & 5 \end{pmatrix} = 1 \cdot 5 - 2 \cdot 4 = -3 \ne 0\)이므로 이 두 열은 선형독립이고, 열공간은 \(\mathbb{R}^2\) 전체라 열 랭크도 \(2\)입니다. 따라서 랭크는 \(\operatorname{rank} T = 2\)입니다.`,
          en: String.raw`Both rows \((1, 2, 3)\) and \((4, 5, 6)\) are nonzero — this check is needed: a zero row IS a scalar multiple (\(0\) times) of the other, so the "not a scalar multiple" criterion yields independence only for nonzero rows. Neither row is a scalar multiple of the other (e.g. \(4 \cdot (1, 2, 3) = (4, 8, 12) \ne (4, 5, 6)\): the multiple \(4\) forced by the first coordinate already fails at the second), so the rows are linearly independent and the row rank is \(2\). Verify the column rank directly too (without citing row rank \(=\) column rank): for the first two columns \((1, 4)^T\), \((2, 5)^T\), \(\det \begin{pmatrix} 1 & 2 \\ 4 & 5 \end{pmatrix} = 1 \cdot 5 - 2 \cdot 4 = -3 \ne 0\), so these two columns are linearly independent, the column space is all of \(\mathbb{R}^2\), and the column rank is also \(2\). Hence \(\operatorname{rank} T = 2\).`,
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
          ko: String.raw`이제 \((x, y, z)^T \in \ker T\)인 임의의 벡터를 봅니다. 두 방정식 \(x + 2y + 3z = 0\)과 \(4x + 5y + 6z = 0\)에서, 두 번째 식에서 첫 번째 식의 4배를 빼면 \(-3y - 6z = 0\), 즉 \(y = -2z\)입니다. 이를 첫 번째 식에 대입하면 \(x = -2y - 3z = 4z - 3z = z\)이므로, \((x, y, z) = (z, -2z, z) = z \cdot (1, -2, 1) = (-z) \cdot (-1, 2, -1)\)입니다. 즉 모든 핵 벡터는 \((-1, 2, -1)^T\)의 스칼라 배수이므로 \(\dim \ker T \le 1\)입니다. 앞 단계에서 \(\dim \ker T \ge 1\)을 보였으므로 널리티는 정확히 \(1\)이고, \(\operatorname{rank} T + \operatorname{nullity} T = 2 + 1 = 3 = \dim \mathbb{R}^3\)으로 차원–랭크 정리가 성립합니다 — 정리 자체를 인용하지 않고 양쪽을 직접 계산했습니다.`,
          en: String.raw`Now take any \((x, y, z)^T \in \ker T\). From the two equations \(x + 2y + 3z = 0\) and \(4x + 5y + 6z = 0\), subtracting 4 times the first from the second gives \(-3y - 6z = 0\), i.e. \(y = -2z\). Substituting into the first equation, \(x = -2y - 3z = 4z - 3z = z\), so \((x, y, z) = (z, -2z, z) = z \cdot (1, -2, 1) = (-z) \cdot (-1, 2, -1)\). Every kernel vector is a scalar multiple of \((-1, 2, -1)^T\), so \(\dim \ker T \le 1\). The previous step gave \(\dim \ker T \ge 1\), so the nullity is exactly \(1\), and \(\operatorname{rank} T + \operatorname{nullity} T = 2 + 1 = 3 = \dim \mathbb{R}^3\), verifying the rank–nullity theorem — both sides computed directly, with no appeal to the theorem itself.`,
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
          ko: String.raw`두 열은 \((2, 4)^T = 2(1, 2)^T\)이므로 한 열은 다른 열의 스칼라 배수입니다. 열 \((1, 2)^T\) 하나만으로 열공간 전체가 생성됩니다(생성). 독립성도 필요합니다: \((1, 2)^T \ne (0, 0)^T\)이므로 원소가 하나뿐인 집합 \(\{(1, 2)^T\}\)는 선형독립입니다 (\(c(1, 2)^T = 0\)이면 \(c = 0\)).`,
          en: String.raw`The columns satisfy \((2, 4)^T = 2(1, 2)^T\), so one column is a scalar multiple of the other. The single column \((1, 2)^T\) spans the whole column space (spanning). Independence is also required: since \((1, 2)^T \ne (0, 0)^T\), the singleton \(\{(1, 2)^T\}\) is linearly independent (if \(c(1, 2)^T = 0\) then \(c = 0\)).`,
        },
      },
      {
        text: {
          ko: String.raw`생성하고 독립이므로 열공간의 기저는 \(\{(1, 2)^T\}\)이고, \(\dim\)(열공간) \(= 1 =\) 랭크입니다.`,
          en: String.raw`Spanning and independent, hence a basis of the column space is \(\{(1, 2)^T\}\), and \(\dim\)(column space) \(= 1 =\) the rank.`,
        },
      },
    ],
  },
];
