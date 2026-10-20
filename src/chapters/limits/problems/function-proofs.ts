import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the composition-laws scene
 * (g∘f injective => f injective; g∘f surjective => g surjective;
 * f, g bijective => g∘f bijective with reversed-order inverse).
 *
 * Every table below was verified against the model
 * (tests/function-proofs.test.ts): for 'injective-chain' and
 * 'surjective-chain', A = [0,1], B = [0,1,2], C = [0,1],
 * f = [0,1], g = [0,1,0], g∘f = [0,1]; for 'bijective',
 * A = B = C = [0,1,2], f = [1,2,0], g = [2,0,1], g∘f = [0,1,2],
 * f^-1 = [2,0,1], g^-1 = [1,2,0], and f^-1 ∘ g^-1 = [0,1,2].
 */
export const functionProofsProblems: readonly ProblemMeta[] = [
  {
    id: 'function-proofs-injective-implies',
    statement: {
      ko: String.raw`\(g \circ f\)가 단사(injective)라면 \(f\)도 단사임을 완전히 증명하세요. 그리고 씬의 injective-chain 예제(\(f = [0,1]\), \(g = [0,1,0]\))를 이용해, 이 가정이 \(g\) 자체에 대해서는 아무것도 보장하지 않음(\(g(0) = g(2) = 0\))을 확인하세요.`,
      en: String.raw`Prove completely that if \(g \circ f\) is injective then \(f\) is injective. Then use the scene's injective-chain tables (\(f = [0,1]\), \(g = [0,1,0]\)) to confirm that this hypothesis guarantees nothing about \(g\) itself (\(g(0) = g(2) = 0\)).`,
    },
    display: [
      String.raw`f(a_1) = f(a_2) \;\Rightarrow\; g(f(a_1)) = g(f(a_2)) \;\Rightarrow\; a_1 = a_2`,
      String.raw`g \circ f = [0, 1] \text{ injective},\quad g(0) = g(2) = 0 \;\Rightarrow\; g \text{ not injective}`,
    ],
    preset: { example: 'injective-chain' },
    presetCaption: {
      ko: String.raw`injective-chain: \(A = [0,1]\), \(B = [0,1,2]\), \(C = [0,1]\), \(f = [0,1]\), \(g = [0,1,0]\), 합성 \(g \circ f = [0,1]\) (단사). \(f\) 단사 ✓, \(g\) 단사 ✗.`,
      en: String.raw`injective-chain: \(A = [0,1]\), \(B = [0,1,2]\), \(C = [0,1]\), \(f = [0,1]\), \(g = [0,1,0]\), composition \(g \circ f = [0,1]\) (injective). \(f\) injective ✓, \(g\) injective ✗.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f(a_1) = f(a_2)\)라 가정하세요. 양변에 \(g\)를 적용하면 \((g \circ f)(a_1) = g(f(a_1)) = g(f(a_2)) = (g \circ f)(a_2)\)입니다. 가정에 의해 \(g \circ f\)는 단사이므로 \(a_1 = a_2\) — 따라서 \(f\)는 단사입니다. 그림으로는: 합성 화살표 끝에서 시작점을 유일하게 복원할 수 있다면, 앞쪽 화살표도 시작점을 유일하게 복원합니다.`,
          en: String.raw`Assume \(f(a_1) = f(a_2)\). Applying \(g\) to both sides gives \((g \circ f)(a_1) = g(f(a_1)) = g(f(a_2)) = (g \circ f)(a_2)\). By hypothesis \(g \circ f\) is injective, so \(a_1 = a_2\) — hence \(f\) is injective. In the picture: if the composite arrows recover the starting point uniquely, so do the first-stage arrows.`,
        },
      },
      {
        text: {
          ko: String.raw`역은 성립하지 않습니다: 씬의 표에서는 \(g \circ f = [0,1]\)이 단사이고 \(f = [0,1]\)도 단사이지만, \(g = [0,1,0]\)은 \(g(0) = g(2) = 0\)을 만족하므로 단사가 아닙니다. 뒷쪽 함수 \(g\)는 앞쪽 함수 \(f\)의 치역 밖에서 마음대로 충돌해도 합성의 단사성에는 영향을 주지 않습니다 (이 예제에서 \(2 \in B\)는 \(f\)의 치역에 들어가지 않습니다).`,
          en: String.raw`The converse fails: in the scene's tables, \(g \circ f = [0,1]\) is injective and \(f = [0,1]\) is injective, yet \(g = [0,1,0]\) satisfies \(g(0) = g(2) = 0\) and is not injective. The later map \(g\) may collide freely outside the image of \(f\) without affecting the composite's injectivity (here \(2 \in B\) lies outside the image of \(f\)).`,
        },
      },
    ],
  },
  {
    id: 'function-proofs-bijective-inverse-order',
    statement: {
      ko: String.raw`\(f\)와 \(g\)가 모두 전단사(bijective)라면 \(g \circ f\)도 전단사고 \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\)임을, 결합법칙을 써서 양쪽 곱이 항등함수가 됨을 보이는 방식으로 완전히 증명하세요. 씬의 bijective 표에서 \(g \circ f\)가 항등함수가 되는 것도 직접 확인하세요.`,
      en: String.raw`Prove completely that if \(f\) and \(g\) are both bijective then \(g \circ f\) is bijective and \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\), using associativity to show both products are the identity. Also verify directly on the scene's bijective tables that \(g \circ f\) comes out as the identity.`,
    },
    display: [
      String.raw`(f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (g^{-1} \circ g) \circ f = \mathrm{id}`,
      String.raw`(g \circ f) \circ (f^{-1} \circ g^{-1}) = g \circ (f \circ f^{-1}) \circ g^{-1} = \mathrm{id}`,
    ],
    preset: { example: 'bijective' },
    presetCaption: {
      ko: String.raw`bijective: \(A = B = C = [0,1,2]\), \(f = [1,2,0]\), \(g = [2,0,1]\), 합성 \(g \circ f = [g(1), g(2), g(0)] = [0,1,2]\) (항등함수). \(f^{-1} = [2,0,1]\), \(g^{-1} = [1,2,0]\).`,
      en: String.raw`bijective: \(A = B = C = [0,1,2]\), \(f = [1,2,0]\), \(g = [2,0,1]\), composition \(g \circ f = [g(1), g(2), g(0)] = [0,1,2]\) (the identity). \(f^{-1} = [2,0,1]\), \(g^{-1} = [1,2,0]\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \((f^{-1} \circ g^{-1}) \circ (g \circ f)\)를 결합법칙으로 다시 묶습니다: \((f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (g^{-1} \circ g) \circ f\). \(g\)는 전단사이므로 \(g^{-1} \circ g = \mathrm{id}_{B}\)이고, \(f\)는 전단사이므로 \(f^{-1} \circ \mathrm{id}_{B} \circ f = f^{-1} \circ f = \mathrm{id}_{A}\) — 좌역함수입니다.`,
          en: String.raw`First regroup \((f^{-1} \circ g^{-1}) \circ (g \circ f)\) by associativity: \((f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (g^{-1} \circ g) \circ f\). Since \(g\) is bijective, \(g^{-1} \circ g = \mathrm{id}_{B}\), and since \(f\) is bijective, \(f^{-1} \circ \mathrm{id}_{B} \circ f = f^{-1} \circ f = \mathrm{id}_{A}\) — a left inverse.`,
        },
      },
      {
        text: {
          ko: String.raw`반대 방향도 마찬가지입니다: \((g \circ f) \circ (f^{-1} \circ g^{-1}) = g \circ (f \circ f^{-1}) \circ g^{-1} = g \circ \mathrm{id}_{B} \circ g^{-1} = \mathrm{id}_{C}\) — 우역함수입니다. 좌역함수와 우역함수를 모두 가지므로 \(g \circ f\)는 전단사이고 그 역함수는 \(f^{-1} \circ g^{-1}\)입니다 (역함수의 유일성).`,
          en: String.raw`The other direction is the same: \((g \circ f) \circ (f^{-1} \circ g^{-1}) = g \circ (f \circ f^{-1}) \circ g^{-1} = g \circ \mathrm{id}_{B} \circ g^{-1} = \mathrm{id}_{C}\) — a right inverse. Having both a left and a right inverse makes \(g \circ f\) bijective with inverse \(f^{-1} \circ g^{-1}\) (uniqueness of inverses).`,
        },
      },
      {
        text: {
          ko: String.raw`씬의 표에서 직접 확인: \(f = [1,2,0]\), \(g = [2,0,1]\)이면 \((g \circ f)(0) = g(f(0)) = g(1) = 0\), \((g \circ f)(1) = g(2) = 1\), \((g \circ f)(2) = g(0) = 2\)이므로 \(g \circ f = [0,1,2]\) — 항등함수입니다. 역표 \(f^{-1} = [2,0,1]\), \(g^{-1} = [1,2,0]\)에 대해서도 같은 합성을 계산하면 \((f^{-1} \circ g^{-1})(0) = f^{-1}(g^{-1}(0)) = f^{-1}(1) = 0\), \((1)\)에서 \(f^{-1}(2) = 1\), \((2)\)에서 \(f^{-1}(0) = 2\) — 역시 \([0,1,2]\)이며 \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\)을 모델의 brute-force 검증으로 뒷받침합니다.`,
          en: String.raw`Direct check on the scene's tables: with \(f = [1,2,0]\) and \(g = [2,0,1]\), \((g \circ f)(0) = g(f(0)) = g(1) = 0\), \((g \circ f)(1) = g(2) = 1\), \((g \circ f)(2) = g(0) = 2\), so \(g \circ f = [0,1,2]\) — the identity. For the inverse tables \(f^{-1} = [2,0,1]\), \(g^{-1} = [1,2,0]\): \((f^{-1} \circ g^{-1})(0) = f^{-1}(g^{-1}(0)) = f^{-1}(1) = 0\), then \(f^{-1}(2) = 1\) at \((1)\) and \(f^{-1}(0) = 2\) at \((2)\) — again \([0,1,2]\), matching \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\) as verified by brute force in the model.`,
        },
      },
    ],
  },
  {
    id: 'function-proofs-surjective-implies',
    statement: {
      ko: String.raw`\(g \circ f\)가 전사(surjective)라면 \(g\)도 전사임을 완전히 증명하세요. 그리고 씬의 surjective-chain 표(\(f = [0,1]\), \(g = [0,1,0]\), \(B = [0,1,2]\))에서 \(f\)는 전사가 아니면서(\(2\)를 놓침) 합성 \(g \circ f = [0,1]\)이 \(C\)를 온전히 덮는 이유를 표로 확인하세요.`,
      en: String.raw`Prove completely that if \(g \circ f\) is surjective then \(g\) is surjective. Then use the scene's surjective-chain tables (\(f = [0,1]\), \(g = [0,1,0]\), \(B = [0,1,2]\)) to check why \(f\) fails to be surjective (it misses \(2\)) while the composition \(g \circ f = [0,1]\) still covers all of \(C\).`,
    },
    display: [
      String.raw`c \in C \;\Rightarrow\; \exists a: g(f(a)) = c \;\Rightarrow\; b = f(a) \text{ has } g(b) = c`,
      String.raw`g \circ f = [0, 1] \text{ surjective onto } C,\quad 2 \notin f(A) \;\Rightarrow\; f \text{ not surjective}`,
    ],
    preset: { example: 'surjective-chain' },
    presetCaption: {
      ko: String.raw`surjective-chain: \(A = [0,1]\), \(B = [0,1,2]\), \(C = [0,1]\), \(f = [0,1]\) (\(2\)를 놓침 — 전사 아님), \(g = [0,1,0]\) (전사 ✓), 합성 \(g \circ f = [0,1]\) (전사 ✓).`,
      en: String.raw`surjective-chain: \(A = [0,1]\), \(B = [0,1,2]\), \(C = [0,1]\), \(f = [0,1]\) (misses \(2\) — not surjective), \(g = [0,1,0]\) (surjective ✓), composition \(g \circ f = [0,1]\) (surjective ✓).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(c \in C\)를 임의로 잡으세요. \(g \circ f\)가 전사이므로 \(g(f(a)) = c\)인 \(a \in A\)가 존재합니다. 이제 \(b = f(a) \in B\)로 두면 \(g(b) = g(f(a)) = c\) — \(c\)의 \(g\)-역원소가 존재하므로 \(g\)는 전사입니다. 그림으로는: 합성 화살표가 \(C\)의 모든 점을 맞히면, 뒷쪽 화살표도 모든 점을 맞혀야 합니다.`,
          en: String.raw`Take any \(c \in C\). Since \(g \circ f\) is surjective, there is \(a \in A\) with \(g(f(a)) = c\). Setting \(b = f(a) \in B\) gives \(g(b) = g(f(a)) = c\) — so \(c\) has a \(g\)-preimage, and \(g\) is surjective. In the picture: if the composite arrows hit every point of \(C\), the later arrows must too.`,
        },
      },
      {
        text: {
          ko: String.raw`앞쪽 함수 \(f\)는 전사일 필요가 없습니다: 이 예제에서 \(f = [0,1]\)은 \(B\)의 원소 \(2\)를 놓치므로 전사가 아니지만, \(g = [0,1,0]\)이 \(g(0) = 0\), \(g(1) = 1\)로 \(C\)의 양쪽 원소를 모두 맞히기 때문에 합성 \(g \circ f = [0,1]\)은 전사입니다. \(g\)가 \(f\)의 치역 밖에서 추가로 뭘 하는지는 합성에 아무 영향이 없습니다 (여기서 \(g(2) = 0\)).`,
          en: String.raw`The first map \(f\) need not be surjective: in this example \(f = [0,1]\) misses the element \(2\) of \(B\) and is not surjective, yet \(g = [0,1,0]\) hits both elements of \(C\) via \(g(0) = 0\), \(g(1) = 1\), so the composition \(g \circ f = [0,1]\) is surjective. Whatever \(g\) does outside the image of \(f\) is invisible to the composition (here \(g(2) = 0\)).`,
        },
      },
    ],
  },
];
