import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Vitali non-measurable set scene.
 * Imports nothing except types. Every number below was verified against the
 * model (tests/vitali.test.ts): the rational counts for each denominator
 * bound d, the mock translate layout, and the finite counting bounds.
 * The proofs concern the REAL Vitali set (given by AC), not the finite
 * mock drawn in the scene; each proof's first step states the AC use.
 */
export const vitaliProblems: readonly ProblemMeta[] = [
  {
    id: 'vitali-disjoint',
    statement: {
      ko: String.raw`\(x \sim y \iff x - y \in \mathbb{Q}\)로 \([0, 1]\) 위에 동치관계를 정의하고, 선택공리로 각 동치류에서 대표원 하나씩을 골라 \(V \subset [0, 1]\)을 만드세요. 유리수 \(q_1 \ne q_2\)에 대해 평행이동 \(V + q_1\)과 \(V + q_2\)가 서로소임을 완전히 증명하세요.`,
      en: String.raw`Put the equivalence relation \(x \sim y \iff x - y \in \mathbb{Q}\) on \([0, 1]\) and, by the axiom of choice, build \(V \subset [0, 1]\) by picking one representative from each class. Prove completely that the translates \(V + q_1\) and \(V + q_2\) are disjoint for distinct rationals \(q_1 \ne q_2\).`,
    },
    display: [
      String.raw`x \in (V + q_1) \cap (V + q_2) \;\Longrightarrow\; q_1 = q_2`,
    ],
    preset: { d: 3 },
    presetCaption: {
      ko: String.raw`\(d = 3\): 분모가 \(3\) 이하인 유리수 \(9\)개 — 각 행이 모형 대표원 집합의 평행이동입니다. 진짜 증명은 가산 개의 유리수 전체에 대한 것입니다.`,
      en: String.raw`\(d = 3\): \(9\) rationals with denominator at most \(3\) — each row a translate of the mock representative set. The real proof covers all countably many rationals.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`[선택공리의 사용 — 유일한 사용처] \(x \sim y \iff x - y \in \mathbb{Q}\)는 \([0, 1]\) 위의 동치관계입니다 (반사·대칭·추이는 유리수 집합이 덧셈군이기 때문입니다). 선택공리를 정확히 한 번 써서, \([0, 1]\)과 만나는 각 동치류에서 대표원 하나씩을 고릅니다. 그 모음이 \(V\)입니다 — 따라서 \(V \subset [0, 1]\)이며, \(V\)는 각 동치류마다 정확히 하나의 원소를 가집니다.`,
          en: String.raw`[Use of AC — the only one] \(x \sim y \iff x - y \in \mathbb{Q}\) is an equivalence relation on \([0, 1]\) (reflexive, symmetric, transitive because \(\mathbb{Q}\) is an additive group). Invoke the axiom of choice exactly once to pick one representative from each class meeting \([0, 1]\). The collection of picks is \(V\) — so \(V \subset [0, 1]\) and \(V\) holds exactly one element from each class.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x \in (V + q_1) \cap (V + q_2)\)라 두면, 어떤 \(v_1, v_2 \in V\)에 대해 \(x = v_1 + q_1 = v_2 + q_2\)입니다. 정리하면 \(v_1 - v_2 = q_2 - q_1 \in \mathbb{Q}\) — 즉 \(v_1 \sim v_2\)입니다.`,
          en: String.raw`Let \(x \in (V + q_1) \cap (V + q_2)\); then \(x = v_1 + q_1 = v_2 + q_2\) for some \(v_1, v_2 \in V\). Rearranging, \(v_1 - v_2 = q_2 - q_1 \in \mathbb{Q}\) — i.e. \(v_1 \sim v_2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(V\)는 각 동치류에서 원소를 하나씩만 가지므로, \(v_1 \sim v_2\)이면 \(v_1 = v_2\)입니다. 그러면 \(q_1 = x - v_1 = x - v_2 = q_2\) — 모순. 따라서 서로 다른 유리수에 대한 평행이동은 겹치지 않습니다.`,
          en: String.raw`Since \(V\) holds only one element per class, \(v_1 \sim v_2\) forces \(v_1 = v_2\). Then \(q_1 = x - v_1 = x - v_2 = q_2\) — contradiction. Hence translates by distinct rationals are disjoint.`,
        },
      },
    ],
  },
  {
    id: 'vitali-sandwich',
    statement: {
      ko: String.raw`문제 1의 \(V\)에 대해, \(\mathbb{Q} \cap [-1, 1]\) 안의 유리수 \(q\)들에 대한 평행이동들의 합집합이 \([0, 1] \subset \bigcup_q (V + q) \subset [-1, 2]\)를 만족함을 완전히 증명하세요.`,
      en: String.raw`For the \(V\) of problem 1, prove completely the sandwich \([0, 1] \subset \bigcup_q (V + q) \subset [-1, 2]\), where \(q\) ranges over the rationals in \(\mathbb{Q} \cap [-1, 1]\).`,
    },
    display: [
      String.raw`[0, 1] \subset \bigcup_{q \in \mathbb{Q} \cap [-1,1]} (V + q) \subset [-1, 2]`,
    ],
    preset: { d: 6 },
    presetCaption: {
      ko: String.raw`\(d = 6\): 유리수 \(25\)개 — \([-1, 2]\) 상자 안에 모형 평행이동들이 촘촘히 들어가고, \([0, 1]\) 띠를 덮습니다.`,
      en: String.raw`\(d = 6\): \(25\) rationals — the mock translates pack the \([-1, 2]\) box and cover the \([0, 1]\) band.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`[선택공리의 사용 — 문제 1과 동일] \(V\)는 선택공리로 각 \(\sim\)-동치류에서 하나씩 고른 대표원들의 집합이며, \(V \subset [0, 1]\)입니다. 아래 두 포함관계는 이 구성의 직접적인 결과입니다.`,
          en: String.raw`[The axiom of choice — used as in problem 1] \(V\) is the set of representatives chosen via the axiom of choice, one per \(\sim\)-class, with \(V \subset [0, 1]\). Both inclusions below are direct consequences of this construction.`,
        },
      },
      {
        text: {
          ko: String.raw`왼쪽 포함: \(x \in [0, 1]\)이라 두면, \(x\)가 속한 동치류의 대표원 \(v \in V\)가 존재합니다. \(q = x - v \in \mathbb{Q}\)이고, \(x, v \in [0, 1]\)이므로 \(q \in [-1, 1]\)입니다. 따라서 \(x = v + q \in V + q\) — 즉 \([0, 1] \subset \bigcup_q (V + q)\)입니다.`,
          en: String.raw`Left inclusion: let \(x \in [0, 1]\). Its class has a representative \(v \in V\). Then \(q = x - v \in \mathbb{Q}\), and since \(x, v \in [0, 1]\), \(q \in [-1, 1]\). So \(x = v + q \in V + q\) — i.e. \([0, 1] \subset \bigcup_q (V + q)\).`,
        },
      },
      {
        text: {
          ko: String.raw`오른쪽 포함: \(V \subset [0, 1]\)이고 \(q \in [-1, 1]\)이므로, \(V + q \subset [0, 1] + [-1, 1] = [-1, 2]\)입니다. 모든 \(q\)에 대해 합집합을 취해도 마찬가지입니다. 씬의 \([-1, 2]\) 상자와 \([0, 1]\) 띠가 바로 이 샌드위치입니다.`,
          en: String.raw`Right inclusion: \(V \subset [0, 1]\) and \(q \in [-1, 1]\), so \(V + q \subset [0, 1] + [-1, 1] = [-1, 2]\). The same holds for the union over all \(q\). The scene's \([-1, 2]\) box and \([0, 1]\) band are exactly this sandwich.`,
        },
      },
    ],
  },
  {
    id: 'vitali-contradiction',
    statement: {
      ko: String.raw`\(V\)가 르베그 가측이라고 가정하고 모순을 이끌어내세요: 가산가법성과 평행이동 불변성으로부터, \(m(V) > 0\)인 경우와 \(m(V) = 0\)인 경우 모두 불가능함을 완전히 증명하세요.`,
      en: String.raw`Assume \(V\) is Lebesgue measurable and derive a contradiction: from countable additivity and translation invariance, prove completely that both \(m(V) > 0\) and \(m(V) = 0\) are impossible.`,
    },
    display: [
      String.raw`m\left(\bigcup_q (V + q)\right) = \sum_q m(V + q) = \sum_q m(V) \quad\text{yet}\quad 1 \le m\left(\bigcup_q\right) \le 3`,
    ],
    preset: { d: 2 },
    presetCaption: {
      ko: String.raw`\(d = 2\): 유리수 \(5\)개만 보여도 — \(m = 1\)이라 두면 측도 합이 \(5 > 3\)으로 상자를 넘칩니다 (유한 버전의 모순).`,
      en: String.raw`\(d = 2\): even with just \(5\) rationals shown — with \(m = 1\) the measure total \(5 > 3\) already overflows the box (the finite shadow of the contradiction).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`[선택공리의 사용 — 문제 1과 동일] \(V\)는 선택공리로 만든 대표원 집합입니다. \(V\)가 가측이라 가정하고 \(m = m(V)\)라 둡니다. 평행이동 불변성에 의해 모든 유리수 \(q\)에 대해 \(m(V + q) = m\)입니다.`,
          en: String.raw`[The axiom of choice — used as in problem 1] \(V\) is the representative set built with the axiom of choice. Suppose \(V\) is measurable and put \(m = m(V)\). By translation invariance, \(m(V + q) = m\) for every rational \(q\).`,
        },
      },
      {
        text: {
          ko: String.raw`문제 1에서 평행이동들은 서로소이므로, 가산가법성으로 \(m\left(\bigcup_q (V + q)\right) = \sum_q m(V + q) = \sum_q m\)입니다 — 가산 개의 \(m\)을 더한 것입니다. 문제 2의 샌드위치에 단조성을 적용하면 \(1 = m([0, 1]) \le m\left(\bigcup_q\right) \le m([-1, 2]) = 3\)입니다.`,
          en: String.raw`By problem 1 the translates are disjoint, so countable additivity gives \(m\left(\bigcup_q (V + q)\right) = \sum_q m(V + q) = \sum_q m\) — countably many copies of \(m\) summed. Monotonicity on problem 2's sandwich gives \(1 = m([0, 1]) \le m\left(\bigcup_q\right) \le m([-1, 2]) = 3\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(m > 0\)이면 \(\sum_q m = \infty\)인데 \(\le 3\)이어야 하므로 모순입니다. \(m = 0\)이면 \(\sum_q m = 0\)인데 \(\ge 1\)이어야 하므로 모순입니다. 어떤 \(m\)도 성립하지 않으므로, 가정(가측성)이 틀렸습니다 — \(V\)는 르베그 가측이 아닙니다. 선택공리는 대표원을 고르는 데 정확히 한 번 쓰였을 뿐인데, 가측이 아닌 집합의 존재가 따라나옵니다.`,
          en: String.raw`If \(m > 0\) then \(\sum_q m = \infty\), contradicting \(\le 3\). If \(m = 0\) then \(\sum_q m = 0\), contradicting \(\ge 1\). No \(m\) works, so the assumption (measurability) is false — \(V\) is not Lebesgue measurable. AC was used exactly once, to choose the representatives, yet out comes a non-measurable set.`,
        },
      },
    ],
  },
];
