import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Peano curve scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/peano-curve.test.ts): the 9^k + 1 polyline points, the 3^-k step
 * bound, the grid-filling property, and the trace-point claims.
 */
export const peanoCurveProblems: readonly ProblemMeta[] = [
  {
    id: 'peano-uniform-limit',
    statement: {
      ko: String.raw`차수 \(k\) 근사곡선 \(p_k: [0,1] \to [0,1]^2\) (9개의 부분정사각형을 뱀 모양으로 도는 꺾은선의 재귀적 세분)가 균등 코시 수열임을 보이고, 균등 극한 \(p\)가 연속임을 완전히 증명하세요.`,
      en: String.raw`Show that the order-\(k\) approximants \(p_k: [0,1] \to [0,1]^2\) (the recursive subdivision of the snake polyline through the 9 subsquares) are uniformly Cauchy, and prove completely that the uniform limit \(p\) is continuous.`,
    },
    display: [
      String.raw`\|p_{k+1} - p_k\|_\infty \le \frac{\sqrt{2}}{3^k} \to 0`,
    ],
    preset: { order: 1, t: 0.25, showGrid: true },
    presetCaption: {
      ko: String.raw`차수 \(k = 1\): 9개의 선분이 9개의 부분정사각형 중심을 뱀 모양으로 잇습니다 — 이 패턴이 각 정사각형 안에서 재귀적으로 반복됩니다.`,
      en: String.raw`Order \(k = 1\): 9 segments snake through the 9 subsquare centers — this pattern repeats recursively inside each subsquare.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(p_k\)는 꺾은선이므로 연속입니다. 매개화는 다음과 같습니다: \(p_k\)는 각 구간 \([(j-1)/9^k,\, j/9^k]\)를 \(j\)번째 \(k\)단계 부분정사각형 \(Q_j^{(k)}\) (한 변 \(3^{-k}\)) 안에서 뱀 모양 순서대로 돕니다.`,
          en: String.raw`Each \(p_k\) is a polyline, hence continuous. The parametrization is: \(p_k\) traverses each interval \([(j-1)/9^k,\, j/9^k]\) inside the \(j\)-th level-\(k\) subsquare \(Q_j^{(k)}\) (side \(3^{-k}\)), in snake order.`,
        },
      },
      {
        text: {
          ko: String.raw`\(p_{k+1}\)은 세분(refinement)입니다: 구간 \([(j-1)/9^k,\, j/9^k]\) 위에서 \(p_{k+1}\)은 같은 \(Q_j^{(k)}\) 안에 들어 있는 9개의 \((k+1)\)단계 부분정사각형을 돕니다 (재귀가 각 \(Q_j\) 안에서 같은 패턴을 적용하므로). 따라서 모든 \(t\)에 대해 \(p_k(t)\)와 \(p_{k+1}(t)\)는 같은 \(Q_j^{(k)}\) 안에 있고, \(|p_{k+1}(t) - p_k(t)| \le \mathrm{diam}\, Q_j^{(k)} = \sqrt{2}\, 3^{-k}\)입니다. 꼬리합을 취합니다: \(m > n\)이면 삼각부등식으로 \(|p_m(t) - p_n(t)| \le \sum_{j=n}^{m-1} |p_{j+1}(t) - p_j(t)| \le \sum_{j=n}^{m-1} \sqrt{2}\, 3^{-j} = \sqrt{2}\, 3^{-n}\, \frac{1 - 3^{-(m-n)}}{1 - 1/3} \le \frac{3\sqrt{2}}{2}\, 3^{-n}\)입니다. 우변은 \(t\)와 \(m\)에 무관하게 \(n \to \infty\)일 때 0으로 가므로 \((p_k)\)는 균등 코시 수열입니다. \(\mathbb{R}^2\)이 완비이므로 각 \(t\)에서 \(p_k(t)\)가 수렴하고, 균등 코시성은 그 수렴이 균등함을 보장합니다 — 극한을 \(p\)라 하세요.`,
          en: String.raw`\(p_{k+1}\) refines \(p_k\): on \([(j-1)/9^k,\, j/9^k]\) it traverses the 9 level-\((k+1)\) subsquares inside the same \(Q_j^{(k)}\) (the recursion applies the same pattern within each \(Q_j\)). Hence for every \(t\), \(p_k(t)\) and \(p_{k+1}(t)\) both lie in \(Q_j^{(k)}\), so \(|p_{k+1}(t) - p_k(t)| \le \mathrm{diam}\, Q_j^{(k)} = \sqrt{2}\, 3^{-k}\). Sum the tail: for \(m > n\), the triangle inequality gives \(|p_m(t) - p_n(t)| \le \sum_{j=n}^{m-1} |p_{j+1}(t) - p_j(t)| \le \sum_{j=n}^{m-1} \sqrt{2}\, 3^{-j} = \sqrt{2}\, 3^{-n}\, \frac{1 - 3^{-(m-n)}}{1 - 1/3} \le \frac{3\sqrt{2}}{2}\, 3^{-n}\). The right side tends to 0 as \(n \to \infty\), independently of \(t\) and \(m\), so \((p_k)\) is uniformly Cauchy. Since \(\mathbb{R}^2\) is complete, \(p_k(t)\) converges for each \(t\), and uniform Cauchyness makes the convergence uniform — call the limit \(p\).`,
        },
      },
      {
        text: {
          ko: String.raw`연속함수들의 균등 극한은 연속입니다: \(|p(s) - p(t)| \le |p(s) - p_k(s)| + |p_k(s) - p_k(t)| + |p_k(t) - p(t)|\)에서, 균등수렴으로 첫째·셋째 항을 작게 한 뒤 고정된 \(k\)에 대해 \(p_k\)의 연속성으로 가운데 항을 작게 하면 됩니다 (\(\varepsilon/3\) 논증). 따라서 \(p: [0,1] \to [0,1]^2\)는 연속인 극한 곡선입니다.`,
          en: String.raw`A uniform limit of continuous functions is continuous: from \(|p(s) - p(t)| \le |p(s) - p_k(s)| + |p_k(s) - p_k(t)| + |p_k(t) - p(t)|\), make the first and third terms small by uniform convergence, then the middle term small by continuity of the fixed \(p_k\) (the \(\varepsilon/3\) argument). Hence \(p: [0,1] \to [0,1]^2\) is a continuous limit curve.`,
        },
      },
    ],
  },
  {
    id: 'peano-surjective',
    statement: {
      ko: String.raw`위 문제의 극한 곡선 \(p: [0,1] \to [0,1]^2\)가 전사함수임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that the limit curve \(p: [0,1] \to [0,1]^2\) from the problem above is surjective.`,
    },
    display: [
      String.raw`p([0,1]) = [0,1]^2`,
    ],
    preset: { order: 2, t: 0.5, showGrid: true },
    presetCaption: {
      ko: String.raw`차수 \(k = 2\): 81개의 선분이 \(9 \times 9\) 격자의 모든 칸을 방문합니다 — 차수가 올라갈수록 정사각형이 채워집니다.`,
      en: String.raw`Order \(k = 2\): 81 segments visit every cell of the \(9 \times 9\) grid — the square fills up as the order grows.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(y \in [0,1]^2\)를 임의로 잡습니다. 각 단계 \(k\)에서 \(y\)는 어떤 \(k\)단계 부분정사각형 \(Q^{(k)}\) (한 변 \(3^{-k}\)) 안에 들어 있습니다. \(p_k\)는 모든 \(k\)단계 부분정사각형을 방문하므로, \(p_k(t_k) \in Q^{(k)}\)인 \(t_k\)가 존재합니다.`,
          en: String.raw`Take any \(y \in [0,1]^2\). At each level \(k\), \(y\) lies in some level-\(k\) subsquare \(Q^{(k)}\) (side \(3^{-k}\)). Since \(p_k\) visits every level-\(k\) subsquare, there is \(t_k\) with \(p_k(t_k) \in Q^{(k)}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((t_k)\)는 \([0,1]\)의 수열이므로 컴팩트성에 의해 수렴하는 부분수열 \(t_{k_j} \to t\)가 존재합니다. 연속성에 의해 \(p(t_{k_j}) \to p(t)\)입니다. 그런데 \(|p(t_{k_j}) - y| \le |p(t_{k_j}) - p_{k_j}(t_{k_j})| + |p_{k_j}(t_{k_j}) - y|\)에서, 첫째 항은 균등수렴에 의해, 둘째 항은 두 점이 모두 같은 \(Q^{(k_j)}\) 안에 있으므로, 각각 \(\sqrt{2}\, 3^{-k_j} \to 0\)으로 수렴합니다. 따라서 \(p(t) = y\)입니다.`,
          en: String.raw`Since \((t_k)\) lies in \([0,1]\), compactness gives a convergent subsequence \(t_{k_j} \to t\). By continuity, \(p(t_{k_j}) \to p(t)\). But \(|p(t_{k_j}) - y| \le |p(t_{k_j}) - p_{k_j}(t_{k_j})| + |p_{k_j}(t_{k_j}) - y|\): the first term tends to 0 by uniform convergence, and the second because both points lie in the same \(Q^{(k_j)}\) — each is at most \(\sqrt{2}\, 3^{-k_j} \to 0\). Hence \(p(t) = y\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(y\)가 임의였으므로 \(p\)는 \([0,1]^2\)의 모든 점을 지나갑니다 — 연속인 전사함수 \(p: [0,1] \to [0,1]^2\)입니다. 1차원 구간이 2차원 정사각형을 "채울" 수 있다는 것이 페아노의 발견(1890)입니다.`,
          en: String.raw`Since \(y\) was arbitrary, \(p\) passes through every point of \([0,1]^2\) — a continuous surjection \(p: [0,1] \to [0,1]^2\). That a 1-dimensional interval can "fill" a 2-dimensional square was Peano's 1890 discovery.`,
        },
      },
    ],
  },
  {
    id: 'peano-not-injective',
    statement: {
      ko: String.raw`연속인 전단사함수 \([0,1] \to [0,1]^2\)는 존재하지 않음을 완전히 증명하세요 (Netto 정리). 따라서 위의 페아노 곡선은 단사함수일 수 없습니다.`,
      en: String.raw`Prove completely that no continuous bijection \([0,1] \to [0,1]^2\) exists (Netto's theorem). Hence the Peano curve above cannot be injective.`,
    },
    display: [
      String.raw`\text{no continuous bijection } [0,1] \to [0,1]^2`,
    ],
    preset: { order: 3, t: 0.75, showGrid: false },
    presetCaption: {
      ko: String.raw`차수 \(k = 3\): 729개의 선분 — 곡선이 자기 자신을 수없이 가로지르므로 단사일 수 없음이 눈으로 보입니다.`,
      en: String.raw`Order \(k = 3\): 729 segments — the curve crosses itself countless times, visibly ruling out injectivity.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`두 보조정리부터 증명합니다. (A) 컴팩트 집합의 연속상은 컴팩트: \(K\) 컴팩트, \(f\) 연속이면 \(f(K)\)의 열린 덮개 \(\{U_i\}\)에 대해 \(\{f^{-1}(U_i)\}\)는 \(K\)의 열린 덮개이므로 유한 부분덮개가 있고, 그 상들이 \(f(K)\)를 덮습니다. (B) Hausdorff 공간의 컴팩트 부분집합은 닫혀 있음: \(K \subseteq Y\) 컴팩트, \(y \notin K\)이면 각 \(x \in K\)에 대해 서로소인 근방 \(U_x \ni x\), \(V_x \ni y\)가 존재하고 (Hausdorff), 유한개의 \(U_{x_i}\)가 \(K\)를 덮으므로 \(\bigcap V_{x_i}\)는 \(K\)와 만나지 않는 \(y\)의 근방입니다.`,
          en: String.raw`Two lemmas first. (A) The continuous image of a compact set is compact: if \(K\) is compact and \(f\) continuous, an open cover \(\{U_i\}\) of \(f(K)\) pulls back to an open cover \(\{f^{-1}(U_i)\}\) of \(K\), which has a finite subcover whose images cover \(f(K)\). (B) A compact subset of a Hausdorff space is closed: if \(K \subseteq Y\) is compact and \(y \notin K\), each \(x \in K\) has disjoint neighborhoods \(U_x \ni x\), \(V_x \ni y\) (Hausdorff); finitely many \(U_{x_i}\) cover \(K\), so \(\bigcap V_{x_i}\) is a neighborhood of \(y\) missing \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`Netto 정리: 컴팩트 공간에서 Hausdorff 공간으로의 연속 전단사는 동형사상(homeomorphism)입니다. 실제로 \(F \subseteq K\)가 닫혀 있으면 \(F\)는 컴팩트하고, \(f(F)\)는 (A)에 의해 컴팩트하므로 (B)에 의해 \(Y\)에서 닫혀 있습니다 — 즉 \(f\)는 닫힌 사상입니다. 닫힌 전단사는 동형사상입니다 (\((f^{-1})^{-1}(F) = f(F)\)가 닫혀 있으므로 \(f^{-1}\)이 연속).`,
          en: String.raw`Netto's theorem: a continuous bijection from a compact space to a Hausdorff space is a homeomorphism. Indeed, if \(F \subseteq K\) is closed then \(F\) is compact, so \(f(F)\) is compact by (A) and closed in \(Y\) by (B) — i.e. \(f\) is a closed map. A closed bijection is a homeomorphism (\((f^{-1})^{-1}(F) = f(F)\) is closed, so \(f^{-1}\) is continuous).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(f: [0,1] \to [0,1]^2\)가 연속 전단사라고 가정하면 동형사상이어야 합니다. 내부의 점 \(c \in (0,1)\)을 제거하면 \([0,1] \setminus \{c\} = [0,c) \cup (c,1]\)은 서로소인 비어 있지 않은 열린 집합으로 분리되므로 연결집합이 아닙니다. 반면 \([0,1]^2\)에서 한 점 \(r\)을 제거한 공간이 경로연결임을 식으로 보입니다.`,
          en: String.raw`If \(f: [0,1] \to [0,1]^2\) were a continuous bijection, it would be a homeomorphism. Removing an interior point \(c \in (0,1)\) disconnects the interval: \([0,1] \setminus \{c\} = [0,c) \cup (c,1]\) is a separation into disjoint nonempty opens. In contrast, \([0,1]^2\) minus a point \(r\) is path-connected, shown here with explicit formulas.`,
        },
      },
      {
        text: {
          ko: String.raw`\(p, q \ne r\)인 두 점을 잡습니다. \(p = q\)이면 상수 경로 \(\gamma(t) \equiv p\)입니다. \(p \ne q\)인 경우 직선 \(L(t) = (1-t)p + tq\) (\(t \in [0,1]\))를 봅니다. \(r \notin L([0,1])\)이면 \(\gamma = L\)이 원하는 경로입니다. \(r \in L([0,1])\)이면 \(r = L(t_0)\)인 \(t_0 \in (0,1)\)이 유일하게 존재합니다 (\(r \ne p, q\)이므로). 중점 \(m = \frac{p+q}{2}\), 방향 \(d = q - p\), 단위 법선 \(n = \frac{(-d_2, d_1)}{|d|}\)를 두고, 우회점 \(s = m + \varepsilon n\) (\(\varepsilon \ne 0\), 아래에서 명시적으로 선택)을 잡습니다. 경로는 두 선분의 연결입니다: \(\gamma(t) = (1-2t)p + 2ts\) (\(0 \le t \le \frac12\)), \(\gamma(t) = (2-2t)s + (2t-1)q\) (\(\frac12 \le t \le 1\)).`,
          en: String.raw`Take two points \(p, q \ne r\). If \(p = q\), the constant path \(\gamma(t) \equiv p\) works. If \(p \ne q\), look at the line \(L(t) = (1-t)p + tq\) (\(t \in [0,1]\)). If \(r \notin L([0,1])\), then \(\gamma = L\) is the desired path. If \(r \in L([0,1])\), there is a unique \(t_0 \in (0,1)\) with \(r = L(t_0)\) (since \(r \ne p, q\)). Set the midpoint \(m = \frac{p+q}{2}\), direction \(d = q - p\), unit normal \(n = \frac{(-d_2, d_1)}{|d|}\), and pick the detour point \(s = m + \varepsilon n\) (\(\varepsilon \ne 0\), chosen explicitly below). The path is two segments joined: \(\gamma(t) = (1-2t)p + 2ts\) (\(0 \le t \le \frac12\)), \(\gamma(t) = (2-2t)s + (2t-1)q\) (\(\frac12 \le t \le 1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(r\)을 피하는지 확인합니다. 직선 \(pq\) 위의 점 \(x\)는 \(n \cdot (x - m) = 0\)을 만족하고 (\(n \perp d\)), \(r\)도 그 위에 있으므로 \(n \cdot (r - m) = 0\)입니다. \([p,s]\) 위의 점 \((1-u)p + us = (1-\frac{u}{2})p + \frac{u}{2}q + u\varepsilon n\)에 대해 \(n \cdot (x - m) = u\varepsilon\)이므로, 이것이 \(r\)과 같아지려면 \(u\varepsilon = 0\), 즉 \(u = 0\) — 그 점은 \(p \ne r\)뿐입니다. \([s,q]\) 위의 점 \((1-u)s + uq = \frac{1-u}{2}p + \frac{1+u}{2}q + (1-u)\varepsilon n\)에 대해서도 \(n \cdot (y - m) = (1-u)\varepsilon\)이므로 \((1-u)\varepsilon = 0\)에서 \(u = 1\) — 즉 점 \(q \ne r\)뿐입니다. 따라서 \(\gamma\)는 \(r\)을 지나지 않습니다.`,
          en: String.raw`Check that \(r\) is avoided. Points \(x\) on the line \(pq\) satisfy \(n \cdot (x - m) = 0\) (since \(n \perp d\)), and \(r\) lies on it, so \(n \cdot (r - m) = 0\). For a point \((1-u)p + us = (1-\frac{u}{2})p + \frac{u}{2}q + u\varepsilon n\) on \([p,s]\), \(n \cdot (x - m) = u\varepsilon\); equaling \(r\) forces \(u\varepsilon = 0\), i.e. \(u = 0\) — only the point \(p \ne r\). For a point \((1-u)s + uq = \frac{1-u}{2}p + \frac{1+u}{2}q + (1-u)\varepsilon n\) on \([s,q]\), \(n \cdot (y - m) = (1-u)\varepsilon\), so \((1-u)\varepsilon = 0\) gives \(u = 1\) — only the point \(q \ne r\). Hence \(\gamma\) never passes through \(r\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon\)의 명시적 선택 (\(s \in [0,1]^2\) 보장): \(m\)은 꼭짓점이 될 수 없습니다 (\(m\)이 꼭짓점이면 \(p = q = m\)이 되어 \(p \ne q\)에 모순). \(\delta = \min(m_1, 1-m_1, m_2, 1-m_2) \ge 0\)이라 둡니다. \(\delta > 0\)이면 (\(m\)이 내부) \(\varepsilon = \delta/2\)로 둡니다: \(|s - m| = \delta/2 < \delta\)이므로 \(s\)는 내부에 있습니다. \(\delta = 0\)이면 \(m\)은 변 위에 있고 꼭짓점은 아닙니다. 예를 들어 \(m = (m_1, 0)\), \(m_1 \in (0,1)\)인 경우 (나머지 세 변은 \((x,y) \mapsto (x,1-y)\) 등의 대칭으로 동일) \(\eta = \frac12\min(m_1, 1-m_1) > 0\)으로 두고, \(n_2 \ge 0\)이면 \(s = m + \eta n\), \(n_2 < 0\)이면 \(s = m - \eta n\)으로 둡니다. 그러면 \(s_2 = \eta|n_2| \in [0,\eta] \subset [0,1]\), \(|s_1 - m_1| \le \eta \le \frac12\min(m_1, 1-m_1)\)이므로 \(s_1 \in (0,1)\) — 즉 \(s \in [0,1]^2\)입니다. \(s \in [0,1]^2\)이면 볼록성에 의해 두 선분 \([p,s]\), \([s,q]\)도 \([0,1]^2\) 안에 있습니다.`,
          en: String.raw`Explicit choice of \(\varepsilon\) (forcing \(s \in [0,1]^2\)): \(m\) cannot be a corner (a corner \(m\) would give \(p = q = m\), contradicting \(p \ne q\)). Put \(\delta = \min(m_1, 1-m_1, m_2, 1-m_2) \ge 0\). If \(\delta > 0\) (\(m\) interior), take \(\varepsilon = \delta/2\): \(|s - m| = \delta/2 < \delta\), so \(s\) is interior. If \(\delta = 0\), then \(m\) lies on an edge but is not a corner. For instance with \(m = (m_1, 0)\), \(m_1 \in (0,1)\) (the other three edges are identical via symmetries like \((x,y) \mapsto (x,1-y)\)), put \(\eta = \frac12\min(m_1, 1-m_1) > 0\) and take \(s = m + \eta n\) if \(n_2 \ge 0\), \(s = m - \eta n\) if \(n_2 < 0\). Then \(s_2 = \eta|n_2| \in [0,\eta] \subset [0,1]\) and \(|s_1 - m_1| \le \eta \le \frac12\min(m_1, 1-m_1)\), so \(s_1 \in (0,1)\) — i.e. \(s \in [0,1]^2\). With \(s \in [0,1]^2\), convexity keeps both segments \([p,s]\), \([s,q]\) inside \([0,1]^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \([0,1]^2 \setminus \{r\}\)의 임의의 두 점은 \(r\)을 피하는 명시적 경로로 연결됩니다 — 경로연결이므로 연결집합입니다. 동형사상은 점을 제거한 공간으로 제한해도 동형사상이므로 모순입니다. 따라서 연속 전단사는 존재하지 않고, 페아노 전사함수는 단사일 수 없습니다.`,
          en: String.raw`Thus any two points of \([0,1]^2 \setminus \{r\}\) are joined by an explicit path avoiding \(r\) — path-connected, hence connected. A homeomorphism restricts to a homeomorphism of the punctured spaces — contradiction. So no continuous bijection exists, and the Peano surjection cannot be injective.`,
        },
      },
    ],
  },
];
