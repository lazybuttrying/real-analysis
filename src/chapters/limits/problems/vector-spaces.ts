import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'sequence-space-axioms',
          statement: {
            ko: String.raw`실수 수열 전체의 집합 \(S\)에 각 항별 덧셈 \((x+y)_n = x_n + y_n\)과 스칼라곱 \((cx)_n = cx_n\)을 주면 벡터공간이 됨을 보이세요.`,
            en: String.raw`Show that the set \(S\) of all real sequences, with termwise addition \((x+y)_n = x_n + y_n\) and scalar multiplication \((cx)_n = cx_n\), is a vector space.`,
          },
          display: [String.raw`(x+y)_n = x_n + y_n,\qquad (cx)_n = cx_n`],
          preset: { a: 1, b: 0.5 },
          presetCaption: {
            ko: String.raw`슬라이더 \(a = 1\), \(b = 0.5\) — 직선 \(y = 1 + 0.5x\)와 점 \((1, 0.5)\).`,
            en: String.raw`Sliders \(a = 1\), \(b = 0.5\) — the line \(y = 1 + 0.5x\) and the point \((1, 0.5)\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`닫힘: \(x, y \in S\)이면 \(x + y = (x_n + y_n)\)의 각 항은 실수이므로 \(x + y \in S\)입니다. 마찬가지로 \(cx = (cx_n)\)의 각 항도 실수이므로 \(cx \in S\)입니다.`,
                en: String.raw`Closure: if \(x, y \in S\) then every term of \(x + y = (x_n + y_n)\) is real, so \(x + y \in S\). Likewise every term of \(cx = (cx_n)\) is real, so \(cx \in S\).`,
              },
            },
            {
              text: {
                ko: String.raw`덧셈에 대해 \((S, +)\)는 아벨군입니다: 교환·결합법칙은 각 항에서 실수의 성질을 그대로 이어받고, 항등원은 영수열 \((0, 0, \dots)\)이며, \(x\)의 역원은 \((-x_n)\)입니다.`,
                en: String.raw`\((S, +)\) is an abelian group: commutativity and associativity are inherited termwise from \(\mathbb{R}\), the identity is the zero sequence \((0, 0, \dots)\), and the inverse of \(x\) is \((-x_n)\).`,
              },
            },
            {
              text: {
                ko: String.raw`스칼라곱의 결합법칙과 단위원도 각 항에서 성립합니다: \((c(dx))_n = c(dx_n) = (cd)x_n = ((cd)x)_n\)이며 \((1x)_n = 1 \cdot x_n = x_n\)입니다.`,
                en: String.raw`The remaining scalar axioms hold termwise too: \((c(dx))_n = c(dx_n) = (cd)x_n = ((cd)x)_n\), and \((1x)_n = 1 \cdot x_n = x_n\).`,
              },
            },
            {
              text: {
                ko: String.raw`분배법칙은 수열 수준에서 직접 확인됩니다: \((c(x+y))_n = c(x_n + y_n) = cx_n + cy_n = (cx + cy)_n\)이며, \(((c+d)x)_n = (c+d)x_n = cx_n + dx_n = (cx + dx)_n\)입니다. 따라서 \(S\)는 \(\mathbb{R}\) 위의 벡터공간입니다.`,
                en: String.raw`The distributive laws check out at the sequence level: \((c(x+y))_n = c(x_n + y_n) = cx_n + cy_n = (cx + cy)_n\), and \(((c+d)x)_n = (c+d)x_n = cx_n + dx_n = (cx + dx)_n\). Hence \(S\) is a vector space over \(\mathbb{R}\).`,
              },
            },
          ],
        },
        {
          id: 'r2-c-iso',
          statement: {
            ko: String.raw`\(\Phi(a, b) = a + bi\)가 실벡터공간으로서 \(\mathbb{R}^2\)에서 \(\mathbb{C}\)로의 동형사상임을 증명하세요.`,
            en: String.raw`Prove that \(\Phi(a, b) = a + bi\) is an isomorphism \(\mathbb{R}^2 \to \mathbb{C}\) of real vector spaces.`,
          },
          display: [String.raw`\Phi(a, b) = a + bi,\qquad \Psi(a + bi) = (a, b)`],
          preset: { a: 0, b: 1 },
          presetCaption: {
            ko: String.raw`\(\Phi(0, 1) = i\) — 허수 단위 \(i\)가 점 \((0, 1)\)에 대응합니다.`,
            en: String.raw`\(\Phi(0, 1) = i\) — the imaginary unit \(i\) sits at the point \((0, 1)\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`덧셈에 대한 선형성: \(\Phi((a,b) + (c,d)) = \Phi(a+c, b+d) = (a+c) + (b+d)i = (a+bi) + (c+di) = \Phi(a,b) + \Phi(c,d)\)입니다.`,
                en: String.raw`Additivity: \(\Phi((a,b) + (c,d)) = \Phi(a+c, b+d) = (a+c) + (b+d)i = (a+bi) + (c+di) = \Phi(a,b) + \Phi(c,d)\).`,
              },
            },
            {
              text: {
                ko: String.raw`실수 스칼라에 대한 동차성: 실수 \(t\)에 대해 \(\Phi(t(a,b)) = ta + tbi = t(a+bi) = t\Phi(a,b)\)입니다. 스칼라가 실수라는 점이 중요합니다 — 이것이 실벡터공간으로서의 동형사상입니다.`,
                en: String.raw`Homogeneity for real scalars: for real \(t\), \(\Phi(t(a,b)) = ta + tbi = t(a+bi) = t\Phi(a,b)\). The scalars being real is the point — this is an isomorphism of real vector spaces.`,
              },
            },
            {
              text: {
                ko: String.raw`단사: \(a + bi = c + di\)이면 복소수의 실수부·허수부가 유일하므로 \(a = c\), \(b = d\)입니다. 따라서 \(\Phi\)는 단사입니다.`,
                en: String.raw`Injectivity: \(a + bi = c + di\) forces \(a = c\) and \(b = d\) by uniqueness of real and imaginary parts, so \(\Phi\) is injective.`,
              },
            },
            {
              text: {
                ko: String.raw`전사: \(\Psi(a+bi) = (a,b)\)라 두면 \(\Psi(\Phi(a,b)) = (a,b)\)이고 \(\Phi(\Psi(a+bi)) = a+bi\)이므로 \(\Psi\)는 \(\Phi\)의 역함수입니다. 전단사인 선형사상이므로 \(\Phi\)는 동형사상입니다.`,
                en: String.raw`Surjectivity: with \(\Psi(a+bi) = (a,b)\) we have \(\Psi(\Phi(a,b)) = (a,b)\) and \(\Phi(\Psi(a+bi)) = a+bi\), so \(\Psi\) is the inverse of \(\Phi\). A bijective linear map is an isomorphism.`,
              },
            },
          ],
        },
        {
          id: 'iso-preserves-independence',
          statement: {
            ko: String.raw`선형 동형사상 \(T: V \to W\)는 일차독립인 집합을 일차독립인 집합으로 보냄을 증명하세요.`,
            en: String.raw`Prove that a linear isomorphism \(T: V \to W\) sends linearly independent sets to linearly independent sets.`,
          },
          display: [String.raw`\sum_{i=1}^{n} c_i\,T(v_i) = 0 \;\Longrightarrow\; c_1 = \cdots = c_n = 0`],
          preset: { a: 1, b: -1 },
          presetCaption: {
            ko: String.raw`슬라이더 \(a = 1\), \(b = -1\) — 직선 \(y = 1 - x\)와 점 \((1, -1)\).`,
            en: String.raw`Sliders \(a = 1\), \(b = -1\) — the line \(y = 1 - x\) and the point \((1, -1)\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\{v_1, \dots, v_n\} \subset V\)가 일차독립이고 \(\sum c_i T(v_i) = 0\)이라 가정합니다. 선형성에 의해 \(\sum c_i T(v_i) = T(\sum c_i v_i)\)이므로 \(T(\sum c_i v_i) = 0\)을 얻습니다.`,
                en: String.raw`Assume \(\{v_1, \dots, v_n\} \subset V\) is linearly independent and \(\sum c_i T(v_i) = 0\). By linearity, \(\sum c_i T(v_i) = T(\sum c_i v_i)\), so \(T(\sum c_i v_i) = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`선형사상은 영벡터를 영벡터로 보내므로 (\(T(0) = T(0 \cdot v) = 0 \cdot T(v) = 0\)), \(T\)의 단사성에서 \(\sum c_i v_i = 0\)을 얻습니다.`,
                en: String.raw`Linear maps send \(0\) to \(0\) (\(T(0) = T(0 \cdot v) = 0 \cdot T(v) = 0\)), so injectivity of \(T\) gives \(\sum c_i v_i = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\{v_i\}\)의 일차독립성에 의해 \(c_1 = \cdots = c_n = 0\)입니다. 따라서 \(\{T(v_1), \dots, T(v_n)\}\)도 일차독립입니다.`,
                en: String.raw`Independence of \(\{v_i\}\) forces \(c_1 = \cdots = c_n = 0\). Hence \(\{T(v_1), \dots, T(v_n)\}\) is linearly independent.`,
              },
            },
            {
              text: {
                ko: String.raw`임의의 (무한할 수 있는) 일차독립 집합으로의 축소: \(E \subseteq V\)가 일차독립이라 둡니다. \(T(E)\)의 임의의 유한 부분집합은 \(\{T(v_1), \dots, T(v_n)\}\) (\(v_i \in E\) 서로 다름; \(T\)가 단사이므로 상도 서로 다름) 꼴이며, \(\{v_1, \dots, v_n\} \subseteq E\)가 일차독립이므로 위의 유한 경우에 의해 이 유한 부분집합도 일차독립입니다. 집합이 일차독립이라는 것은 정확히 그 모든 유한 부분집합이 일차독립이라는 뜻이므로, \(T(E)\) 전체가 일차독립입니다.`,
                en: String.raw`Reduction to arbitrary (possibly infinite) independent sets: let \(E \subseteq V\) be linearly independent. Every finite subset of \(T(E)\) has the form \(\{T(v_1), \dots, T(v_n)\}\) with distinct \(v_i \in E\) (injectivity of \(T\) keeps the images distinct), and \(\{v_1, \dots, v_n\} \subseteq E\) is independent, so the finite case above makes this finite subset independent. A set is linearly independent exactly when every finite subset of it is, hence the whole image \(T(E)\) is linearly independent.`,
              },
            },
          ],
        },
      ];
