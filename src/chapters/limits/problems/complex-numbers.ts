import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the complex-numbers scene. Imports
 * nothing except types. Every number below was verified against the
 * model (tests/complex-numbers.test.ts): for the init preset
 * z = 1.2 + 0.8i, w = -0.6 + 1.1i one has z + w = 0.6 + 1.9i,
 * |z|^2 = 2.08, |w|^2 = 1.57, |z + w|^2 = 3.97, |z - w|^2 = 3.33, and
 * |z + w|^2 + |z - w|^2 = 7.30 = 2 * (2.08 + 1.57).
 */
export const complexNumbersProblems: readonly ProblemMeta[] = [
  {
    id: 'triangle-inequality',
    statement: {
      ko: String.raw`모든 복소수 \(z, w \in \mathbb{C}\)에 대해 삼각부등식 \(|z + w| \le |z| + |w|\)를 완전히 증명하세요.

힌트 없이, \(|z + w|^2\)를 켤레로 전개하는 것부터 시작하세요.`,
      en: String.raw`Prove completely that for all complex numbers \(z, w \in \mathbb{C}\), the triangle inequality \(|z + w| \le |z| + |w|\) holds.

Start, without hints, by expanding \(|z + w|^2\) through the conjugate.`,
    },
    display: [
      String.raw`|z + w| \le |z| + |w| \qquad (z, w \in \mathbb{C})`,
    ],
    preset: { zre: 1.2, zim: 0.8, wre: -0.6, wim: 1.1 },
    presetCaption: {
      ko: String.raw`\(z = 1.2 + 0.8i\), \(w = -0.6 + 1.1i\): \(|z + w| = \sqrt{3.97} \approx 1.992\)이고 \(|z| + |w| \approx 2.695\)라서 여유가 약 \(0.703\)입니다.`,
      en: String.raw`\(z = 1.2 + 0.8i\), \(w = -0.6 + 1.1i\): \(|z + w| = \sqrt{3.97} \approx 1.992\) while \(|z| + |w| \approx 2.695\), a slack of about \(0.703\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(|\zeta|^2 = \zeta \bar{\zeta}\) (\(\zeta \in \mathbb{C}\))를 이용해 \(|z + w|^2\)를 전개합니다. \(\overline{z + w} = \bar{z} + \bar{w}\)이므로

\(|z + w|^2 = (z + w)(\bar{z} + \bar{w}) = z\bar{z} + z\bar{w} + w\bar{z} + w\bar{w} = |z|^2 + z\bar{w} + \bar{z}w + |w|^2\).

여기서 \(\bar{z}w = \overline{z\bar{w}}\)입니다: \(\overline{z\bar{w}} = \bar{z}\,\overline{\bar{w}} = \bar{z}w\)이기 때문입니다.

어떤 복소수 \(\zeta\)에 대해서도 \(\zeta + \bar{\zeta} = 2\,\mathrm{Re}\,\zeta\)이므로, \(\zeta = z\bar{w}\)로 두면

\(|z + w|^2 = |z|^2 + 2\,\mathrm{Re}(z\bar{w}) + |w|^2\).`,
          en: String.raw`First expand \(|z + w|^2\) using \(|\zeta|^2 = \zeta \bar{\zeta}\) for \(\zeta \in \mathbb{C}\). Since \(\overline{z + w} = \bar{z} + \bar{w}\),

\(|z + w|^2 = (z + w)(\bar{z} + \bar{w}) = z\bar{z} + z\bar{w} + w\bar{z} + w\bar{w} = |z|^2 + z\bar{w} + \bar{z}w + |w|^2\).

Here \(\bar{z}w = \overline{z\bar{w}}\), because \(\overline{z\bar{w}} = \bar{z}\,\overline{\bar{w}} = \bar{z}w\).

For any complex number \(\zeta\), \(\zeta + \bar{\zeta} = 2\,\mathrm{Re}\,\zeta\); taking \(\zeta = z\bar{w}\) gives

\(|z + w|^2 = |z|^2 + 2\,\mathrm{Re}(z\bar{w}) + |w|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`다음 보조 사실: 모든 \(\zeta \in \mathbb{C}\)에 대해 \(\mathrm{Re}\,\zeta \le |\zeta|\)입니다.

증명: \(\zeta = u + vi\) (\(u, v \in \mathbb{R}\))로 쓰면 \(\mathrm{Re}\,\zeta = u \le |u| = \sqrt{u^2} \le \sqrt{u^2 + v^2} = |\zeta|\)입니다. 가운데 부등식은 \(u^2 \le u^2 + v^2\) (\(v^2 \ge 0\))와 제곱근의 단조성에서 옵니다.

따라서 \(\mathrm{Re}(z\bar{w}) \le |z\bar{w}|\)입니다.`,
          en: String.raw`Next, a lemma: \(\mathrm{Re}\,\zeta \le |\zeta|\) for every \(\zeta \in \mathbb{C}\).

Proof: write \(\zeta = u + vi\) with \(u, v \in \mathbb{R}\). Then \(\mathrm{Re}\,\zeta = u \le |u| = \sqrt{u^2} \le \sqrt{u^2 + v^2} = |\zeta|\), where the middle step uses \(u^2 \le u^2 + v^2\) (as \(v^2 \ge 0\)) and the monotonicity of the square root.

Hence \(\mathrm{Re}(z\bar{w}) \le |z\bar{w}|\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(|z\bar{w}| = |z|\,|w|\)임을 직접 계산합니다. 양변 모두 \(\ge 0\)이므로 제곱을 비교하면 충분합니다:

\(|z\bar{w}|^2 = (z\bar{w})\,\overline{(z\bar{w})} = (z\bar{w})(\bar{z}w) = (z\bar{z})(w\bar{w}) = |z|^2 |w|^2 = (|z|\,|w|)^2\).

\([0, \infty)\)에서 제곱근은 단조이므로 (혹은 양수의 제곱이 같으면 양수 자체가 같으므로) \(|z\bar{w}| = |z|\,|w|\)입니다.`,
          en: String.raw`Now compute \(|z\bar{w}| = |z|\,|w|\) directly. Both sides are \(\ge 0\), so it suffices to compare squares:

\(|z\bar{w}|^2 = (z\bar{w})\,\overline{(z\bar{w})} = (z\bar{w})(\bar{z}w) = (z\bar{z})(w\bar{w}) = |z|^2 |w|^2 = (|z|\,|w|)^2\).

The square root is monotone on \([0, \infty)\) (equivalently, nonnegative numbers with equal squares are equal), so \(|z\bar{w}| = |z|\,|w|\).`,
        },
      },
      {
        text: {
          ko: String.raw`모두 합칩니다:

\(|z + w|^2 = |z|^2 + 2\,\mathrm{Re}(z\bar{w}) + |w|^2 \le |z|^2 + 2|z\bar{w}| + |w|^2 = |z|^2 + 2|z|\,|w| + |w|^2 = (|z| + |w|)^2\).

양변 모두 \(\ge 0\)이고 제곱근은 \([0, \infty)\)에서 단조이므로, 제곱근을 취하면 \(|z + w| \le |z| + |w|\)를 얻습니다. ∎`,
          en: String.raw`Combine everything:

\(|z + w|^2 = |z|^2 + 2\,\mathrm{Re}(z\bar{w}) + |w|^2 \le |z|^2 + 2|z\bar{w}| + |w|^2 = |z|^2 + 2|z|\,|w| + |w|^2 = (|z| + |w|)^2\).

Both sides are \(\ge 0\) and the square root is monotone on \([0, \infty)\), so taking square roots gives \(|z + w| \le |z| + |w|\). ∎`,
        },
      },
    ],
  },
  {
    id: 'parallelogram-identity',
    statement: {
      ko: String.raw`모든 \(z, w \in \mathbb{C}\)에 대해 평행사변형 항등식 \(|z + w|^2 + |z - w|^2 = 2|z|^2 + 2|w|^2\)를 완전히 증명하세요.

네 항을 모두 \(\zeta \bar{\zeta}\) 형태로 전개하고 교차항이 어떻게 상쇄되는지 명시하세요.`,
      en: String.raw`Prove completely that for all \(z, w \in \mathbb{C}\), the parallelogram identity \(|z + w|^2 + |z - w|^2 = 2|z|^2 + 2|w|^2\) holds.

Expand all four terms in the form \(\zeta \bar{\zeta}\) and show explicitly how the cross terms cancel.`,
    },
    display: [
      String.raw`|z + w|^2 + |z - w|^2 = 2|z|^2 + 2|w|^2 \qquad (z, w \in \mathbb{C})`,
    ],
    preset: { zre: 1.2, zim: 0.8, wre: -0.6, wim: 1.1 },
    presetCaption: {
      ko: String.raw`\(z = 1.2 + 0.8i\), \(w = -0.6 + 1.1i\): \(|z + w|^2 + |z - w|^2 = 3.97 + 3.33 = 7.30\)이고 \(2|z|^2 + 2|w|^2 = 2(2.08 + 1.57) = 7.30\)입니다.`,
      en: String.raw`\(z = 1.2 + 0.8i\), \(w = -0.6 + 1.1i\): \(|z + w|^2 + |z - w|^2 = 3.97 + 3.33 = 7.30\) and \(2|z|^2 + 2|w|^2 = 2(2.08 + 1.57) = 7.30\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`합의 제곱을 전개합니다. \(\overline{z + w} = \bar{z} + \bar{w}\)이므로

\(|z + w|^2 = (z + w)(\bar{z} + \bar{w}) = z\bar{z} + z\bar{w} + w\bar{z} + w\bar{w} = |z|^2 + z\bar{w} + \bar{z}w + |w|^2\).`,
          en: String.raw`Expand the sum term. Since \(\overline{z + w} = \bar{z} + \bar{w}\),

\(|z + w|^2 = (z + w)(\bar{z} + \bar{w}) = z\bar{z} + z\bar{w} + w\bar{z} + w\bar{w} = |z|^2 + z\bar{w} + \bar{z}w + |w|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`차의 제곱을 전개합니다. \(\overline{z - w} = \bar{z} - \bar{w}\)이므로

\(|z - w|^2 = (z - w)(\bar{z} - \bar{w}) = z\bar{z} - z\bar{w} - w\bar{z} + w\bar{w} = |z|^2 - z\bar{w} - \bar{z}w + |w|^2\).

부호가 바뀐 곳은 정확히 교차항 \(z\bar{w}\)와 \(\bar{z}w\)뿐입니다.`,
          en: String.raw`Expand the difference term. Since \(\overline{z - w} = \bar{z} - \bar{w}\),

\(|z - w|^2 = (z - w)(\bar{z} - \bar{w}) = z\bar{z} - z\bar{w} - w\bar{z} + w\bar{w} = |z|^2 - z\bar{w} - \bar{z}w + |w|^2\).

Only the cross terms \(z\bar{w}\) and \(\bar{z}w\) have changed sign.`,
        },
      },
      {
        text: {
          ko: String.raw`두 전개를 더합니다. 교차항은 \(+z\bar{w} - z\bar{w} = 0\), \(+\bar{z}w - \bar{z}w = 0\)으로 상쇄되고, 대각항은 두 배가 됩니다:

\(|z + w|^2 + |z - w|^2 = (|z|^2 + |w|^2) + (|z|^2 + |w|^2) = 2|z|^2 + 2|w|^2\). ∎`,
          en: String.raw`Add the two expansions. The cross terms cancel, \(+z\bar{w} - z\bar{w} = 0\) and \(+\bar{z}w - \bar{z}w = 0\), while the diagonal terms double:

\(|z + w|^2 + |z - w|^2 = (|z|^2 + |w|^2) + (|z|^2 + |w|^2) = 2|z|^2 + 2|w|^2\). ∎`,
        },
      },
      {
        text: {
          ko: String.raw`이 항등식이 다리인 이유: 요르단–폰 노이만 정리에 따르면, 모든 벡터에 대해 평행사변형 법칙을 만족하는 노름은 정확히 내적에서 오는 노름뿐입니다 — 이 \(\mathbb{C}\) 계산이 그 방향의 씨앗이며, 수열 챕터의 평행사변형 법칙 씬에서 다시 만납니다.`,
          en: String.raw`Why this identity is a bridge: by the Jordan-von Neumann theorem, a norm satisfying the parallelogram law for all vectors is exactly a norm coming from an inner product — this computation in \(\mathbb{C}\) is the seed of that direction, and it returns in the parallelogram-law scene of the sequences chapter.`,
        },
      },
    ],
  },
  {
    id: 'modulus-product-conjugate',
    statement: {
      ko: String.raw`모든 \(z, w \in \mathbb{C}\)에 대해 (i) \(|zw| = |z|\,|w|\), (ii) \(\overline{z + w} = \bar{z} + \bar{w}\), (iii) \(\overline{zw} = \bar{z}\,\bar{w}\), (iv) \(z\bar{z} = |z|^2\)를 완전히 증명하세요.

\(z = a + bi\), \(w = c + di\) (\(a, b, c, d \in \mathbb{R}\))로 놓고 성분 계산을 명시하세요.`,
      en: String.raw`Prove completely that for all \(z, w \in \mathbb{C}\): (i) \(|zw| = |z|\,|w|\), (ii) \(\overline{z + w} = \bar{z} + \bar{w}\), (iii) \(\overline{zw} = \bar{z}\,\bar{w}\), and (iv) \(z\bar{z} = |z|^2\).

Write \(z = a + bi\) and \(w = c + di\) with \(a, b, c, d \in \mathbb{R}\) and carry out the component computations explicitly.`,
    },
    display: [
      String.raw`|zw| = |z|\,|w|, \qquad \overline{z + w} = \bar{z} + \bar{w}, \qquad \overline{zw} = \bar{z}\,\bar{w}, \qquad z\bar{z} = |z|^2`,
    ],
    preset: { zre: 1, zim: 1, wre: 1, wim: -0.5 },
    presetCaption: {
      ko: String.raw`\(z = 1 + i\), \(w = 1 - 0.5i\): \(zw = 1.5 + 0.5i\)라서 \(|zw| = \sqrt{2.5} \approx 1.581\)이고 \(|z|\,|w| = \sqrt{2} \cdot \sqrt{1.25} = \sqrt{2.5}\)로 일치합니다.`,
      en: String.raw`\(z = 1 + i\), \(w = 1 - 0.5i\): \(zw = 1.5 + 0.5i\), so \(|zw| = \sqrt{2.5} \approx 1.581\), matching \(|z|\,|w| = \sqrt{2} \cdot \sqrt{1.25} = \sqrt{2.5}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(iv)부터 합니다. \(\bar{z} = a - bi\)이므로

\(z\bar{z} = (a + bi)(a - bi) = a^2 - abi + abi - b^2 i^2 = a^2 + b^2 = |z|^2\).

교차항 \(-abi + abi\)가 상쇄되고 \(i^2 = -1\)이 \(-b^2 i^2 = +b^2\)를 만듭니다.`,
          en: String.raw`Start with (iv). Since \(\bar{z} = a - bi\),

\(z\bar{z} = (a + bi)(a - bi) = a^2 - abi + abi - b^2 i^2 = a^2 + b^2 = |z|^2\).

The cross terms \(-abi + abi\) cancel, and \(i^2 = -1\) turns \(-b^2 i^2\) into \(+b^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`(ii) 합의 켤레: \(z + w = (a + c) + (b + d)i\)이므로

\(\overline{z + w} = (a + c) - (b + d)i = (a - bi) + (c - di) = \bar{z} + \bar{w}\).`,
          en: String.raw`(ii) Conjugate of a sum: \(z + w = (a + c) + (b + d)i\), so

\(\overline{z + w} = (a + c) - (b + d)i = (a - bi) + (c - di) = \bar{z} + \bar{w}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(iii) 곱의 켤레: 먼저 \(zw = (a + bi)(c + di) = ac + adi + bci + bdi^2 = (ac - bd) + (ad + bc)i\)이므로

\(\overline{zw} = (ac - bd) - (ad + bc)i\).

한편 \(\bar{z}\,\bar{w} = (a - bi)(c - di) = ac - adi - bci + bdi^2 = (ac - bd) - (ad + bc)i\).

두 계산이 일치하므로 \(\overline{zw} = \bar{z}\,\bar{w}\)입니다.`,
          en: String.raw`(iii) Conjugate of a product: first \(zw = (a + bi)(c + di) = ac + adi + bci + bdi^2 = (ac - bd) + (ad + bc)i\), so

\(\overline{zw} = (ac - bd) - (ad + bc)i\).

Meanwhile \(\bar{z}\,\bar{w} = (a - bi)(c - di) = ac - adi - bci + bdi^2 = (ac - bd) - (ad + bc)i\).

The two computations agree, so \(\overline{zw} = \bar{z}\,\bar{w}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(i) 절댓값의 곱: (iii)과 (iv)를 이용하면

\(|zw|^2 = (zw)\,\overline{(zw)} = (zw)(\bar{z}\bar{w}) = (z\bar{z})(w\bar{w}) = |z|^2 |w|^2 = (|z|\,|w|)^2\).

양변 모두 \(\ge 0\)이므로 제곱근을 취하면 \(|zw| = |z|\,|w|\)입니다. ∎`,
          en: String.raw`(i) Modulus of a product: using (iii) and (iv),

\(|zw|^2 = (zw)\,\overline{(zw)} = (zw)(\bar{z}\bar{w}) = (z\bar{z})(w\bar{w}) = |z|^2 |w|^2 = (|z|\,|w|)^2\).

Both sides are \(\ge 0\), so taking square roots gives \(|zw| = |z|\,|w|\). ∎`,
        },
      },
    ],
  },
];
