import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the integers-and-rationals scene.
 * Imports nothing except types. Imported by the chapter's meta.ts.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'integer-addition-well-defined',
    statement: {
      ko: String.raw`\((a,b)\sim(a',b')\)이고 \((c,d)\sim(c',d')\)이라 하자.

\((a+c,b+d)\sim(a'+c',b'+d')\)임을 증명하세요.

(덧셈 \([(a,b)]+[(c,d)]=[(a+c,b+d)]\)이 대표원의 선택과 무관하게 잘 정의된다는 뜻이다.)`,
      en: String.raw`Assume \((a,b)\sim(a',b')\) and \((c,d)\sim(c',d')\).

Prove that \((a+c,b+d)\sim(a'+c',b'+d')\).

(This says the addition \([(a,b)]+[(c,d)]=[(a+c,b+d)]\) is well-defined, independent of the chosen representatives.)`,
    },
    display: [String.raw`(a,b)\sim(a',b'),\ (c,d)\sim(c',d')`, String.raw`(a+c,b+d)\sim(a'+c',b'+d')`],
    preset: { set: 'integers' },
    presetCaption: {
      ko: String.raw`정수 모드 — 각 점은 순서쌍의 동치류이며, 대표원을 바꿔도 덧셈은 같다.`,
      en: String.raw`Integers mode — each dot is a class of pairs, and addition is the same whichever representatives are chosen.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`동치 관계의 정의에 따르면 \((a,b)\sim(a',b')\)는 \(a+b'=a'+b\)를 뜻하고, \((c,d)\sim(c',d')\)는 \(c+d'=c'+d\)를 뜻합니다.`,
          en: String.raw`By definition of the relation, \((a,b)\sim(a',b')\) means \(a+b'=a'+b\) and \((c,d)\sim(c',d')\) means \(c+d'=c'+d\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 등식을 변끼리 더하면 \((a+b')+(c+d')=(a'+b)+(c'+d)\)를 얻습니다. 자연수 덧셈의 결합법칙과 교환법칙으로 항을 재배열하면 \((a+c)+(b'+d')=(a'+c')+(b+d)\)입니다.`,
          en: String.raw`Adding the two equations side by side gives \((a+b')+(c+d')=(a'+b)+(c'+d)\). Rearranging with the associativity and commutativity of natural-number addition yields \((a+c)+(b'+d')=(a'+c')+(b+d)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이는 정확히 \((a+c,b+d)\sim(a'+c',b'+d')\)의 정의입니다. 따라서 \([(a,b)]+[(c,d)]\)의 값은 \((a,b)\)와 \((c,d)\)의 대표원을 어떻게 고르든 달라지지 않습니다 — \(\mathbb{Z}\)의 덧셈은 잘 정의됩니다.`,
          en: String.raw`This is exactly the definition of \((a+c,b+d)\sim(a'+c',b'+d')\). So the value of \([(a,b)]+[(c,d)]\) never depends on which representatives of the two classes are chosen — addition on \(\mathbb{Z}\) is well-defined.`,
        },
      },
    ],
  },
  {
    id: 'rationals-dense',
    statement: {
      ko: String.raw`유리수 \(p<q\)에 대해 \(m=\frac{p+q}{2}\)가 유리수이고 \(p<m<q\)임을 증명하세요.`,
      en: String.raw`For rationals \(p<q\), prove that \(m=\frac{p+q}{2}\) is rational and \(p<m<q\).`,
    },
    display: [String.raw`p<q \implies p<\frac{p+q}{2}<q`],
    preset: { set: 'rationals', denom: 4 },
    presetCaption: {
      ko: String.raw`유리수 모드, 최대 분모 4 — 어떤 두 유리수 사이에도 점이 하나 더 있다.`,
      en: String.raw`Rationals mode, max denominator 4 — between any two rationals sits another dot.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(p=\frac{a}{b}\), \(q=\frac{c}{d}\)라 두자 (\(b>0,\ d>0\)). 그러면 \(m=\frac{p+q}{2}=\frac{ad+bc}{2bd}\)이며, 분자와 분모가 정수이고 분모가 0이 아니므로 \(m\)은 유리수입니다.`,
          en: String.raw`Write \(p=\frac{a}{b}\) and \(q=\frac{c}{d}\) with \(b>0,\ d>0\). Then \(m=\frac{p+q}{2}=\frac{ad+bc}{2bd}\): numerator and denominator are integers and the denominator is nonzero, so \(m\) is rational.`,
        },
      },
      {
        text: {
          ko: String.raw`\(p<q\)이므로 양변에 \(p\)를 더하면 \(2p<p+q\)를 얻고, 양의 수 \(2\)로 나누면 부등호의 방향이 유지되어 \(p<\frac{p+q}{2}=m\)입니다.`,
          en: String.raw`Since \(p<q\), adding \(p\) to both sides gives \(2p<p+q\); dividing by the positive \(2\) preserves the inequality, so \(p<\frac{p+q}{2}=m\).`,
        },
      },
      {
        text: {
          ko: String.raw`마찬가지로 \(p<q\)의 양변에 \(q\)를 더하면 \(p+q<2q\), 즉 \(m<q\)입니다.

따라서 \(p<m<q\) — 어떤 두 유리수 사이에도 항상 또 다른 유리수가 있으므로, 유리수는 "빽빽하다"(조밀하다)고 합니다.

정수에서는 성립하지 않는 성질입니다 (연속된 정수 사이에는 정수가 없습니다).`,
          en: String.raw`Likewise, adding \(q\) to both sides of \(p<q\) gives \(p+q<2q\), i.e. \(m<q\).

Hence \(p<m<q\) — between any two rationals there is always another rational, so the rationals are dense.

Integers lack this property (no integer lies strictly between consecutive integers).`,
        },
      },
    ],
  },
  {
    id: 'rational-inverse',
    statement: {
      ko: String.raw`0이 아닌 유리수 \(\frac{a}{b}\)에 대해 \(\frac{b}{a}\)가 그 곱셈 역원임을 증명하세요.`,
      en: String.raw`For a nonzero rational \(\frac{a}{b}\), prove that \(\frac{b}{a}\) is its multiplicative inverse.`,
    },
    display: [String.raw`\frac{a}{b}\cdot\frac{b}{a}=1\qquad(a\ne 0)`],
    preset: { set: 'rationals', denom: 4 },
    presetCaption: {
      ko: String.raw`유리수 모드, 최대 분모 4 — 0이 아닌 점은 모두 곱셈 역원을 가진다.`,
      en: String.raw`Rationals mode, max denominator 4 — every nonzero dot has a multiplicative inverse.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\frac{a}{b}\ne 0\)은 \(a\ne 0\)을 뜻합니다 (\(b\ne 0\)은 유리수의 정의에 들어 있습니다). 따라서 분모가 \(a\ne 0\)인 분수 \(\frac{b}{a}\)는 정당한 유리수입니다.`,
          en: String.raw`\(\frac{a}{b}\ne 0\) means \(a\ne 0\) (and \(b\ne 0\) is part of being a rational). So the fraction \(\frac{b}{a}\), whose denominator \(a\ne 0\), is a legitimate rational.`,
        },
      },
      {
        text: {
          ko: String.raw`분수 곱셈의 정의에 따라 \(\frac{a}{b}\cdot\frac{b}{a}=\frac{ab}{ba}\)입니다.

곱셈의 교환법칙으로 \(ab=ba\)이므로 이 분수는 \(\frac{ab}{ab}=1\)과 같습니다.

즉 \(\frac{b}{a}\)는 \(\frac{a}{b}\)의 곱셈 역원입니다.`,
          en: String.raw`By the definition of fraction multiplication, \(\frac{a}{b}\cdot\frac{b}{a}=\frac{ab}{ba}\).

Commutativity gives \(ab=ba\), so this fraction equals \(\frac{ab}{ab}=1\).

Hence \(\frac{b}{a}\) is the multiplicative inverse of \(\frac{a}{b}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이로써 주장한 바가 정확히 증명됩니다: 0이 아닌 모든 유리수는 곱셈 역원을 가지므로, \(\mathbb{Q}\)에서는 0이 아닌 유리수로 나누기가 항상 가능합니다. 나머지 체 공리(덧셈·곱셈의 잘 정의됨, 결합법칙, 교환법칙, 분배법칙)는 여기서 증명하지 않습니다 — groups-fields 씬에서 검증되며, 그것들과 합쳐질 때 비로소 \(\mathbb{Q}\)가 체(field)가 됩니다.`,
          en: String.raw`This proves exactly the claimed statement: every nonzero rational has a multiplicative inverse, so division by a nonzero rational is always possible in \(\mathbb{Q}\). The remaining field axioms (well-defined addition and multiplication, associativity, commutativity, distributivity) are not proved here; they are verified in the groups-fields scene, and only together with them does \(\mathbb{Q}\) become a field.`,
        },
      },
    ],
  },
];
