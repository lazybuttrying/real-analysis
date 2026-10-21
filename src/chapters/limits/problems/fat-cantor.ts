import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the fat Cantor scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/fat-cantor.test.ts):
 *   stage 4: fat intervals 16, fatLength = 17/32 = 0.53125,
 *   std intervals 16, stdLength = (2/3)^4 = 16/81 ~ 0.197531;
 *   stage-1 fat intervals exactly [0, 3/8] and [5/8, 1]
 *   (middle open piece (3/8, 5/8) of length 1/4 removed);
 *   interval counts are 2^stage, disjoint and sorted, for stages 0..7.
 */
export const fatCantorProblems: readonly ProblemMeta[] = [
  {
    id: 'total-removed-half',
    statement: {
      ko: String.raw`\(n\)단계에서 남은 \(2^{n-1}\)개 닫힌구간 각각에서 가운데 열린구간을 절대 길이 \(4^{-n}\)만큼 제거하는 fat Cantor 집합을 생각하세요. 전체 단계에 걸쳐 제거된 총길이가 \(\tfrac12\)임을 기하급수로 증명하고, \(N\)단계 뒤 남은 길이가 \(\dfrac{1 + 2^{-N}}{2}\)임을 확인하세요.`,
      en: String.raw`Consider the fat Cantor set: at stage \(n\), from each of the \(2^{n-1}\) surviving closed intervals remove the middle open interval of absolute length \(4^{-n}\). Prove the total removed length over all stages is \(\tfrac12\) via a geometric series, and check that the length remaining after \(N\) stages is \(\dfrac{1 + 2^{-N}}{2}\).`,
    },
    display: [
      String.raw`\sum_{n=1}^{\infty} 2^{n-1} \cdot 4^{-n} = \sum_{n=1}^{\infty} 2^{-n-1} = \frac{1/4}{1 - 1/2} = \frac12`,
      String.raw`1 - \sum_{n=1}^{N} 2^{-n-1} = 1 - \tfrac12(1 - 2^{-N}) = \tfrac12(1 + 2^{-N}) \;\xrightarrow[N\to\infty]{}\; \tfrac12`,
    ],
    preset: { stage: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\)단계: 구간 16개, 남은 길이 \(\tfrac{17}{32} = 0.53125 \to \tfrac12\) — 표준 칸토어는 16개 구간에 \(\left(\tfrac23\right)^4 = \tfrac{16}{81} \approx 0.197531 \to 0\).`,
      en: String.raw`Stage \(n = 4\): 16 intervals, remaining length \(\tfrac{17}{32} = 0.53125 \to \tfrac12\) — the standard Cantor set has 16 intervals with \(\left(\tfrac23\right)^4 = \tfrac{16}{81} \approx 0.197531 \to 0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`실행 가능성 확인: \(n\)단계 구간의 공통 길이를 \(\ell_n\)이라 하면 \(\ell_0 = 1\)이고 점화식은 \(\ell_n = (\ell_{n-1} - 4^{-n})/2\)입니다. 귀납법으로 정확한 공식 \(\ell_n = \frac{2^{-n} + 4^{-n}}{2}\)를 얻습니다 (\(n = 0\): \(\frac{1 + 1}{2} = 1\); 단계는 직접 대입으로 확인됩니다). 따라서 \(\ell_{n-1} = \frac{2^{-(n-1)} + 4^{-(n-1)}}{2} > \frac{2^{-(n-1)}}{2} = 2^{-n} > 4^{-n}\) (\(n \ge 1\))이므로, 길이 \(4^{-n}\)인 가운데 구간은 실제로 들어갑니다 — 제거가 모든 단계에서 가능합니다.`,
          en: String.raw`Feasibility check: let \(\ell_n\) be the common length of the stage-\(n\) intervals; then \(\ell_0 = 1\) and \(\ell_n = (\ell_{n-1} - 4^{-n})/2\). Induction gives the exact formula \(\ell_n = \frac{2^{-n} + 4^{-n}}{2}\) (\(n = 0\): \(\frac{1 + 1}{2} = 1\); the step is a direct substitution). Hence \(\ell_{n-1} = \frac{2^{-(n-1)} + 4^{-(n-1)}}{2} > \frac{2^{-(n-1)}}{2} = 2^{-n} > 4^{-n}\) for \(n \ge 1\), so a middle interval of length \(4^{-n}\) genuinely fits — the removal is possible at every stage.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n\)단계에서는 \(n-1\)단계에서 살아남은 닫힌구간이 \(2^{n-1}\)개 있고, 각 구간에서 길이 \(4^{-n}\)인 가운데 열린구간을 정확히 하나씩 제거합니다. 서로 다른 단계·서로 다른 구간에서 제거된 열린구간들은 모두 서로소입니다 (닫힌구간 안쪽에서 파낸 것이고, 단계가 진행될수록 남은 집합이 중첩되므로). 따라서 \(N\)단계까지 제거된 총길이는 단계별 기여의 합입니다.`,
          en: String.raw`At stage \(n\) there are \(2^{n-1}\) surviving closed intervals from stage \(n-1\), and exactly one middle open interval of length \(4^{-n}\) is removed from each. Removed open intervals from different stages and different parent intervals are all pairwise disjoint (each is carved out of the interior of a closed interval, and the surviving sets are nested). So the total length removed through stage \(N\) is the sum of the per-stage contributions.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n\)단계의 기여는 \(2^{n-1} \cdot 4^{-n}\)입니다. 지수를 정리하면 \(\dfrac{2^{n-1}}{4^n} = \dfrac{2^{n-1}}{2^{2n}} = 2^{-n-1}\)이므로, 제거된 총길이는 공비 \(\tfrac12\)인 기하급수 \(\sum_{n=1}^{\infty} 2^{-n-1}\)입니다. 첫 항이 \(\tfrac14\)이므로 합은 \(\dfrac{1/4}{1 - 1/2} = \tfrac12\)입니다.`,
          en: String.raw`The stage-\(n\) contribution is \(2^{n-1} \cdot 4^{-n}\). Simplifying the exponent, \(\dfrac{2^{n-1}}{4^n} = \dfrac{2^{n-1}}{2^{2n}} = 2^{-n-1}\), so the total removed length is the geometric series \(\sum_{n=1}^{\infty} 2^{-n-1}\) with ratio \(\tfrac12\). Its first term is \(\tfrac14\), giving \(\dfrac{1/4}{1 - 1/2} = \tfrac12\).`,
        },
      },
      {
        text: {
          ko: String.raw`유한 단계 버전: \(N\)단계까지 제거된 총길이는 부분합 \(\sum_{n=1}^{N} 2^{-n-1} = \tfrac14 \cdot \dfrac{1 - 2^{-N}}{1 - 1/2} = \tfrac12(1 - 2^{-N})\)입니다. \([0,1]\)에서 시작했으므로 \(N\)단계 뒤 남은 길이는 \(1 - \tfrac12(1 - 2^{-N}) = \tfrac12(1 + 2^{-N})\)이고, \(N \to \infty\)에서 \(\tfrac12\)로 수렴합니다. \(N = 1\)이면 \(1 - \tfrac14 = \tfrac34 = \tfrac12(1 + \tfrac12)\) — 구간 \([0, \tfrac38]\)과 \([\tfrac58, 1]\)이 남고 가운데 \((\tfrac38, \tfrac58)\)이 파인 것과 일치합니다.`,
          en: String.raw`The finite-stage version: through stage \(N\) the total removed is the partial sum \(\sum_{n=1}^{N} 2^{-n-1} = \tfrac14 \cdot \dfrac{1 - 2^{-N}}{1 - 1/2} = \tfrac12(1 - 2^{-N})\). Starting from \([0,1]\), the length remaining after \(N\) stages is \(1 - \tfrac12(1 - 2^{-N}) = \tfrac12(1 + 2^{-N})\), tending to \(\tfrac12\) as \(N \to \infty\). For \(N = 1\) this is \(1 - \tfrac14 = \tfrac34 = \tfrac12(1 + \tfrac12)\) — the surviving intervals \([\,0, \tfrac38\,]\) and \([\,\tfrac58, 1\,]\) with the middle \((\tfrac38, \tfrac58)\) carved out, exactly as the scene shows.`,
        },
      },
      {
        text: {
          ko: String.raw`유한 부분합에서 무한 합으로의 이행은 Lebesgue 측도의 가산 가법성(아래로부터의 연속성)에 근거합니다: 서로소인 제거 구간들의 합집합 \(G\)에 대해 \(m(G) = \sum_{n=1}^{\infty} 2^{n-1} 4^{-n} = \lim_{N \to \infty} \sum_{n=1}^{N} 2^{-n-1} = \tfrac12\)입니다. 따라서 제거된 열린구간들의 서로소 합집합 \(G\)의 Lebesgue 측도는 \(m(G) = \tfrac12\)이고, \(C = [0,1] \setminus G\)이므로 \(m(C) = 1 - \tfrac12 = \tfrac12 > 0\)입니다. 표준 칸토어 집합(\(n\)단계에서 각 구간의 가운데 \(1/3\) 제거, 남은 길이 \((2/3)^n \to 0\))과의 차이가 여기서 갈립니다.`,
          en: String.raw`Passing from the finite partial sums to the infinite total uses countable additivity of Lebesgue measure (continuity from below): for the pairwise-disjoint union \(G\) of the removed intervals, \(m(G) = \sum_{n=1}^{\infty} 2^{n-1} 4^{-n} = \lim_{N \to \infty} \sum_{n=1}^{N} 2^{-n-1} = \tfrac12\). Hence the pairwise-disjoint union \(G\) of the removed open intervals has Lebesgue measure \(m(G) = \tfrac12\), and since \(C = [0,1] \setminus G\), we get \(m(C) = 1 - \tfrac12 = \tfrac12 > 0\). This is where the fat Cantor set parts company with the standard Cantor set (middle third removed each stage, remaining length \((2/3)^n \to 0\)).`,
        },
      },
    ],
  },
  {
    id: 'nowhere-dense-perfect',
    statement: {
      ko: String.raw`fat Cantor 집합 \(C\)를 \(F_0 = [0,1]\), \(F_n\)은 \(F_{n-1}\)의 각 닫힌구간에서 가운데 열린구간(길이 \(4^{-n}\))을 제거한 것, \(C = \bigcap_{n \ge 0} F_n\)으로 정의하세요. \(C\)가 compact이고, nowhere dense이며, perfect함을 증명하세요 (내부는 비어 있지만, \(m(C) = \tfrac12\)임에 유의).`,
      en: String.raw`Let the fat Cantor set be \(C = \bigcap_{n \ge 0} F_n\), where \(F_0 = [0,1]\) and \(F_n\) removes the middle open interval (length \(4^{-n}\)) from each closed interval of \(F_{n-1}\). Prove \(C\) is compact, nowhere dense, and perfect (noting that its interior is empty yet \(m(C) = \tfrac12\)).`,
    },
    display: [
      String.raw`\ell_n = \frac{\ell_{n-1} - 4^{-n}}{2} < 2^{-n}`,
      String.raw`C = \bigcap_{n\ge 0} F_n\ \text{closed} \subset [0,1]\ \text{compact}`,
      String.raw`\operatorname{int}(C) = \varnothing\ \text{(every open interval meets a removed piece)}`,
      String.raw`x \in C \Rightarrow x = \lim z_n,\ z_n \in C \setminus \{x\}`,
    ],
    preset: { stage: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\)단계: 구간 16개에 남은 길이 \(0.53125\) — 16개의 얇은 조각이지만 위상적으로는 "속이 텅 빈" 집합입니다 (아래 증명: 모든 열린구간이 제거된 조각과 만납니다).`,
      en: String.raw`Stage \(n = 4\): 16 intervals with remaining length \(0.53125\) — sixteen thin slivers, yet topologically the set is "hollow inside" (proof below: every open interval meets a removed piece).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`Compact: 각 \(F_n\)은 닫힌구간들의 유한 합집합이므로 닫힌집합이고, \(C = \bigcap_n F_n\)은 닫힌집합들의 교집합이므로 닫혀 있습니다. \(C \subset [0,1]\)이 유계이므로 Heine–Borel 정리로 \(C\)는 compact합니다.`,
          en: String.raw`Compact: each \(F_n\) is a finite union of closed intervals, hence closed, and \(C = \bigcap_n F_n\) is an intersection of closed sets, hence closed. Since \(C \subset [0,1]\) is bounded, Heine–Borel makes \(C\) compact.`,
        },
      },
      {
        text: {
          ko: String.raw`길이 보조정리: 대칭성으로 \(n\)단계의 모든 구간은 길이가 같습니다. 그 길이를 \(\ell_n\)이라 하면 \(\ell_0 = 1\), \(\ell_n = (\ell_{n-1} - 4^{-n})/2\)이므로 \(\ell_n < \ell_{n-1}/2\)입니다. 부등식 \(\ell_n < 2^{-n}\)은 \(n \ge 1\)에서만 성립합니다 (\(n = 0\)이면 \(1 < 1\)로 거짓입니다). Base case는 \(n = 1\)입니다: 구성에서 직접 \(\ell_1 = (1 - 4^{-1})/2 = 3/8 < 1/2 = 2^{-1}\)입니다. Inductive step: \(n \ge 2\)이고 \(\ell_{n-1} < 2^{-(n-1)}\)이면 \(\ell_n < \ell_{n-1}/2 < 2^{-(n-1)}/2 = 2^{-n}\)입니다. 따라서 모든 \(n \ge 1\)에 대해 \(\ell_n < 2^{-n}\)이며, 특히 \(\ell_n \to 0\)입니다.`,
          en: String.raw`Length lemma: by symmetry every stage-\(n\) interval has the same length. Calling it \(\ell_n\), we have \(\ell_0 = 1\) and \(\ell_n = (\ell_{n-1} - 4^{-n})/2\), so \(\ell_n < \ell_{n-1}/2\). The bound \(\ell_n < 2^{-n}\) is valid only for \(n \ge 1\) (at \(n = 0\) it would read \(1 < 1\), which is false). The base case is \(n = 1\), verified directly from the construction: \(\ell_1 = (1 - 4^{-1})/2 = 3/8 < 1/2 = 2^{-1}\). Inductive step: for \(n \ge 2\), if \(\ell_{n-1} < 2^{-(n-1)}\) then \(\ell_n < \ell_{n-1}/2 < 2^{-(n-1)}/2 = 2^{-n}\). Hence \(\ell_n < 2^{-n}\) for every \(n \ge 1\), and in particular \(\ell_n \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`Nowhere dense: \(C\)가 닫혀 있으므로 \(\overline{C}\)의 내부가 비었음을 보이면 됩니다. 길이가 \(\delta > 0\)인 열린구간 \(I\)를 잡고, \((0,1)\) 안에 들어가도록 축소해도 됩니다 (그렇지 않으면 \(I \not\subset C\)가 자명). \(2^{-n} < \delta\)인 \(n\)을 택하면 \(\ell_n < \delta\)입니다. \(I\)가 어떤 제거된 열린구간과도 만나지 않는다고 가정하면, \(I \subset F_n\)이 됩니다. \(F_n\)은 서로소인 닫힌구간들의 합집합이고 \(I\)는 연결집합이므로, \(I\)는 그 중 정확히 하나의 구간 \(J\) 안에 통째로 들어갑니다. 그런데 \(\delta = \lvert I \rvert \le \lvert J \rvert = \ell_n < \delta\) — 모순입니다.`,
          en: String.raw`Nowhere dense: since \(C\) is closed, it suffices to show its closure — itself — has empty interior. Take a nonempty open interval \(I\) of length \(\delta > 0\), shrinking it into \((0,1)\) if needed (otherwise \(I \not\subset C\) trivially). Choose \(n\) with \(2^{-n} < \delta\), so \(\ell_n < \delta\). Suppose \(I\) meets no removed open interval; then \(I \subset F_n\). But \(F_n\) is a union of pairwise-disjoint closed intervals and \(I\) is connected, so \(I\) lies entirely inside exactly one of them, say \(J\). Then \(\delta = \lvert I \rvert \le \lvert J \rvert = \ell_n < \delta\) — contradiction.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(I\)는 항상 제거된 열린구간과 만나고, 그 교집합은 \(I \setminus C\)의 비어 있지 않은 열린 부분집합입니다. 즉 어떤 비어 있지 않은 열린구간도 \(C\) 안에 들어가지 않으므로 \(\operatorname{int}(C) = \varnothing\) — \(C\)는 nowhere dense입니다.`,
          en: String.raw`Hence \(I\) always meets a removed open interval, and the intersection is a nonempty open subset of \(I \setminus C\). No nonempty open interval sits inside \(C\), so \(\operatorname{int}(C) = \varnothing\) — \(C\) is nowhere dense.`,
        },
      },
      {
        text: {
          ko: String.raw`Perfect: \(x \in C\)라 하자. 각 단계 \(n\)에서 \(x\)는 어떤 \(n\)단계 구간 \(J_n\)에 속합니다. \(n+1\)단계에서 \(J_n\)은 가운데 열린구간을 사이에 두고 두 개의 닫힌 자식구간 \(J', J''\)로 갈라지고, \(x\)는 그 중 하나(예컨대 \(J'\))에 속합니다. 형제 구간 \(J''\) 안의 점을 명시적으로 만듭니다: \(J''\)에서 시작해 각 단계마다 자식 중 하나(예컨대 왼쪽 자식)를 골라 중첩 사슬 \(J'' = K_{n+1} \supset K_{n+2} \supset \cdots\)를 만들면 \(\lvert K_j \rvert = \ell_j \to 0\)이므로, 중첩구간 원리로 교집합 \(\bigcap_j K_j\)는 한 점 \(z_n\)으로 이루어집니다. 각 \(K_j\)는 어떤 \(F_j\)의 닫힌구간이고 \(F_j\)들은 중첩되므로 \(z_n \in \bigcap_j F_j = C\)이며, 처음 선택 때문에 \(z_n \in J''\)입니다. 가운데 간격이 \(x\)와 \(z_n\)을 분리하므로 \(z_n \ne x\)이고, \(\lvert z_n - x \rvert \le \ell_n < 2^{-n} \to 0\)입니다 (\(n \ge 1\)). 따라서 \(x\)의 모든 근방은 \(C \setminus \{x\}\)의 점을 포함하므로 \(x\)는 \(C\)의 극한점입니다. 모든 \(x \in C\)에 대해 성립하므로 \(C\)는 perfect합니다.`,
          en: String.raw`Perfect: let \(x \in C\). At each stage \(n\), \(x\) lies in some stage-\(n\) interval \(J_n\). At stage \(n+1\), \(J_n\) splits into two closed children \(J', J''\) separated by the removed open middle, and \(x\) belongs to one of them, say \(J'\). Build a point of the sibling \(J''\) explicitly: starting from \(J''\), choose one child at each stage (e.g. always the left child) to form a nested chain \(J'' = K_{n+1} \supset K_{n+2} \supset \cdots\); since \(\lvert K_j \rvert = \ell_j \to 0\), the nested-interval principle says \(\bigcap_j K_j\) is a single point \(z_n\). Each \(K_j\) is a closed interval of some \(F_j\) and the \(F_j\) are nested, so \(z_n \in \bigcap_j F_j = C\), and by construction \(z_n \in J''\). The middle gap separates \(x\) from \(z_n\), so \(z_n \ne x\), and \(\lvert z_n - x \rvert \le \ell_n < 2^{-n} \to 0\) (for \(n \ge 1\)). Hence every neighborhood of \(x\) contains a point of \(C \setminus \{x\}\), so \(x\) is a limit point of \(C\). This holds for every \(x \in C\), so \(C\) is perfect.`,
        },
      },
    ],
  },
  {
    id: 'open-dense-complement',
    statement: {
      ko: String.raw`\(U = [0,1] \setminus C\)를 fat Cantor 집합의 여집합이라 하세요. \(U\)가 (상대위상으로) 열려 있고 \([0,1]\)에서 조밀하며 \(m(U) = \tfrac12\)임을 증명하세요. 그리고 다음 표를 완성하며 마무리하세요: "내부가 비었고 길이는 절반" — 측도와 위상적 크기는 독립적인 개념이다.`,
      en: String.raw`Let \(U = [0,1] \setminus C\) be the complement of the fat Cantor set. Prove \(U\) is (relatively) open, dense in \([0,1]\), and has \(m(U) = \tfrac12\). Then finish by completing this table: "empty interior, yet half the length" — measure and topological size are independent notions.`,
    },
    display: [
      String.raw`U = \bigcup_{\text{stages}} \text{(removed open intervals)}`,
      String.raw`m(U) = \tfrac12,\quad m(C) = \tfrac12`,
      String.raw`\begin{array}{c|cc} & m = 0 & m > 0 \\ \hline \text{nowhere dense} & \text{standard Cantor} & \textbf{fat Cantor} \\ \text{dense} & \mathbb{Q} \cap [0,1] & \text{irrationals in } [0,1] \end{array}`,
    ],
    preset: { stage: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\)단계: 제거된 열린구간들의 길이 합은 \(\tfrac12(1 - 2^{-4}) = 0.46875\), 남은 길이는 \(0.53125\) — 여집합은 이미 절반에 육박하고, 극한에서는 정확히 \(\tfrac12\)가 됩니다.`,
      en: String.raw`Stage \(n = 4\): the removed open intervals total \(\tfrac12(1 - 2^{-4}) = 0.46875\) in length, leaving \(0.53125\) — the complement is already nearly half, and in the limit exactly \(\tfrac12\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(U\)는 닫힌집합 \(C\)의 여집합이므로 \([0,1]\)의 상대위상에서 열려 있습니다. 구체적으로 \(U\)는 모든 단계에서 제거된 열린구간들의 합집합 — 서로소인 열린구간들의 가산 합집합 — 입니다.`,
          en: String.raw`\(U\) is the complement of the closed set \(C\), hence relatively open in \([0,1]\). Concretely, \(U\) is the union of the removed open intervals over all stages — a countable union of pairwise-disjoint open intervals.`,
        },
      },
      {
        text: {
          ko: String.raw`Dense: 앞 문제에서 모든 비어 있지 않은 열린구간이 제거된 열린구간과 만난다는 것을 보였습니다. 상대위상까지 처리합니다: \([0,1]\)의 비어 있지 않은 상대적 열린집합은 열린구간이거나 끝점에 닿은 \([0, a)\) (\(a > 0\)), \((b, 1]\) (\(b < 1\)) 꼴을 포함합니다. 끝점 경우에도 \((0, a)\) 또는 \((b, 1)\)이라는 비어 있지 않은 열린구간을 포함하므로 앞의 논증이 그대로 적용됩니다. 즉 모든 상대적 열린집합은 \(U\)의 점을 포함하므로, \(U\)는 \([0,1]\)에서 조밀합니다.`,
          en: String.raw`Dense: the previous problem showed that every nonempty open interval meets a removed open interval. Handle the relative topology as well: a nonempty relatively open subset of \([0,1]\) contains either an open interval or an endpoint-touching piece \([0, a)\) with \(a > 0\) or \((b, 1]\) with \(b < 1\). In the endpoint cases it still contains a nonempty open interval, namely \((0, a)\) or \((b, 1)\), so the previous argument applies verbatim. Hence every relatively open set contains a point of \(U\), so \(U\) is dense in \([0,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`측도: 제거된 열린구간들은 서로소이므로 \(m(U) = \sum_{n=1}^{\infty} 2^{n-1} 4^{-n} = \tfrac12\)입니다 (첫 번째 문제의 기하급수). 따라서 \(m(C) = m([0,1]) - m(U) = 1 - \tfrac12 = \tfrac12\)입니다.`,
          en: String.raw`Measure: the removed open intervals are pairwise disjoint, so \(m(U) = \sum_{n=1}^{\infty} 2^{n-1} 4^{-n} = \tfrac12\) (the geometric series from the first problem). Hence \(m(C) = m([0,1]) - m(U) = 1 - \tfrac12 = \tfrac12\).`,
        },
      },
      {
        text: {
          ko: String.raw`정리하면: \(C\)는 닫혀 있고, 내부가 비어 있고(nowhere dense), perfect하며, 길이는 \(\tfrac12\)입니다. 그 여집합 \(U\)는 열려 있고, 조밀하며, 길이는 \(\tfrac12\)입니다. 위의 표가 보여주듯 네 칸이 모두 찹니다 — 표준 칸토어 집합(nowhere dense, 측도 0), fat Cantor 집합(nowhere dense, 측도 \(\tfrac12\)), \([0,1]\)의 유리수들(조밀, 측도 0), 무리수들(조밀, 측도 1). 심지어 "열려 있고 조밀한데 측도가 임의로 작은" 집합도 있습니다 (유리수를 \(q_1, q_2, \dots\)로 나열하고 — 인덱스는 \(k \ge 1\)부터 — 각 \(q_k\)마다 반지름 \(\varepsilon/2^k\)인 열린구간을 잡은 합집합: 각 구간의 길이는 \(2\varepsilon/2^k\)이고 \(\sum_{k=1}^{\infty} 2\varepsilon/2^k = 2\varepsilon\)이므로 전체 측도 \(\le 2\varepsilon\)). 결론: "내부가 비었다"는 위상적 진술과 "길이가 얼마이다"는 측도적 진술은 서로에게 아무것도 강제하지 않습니다 — fat Cantor 집합은 그 독립성을 보여주는 가장 극적인 예입니다.`,
          en: String.raw`To summarize: \(C\) is closed, has empty interior (nowhere dense), is perfect, and has length \(\tfrac12\); its complement \(U\) is open, dense, and has length \(\tfrac12\). The table above fills all four cells — the standard Cantor set (nowhere dense, measure 0), the fat Cantor set (nowhere dense, measure \(\tfrac12\)), the rationals in \([0,1]\) (dense, measure 0), the irrationals (dense, measure 1). There are even sets that are open and dense with arbitrarily small measure (enumerate the rationals as \(q_1, q_2, \dots\) — the index starts at \(k \ge 1\) — and around each \(q_k\) take an open interval of radius \(\varepsilon/2^k\): each interval has length \(2\varepsilon/2^k\), and \(\sum_{k=1}^{\infty} 2\varepsilon/2^k = 2\varepsilon\), so the total measure is \(\le 2\varepsilon\)). The punchline: the topological statement "has empty interior" and the measure-theoretic statement "has such-and-such length" impose nothing on each other — and the fat Cantor set is the most dramatic witness to their independence.`,
        },
      },
    ],
  },
];
