import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 위상 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'liouville-dense-gdelta',
    difficulty: 2,
    topics: ['baire-category'],
    statement: {
      ko: String.raw`무리수 \(x\)가 리우빌 수(Liouville number)라는 것은 모든 \(m \ge 1\)에 대해 부등식 \(|x - p/q| < 1/q^m\)을 만족하는 정수쌍 \((p, q)\) (\(q \ge 2\))가 무한히 많이 존재하는 것이다. \(k \ge 1\)에 대해 \(U_k = \bigcup_{q \ge 2}\bigcup_{p \in \mathbb{Z}} (p/q - 1/q^k,\ p/q + 1/q^k)\)이라 두자. (a) 각 \(U_k\)가 \(\mathbb{R}\)의 조밀한 열린 집합임을 보여라. (b) \(G = \bigcap_{k \ge 1} U_k \cap \bigcap_{j \ge 1} (\mathbb{R} \setminus \{r_j\})\) (여기서 \(\{r_j\}\)는 유리수의 열거)가 \(G_\delta\) 집합이고 그 모든 원소가 리우빌 수임을 보여라. (c) 베어 범주 정리로 리우빌 수들이 \(\mathbb{R}\)에 조밀하고 비가산임을 결론지어라.`,
      en: String.raw`An irrational \(x\) is a Liouville number if for every \(m \ge 1\) there are infinitely many integer pairs \((p, q)\) with \(q \ge 2\) satisfying \(|x - p/q| < 1/q^m\). For \(k \ge 1\) put \(U_k = \bigcup_{q \ge 2}\bigcup_{p \in \mathbb{Z}} (p/q - 1/q^k,\ p/q + 1/q^k)\). (a) Show each \(U_k\) is a dense open set in \(\mathbb{R}\). (b) Show \(G = \bigcap_{k \ge 1} U_k \cap \bigcap_{j \ge 1} (\mathbb{R} \setminus \{r_j\})\), where \(\{r_j\}\) enumerates the rationals, is a \(G_\delta\) set all of whose elements are Liouville numbers. (c) Use the Baire category theorem to conclude the Liouville numbers are dense in \(\mathbb{R}\) and uncountable.`,
    },
    display: [
      String.raw`U_k = \bigcup_{q \ge 2}\bigcup_{p \in \mathbb{Z}} \left(\frac{p}{q} - \frac{1}{q^k},\ \frac{p}{q} + \frac{1}{q^k}\right)`,
      String.raw`G = \bigcap_{k \ge 1} U_k \ \cap\ \bigcap_{j \ge 1} (\mathbb{R} \setminus \{r_j\})`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) 각 \(U_k\)는 열린 구간들의 합집합이므로 열려 있다. 모든 유리수 \(p/q\)는 중심이 자기 자신인 구간에 속하므로 \(\mathbb{Q} \subset U_k\)이고, \(\mathbb{Q}\)가 조밀하므로 \(U_k\)도 조밀하다.`,
          en: String.raw`(a) Each \(U_k\) is a union of open intervals, hence open. Every rational \(p/q\) lies in the interval centered at itself, so \(\mathbb{Q} \subset U_k\); since \(\mathbb{Q}\) is dense, each \(U_k\) is dense.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \(G\)는 가산 개의 열린 집합들의 교집합이므로 \(G_\delta\)이다 (각 \(\mathbb{R} \setminus \{r_j\}\)도 열려 있다). \(x \in G\)라 하자. \(x\)는 무리수이고, 각 \(k\)마다 \(|x - p_k/q_k| < 1/q_k^k\)인 쌍 \((p_k, q_k)\)이 존재한다. 서로 다른 쌍이 유한 개만 등장한다면, 어떤 쌍 \((p, q)\)가 무한히 많은 \(k\)에 대해 반복되어 \(|x - p/q| = 0\), 즉 \(x = p/q\)가 되어 무리수임에 모순이다. 따라서 서로 다른 쌍이 무한히 많다. 고정된 \(m\)에 대해 \(k \ge m\)인 쌍들은 \(|x - p_k/q_k| < 1/q_k^k \le 1/q_k^m\)을 만족하므로, \(x\)는 리우빌 수의 정의를 만족한다.`,
          en: String.raw`(b) \(G\) is a countable intersection of open sets, hence \(G_\delta\) (each \(\mathbb{R} \setminus \{r_j\}\) is open too). Let \(x \in G\). Then \(x\) is irrational, and for each \(k\) there is a pair \((p_k, q_k)\) with \(|x - p_k/q_k| < 1/q_k^k\). If only finitely many distinct pairs occurred, some pair \((p, q)\) would repeat for infinitely many \(k\), forcing \(|x - p/q| = 0\), i.e. \(x = p/q\), contradicting irrationality. So infinitely many distinct pairs occur. For fixed \(m\), the pairs with \(k \ge m\) satisfy \(|x - p_k/q_k| < 1/q_k^k \le 1/q_k^m\), so \(x\) meets the definition of a Liouville number.`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(G\)는 조밀한 열린 집합들의 가산 교집합이므로 베어 범주 정리에 의해 \(\mathbb{R}\)에 조밀하다. 따라서 리우빌 수들도 조밀하다. 또한 \(G\)는 비가산이다: \(G = \{x_n\}\)이라 가정하면 \(G \cap \bigcap_n (\mathbb{R} \setminus \{x_n\}) = \varnothing\)인데, 이는 조밀한 열린 집합들의 가산 교집합이므로 베어 정리에 의해 조밀해야 하여 모순이다.`,
          en: String.raw`(c) \(G\) is a countable intersection of dense open sets, so by the Baire category theorem it is dense in \(\mathbb{R}\); hence so are the Liouville numbers. Moreover \(G\) is uncountable: if \(G = \{x_n\}\) were countable, then \(G \cap \bigcap_n (\mathbb{R} \setminus \{x_n\}) = \varnothing\) would be a countable intersection of dense open sets, hence dense by Baire — a contradiction.`,
        },
      },
    ],
  },
  {
    id: 'cosine-contraction-iterations',
    difficulty: 2,
    topics: ['contraction', 'metric-spaces'],
    statement: {
      ko: String.raw`\(T(x) = \frac{\cos x + 1}{4}\) (\(x \in [0, 1]\))이라 하자. (a) \(T\)가 \([0, 1]\)을 자기 자신으로 보내는 수축사상(contraction)임을 보여라 (수축 상수를 명시하라). (b) \(T\)가 유일한 고정점 \(x^* \in [0, 1]\)을 가짐을 결론지어라. (c) \(x_0 = 0\), \(x_{n+1} = T(x_n)\)이라 할 때, 오차 상한 \(|x_n - x^*| \le \frac{q^n}{1-q}|x_1 - x_0|\)을 이용해 \(|x_n - x^*| < 10^{-3}\)을 보장하는 가장 작은 \(n\)을 구하라.`,
      en: String.raw`Let \(T(x) = \frac{\cos x + 1}{4}\) for \(x \in [0, 1]\). (a) Show \(T\) maps \([0, 1]\) into itself and is a contraction (name the contraction constant). (b) Conclude \(T\) has a unique fixed point \(x^* \in [0, 1]\). (c) With \(x_0 = 0\) and \(x_{n+1} = T(x_n)\), use the error bound \(|x_n - x^*| \le \frac{q^n}{1-q}|x_1 - x_0|\) to find the smallest \(n\) guaranteeing \(|x_n - x^*| < 10^{-3}\).`,
    },
    display: [
      String.raw`|T(x) - T(y)| \le \frac{1}{4}|x - y|`,
      String.raw`|x_n - x^*| \le \frac{2}{3}\left(\frac{1}{4}\right)^n`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(\cos\)은 \([0, \pi]\)에서 감소하고 \(1 < \pi/3\)이므로 \(\cos 1 > \cos(\pi/3) = 1/2\)이다. 따라서 \(x \in [0,1]\)일 때 \(\cos x \in (\cos 1, 1] \subset (1/2, 1]\)이고 \(T(x) \in (3/8, 1/2] \subset [0, 1]\)이다. 수축성은 평균값 정리로: \(|\cos x - \cos y| \le |x - y|\) (\(|\sin| \le 1\)이므로)이어서`,
          en: String.raw`(a) \(\cos\) decreases on \([0, \pi]\) and \(1 < \pi/3\), so \(\cos 1 > \cos(\pi/3) = 1/2\). Hence for \(x \in [0,1]\), \(\cos x \in (\cos 1, 1] \subset (1/2, 1]\) and \(T(x) \in (3/8, 1/2] \subset [0, 1]\). For the contraction property, the mean value theorem gives \(|\cos x - \cos y| \le |x - y|\) (since \(|\sin| \le 1\)), so`,
        },
        display: [String.raw`|T(x) - T(y)| = \frac{|\cos x - \cos y|}{4} \le \frac{1}{4}|x - y|,`],
      },
      {
        text: {
          ko: String.raw`즉 \(q = 1/4\)인 수축사상이다. \([0, 1]\)은 완비 거리공간이므로 바나흐 고정점 정리에 의해 \(T\)는 유일한 고정점 \(x^* \in [0, 1]\)을 갖는다. 이것이 (b)이다.`,
          en: String.raw`So \(T\) is a contraction with constant \(q = 1/4\). Since \([0, 1]\) is a complete metric space, the Banach fixed point theorem gives a unique fixed point \(x^* \in [0, 1]\). This is (b).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(x_0 = 0\)이면 \(x_1 = T(0) = 1/2\)이므로 \(|x_1 - x_0| = 1/2\)이다. 오차 상한에 \(q = 1/4\)를 대입하면 \(|x_n - x^*| \le \frac{(1/4)^n}{3/4} \cdot \frac{1}{2} = \frac{2}{3}4^{-n}\)이다. \(\frac{2}{3}4^{-n} < 10^{-3}\)은 \(4^n > 2000/3 \approx 666.7\)과 동치이고, \(4^4 = 256 < 666.7 < 1024 = 4^5\)이므로 가장 작은 \(n\)은 \(5\)이다. 실제로 \(|x_5 - x^*| \le \frac{2}{3 \cdot 1024} = \frac{1}{1536} < 10^{-3}\)이다.`,
          en: String.raw`(c) With \(x_0 = 0\), \(x_1 = T(0) = 1/2\), so \(|x_1 - x_0| = 1/2\). The error bound with \(q = 1/4\) gives \(|x_n - x^*| \le \frac{(1/4)^n}{3/4} \cdot \frac{1}{2} = \frac{2}{3}4^{-n}\). Now \(\frac{2}{3}4^{-n} < 10^{-3}\) iff \(4^n > 2000/3 \approx 666.7\), and \(4^4 = 256 < 666.7 < 1024 = 4^5\), so the smallest such \(n\) is \(5\). Indeed \(|x_5 - x^*| \le \frac{2}{3 \cdot 1024} = \frac{1}{1536} < 10^{-3}\).`,
        },
      },
    ],
  },
  {
    id: 'cantor-sum-interval',
    difficulty: 2,
    topics: ['cantor'],
    statement: {
      ko: String.raw`\(C\)를 삼진법 소수 전개가 숫자 \(0\)과 \(2\)만을 사용하는 \([0, 1]\)의 점들의 집합(표준 중간삼분의 일 칸토어 집합)이라 하자. \(C + C = \{x + y : x, y \in C\}\)에 대해 \(C + C = [0, 2]\)임을 증명하라.`,
      en: String.raw`Let \(C\) be the set of points in \([0, 1]\) possessing a ternary expansion using only the digits \(0\) and \(2\) (the standard middle-thirds Cantor set). For \(C + C = \{x + y : x, y \in C\}\), prove \(C + C = [0, 2]\).`,
    },
    display: [
      String.raw`C = \left\{ \sum_{n=1}^{\infty} \frac{2a_n}{3^n} : a_n \in \{0, 1\} \right\}`,
      String.raw`C + C = [0, 2]`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`숫자를 \(2\)로 나누어 다시 쓰면 \(C = \{\sum_{n \ge 1} 2a_n 3^{-n} : a_n \in \{0,1\}\}\)이다. \(x, y \in C\)이면 \(x + y \le 2\)이므로 \(C + C \subset [0, 2]\)는 자명하다. 역포함을 보인다.`,
          en: String.raw`Dividing the digits by \(2\) rewrites the set as \(C = \{\sum_{n \ge 1} 2a_n 3^{-n} : a_n \in \{0,1\}\}\). If \(x, y \in C\) then \(x + y \le 2\), so \(C + C \subset [0, 2]\) is clear. We prove the reverse inclusion.`,
        },
      },
      {
        text: {
          ko: String.raw`\(s \in [0, 2]\)라 하자. \(s/2 \in [0, 1]\)은 삼진법 전개 \(s/2 = \sum_{n \ge 1} e_n 3^{-n}\) (\(e_n \in \{0, 1, 2\}\))를 갖는다. 각 자릿수를 쪼갠다: \(e_n = 0\)이면 \((a_n, b_n) = (0, 0)\), \(e_n = 1\)이면 \((1, 0)\), \(e_n = 2\)이면 \((1, 1)\)이라 두면 \(a_n, b_n \in \{0, 1\}\)이고 \(e_n = a_n + b_n\)이다. \(x = \sum 2a_n 3^{-n}\), \(y = \sum 2b_n 3^{-n}\)이라 두면 \(x, y \in C\)이고`,
          en: String.raw`Let \(s \in [0, 2]\). Then \(s/2 \in [0, 1]\) has a ternary expansion \(s/2 = \sum_{n \ge 1} e_n 3^{-n}\) with \(e_n \in \{0, 1, 2\}\). Split each digit: put \((a_n, b_n) = (0,0)\) if \(e_n = 0\), \((1,0)\) if \(e_n = 1\), \((1,1)\) if \(e_n = 2\); then \(a_n, b_n \in \{0, 1\}\) and \(e_n = a_n + b_n\). With \(x = \sum 2a_n 3^{-n}\) and \(y = \sum 2b_n 3^{-n}\), we have \(x, y \in C\) and`,
        },
        display: [String.raw`x + y = \sum_{n=1}^{\infty} \frac{2(a_n + b_n)}{3^n} = 2\sum_{n=1}^{\infty} \frac{e_n}{3^n} = s.`],
      },
      {
        text: {
          ko: String.raw`따라서 \(s \in C + C\)이다. \(s\)가 임의였으므로 \([0, 2] \subset C + C\)이고, 양쪽 포함으로 \(C + C = [0, 2]\)이다. 측도가 \(0\)인 "구멍투성이" 집합 두 개의 합이 구간 전체가 된다는 점이 놀랍다.`,
          en: String.raw`Hence \(s \in C + C\). Since \(s\) was arbitrary, \([0, 2] \subset C + C\), and the two inclusions give \(C + C = [0, 2]\). Remarkably, the sum of two "hole-ridden" sets of measure zero fills an entire interval.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'no-continuous-exactly-on-rationals',
    difficulty: 3,
    topics: ['baire-category'],
    statement: {
      ko: String.raw`\(f: \mathbb{R} \to \mathbb{R}\)의 연속점들의 집합을 \(C(f)\)라 하자. (a) 진동(oscillation) \(\omega_f(x) = \inf_{\delta > 0} \sup\{|f(y) - f(z)| : y, z \in (x-\delta, x+\delta)\}\)을 이용해 \(C(f) = \bigcap_{k=1}^{\infty} \{x : \omega_f(x) < 1/k\}\)이고 각 \(\{x : \omega_f(x) < 1/k\}\)가 열려 있음을 보여라. 즉 \(C(f)\)는 \(G_\delta\) 집합이다. (b) 베어 범주 정리를 이용해 \(\mathbb{Q}\)가 \(\mathbb{R}\)의 \(G_\delta\) 부분집합이 아님을 보여라. (c) 유리수에서 정확히 연속이고 무리수에서 정확히 불연속인 함수 \(f: \mathbb{R} \to \mathbb{R}\)는 존재하지 않음을 결론지어라.`,
      en: String.raw`Let \(C(f)\) be the set of points where \(f: \mathbb{R} \to \mathbb{R}\) is continuous. (a) Using the oscillation \(\omega_f(x) = \inf_{\delta > 0} \sup\{|f(y) - f(z)| : y, z \in (x-\delta, x+\delta)\}\), show \(C(f) = \bigcap_{k=1}^{\infty} \{x : \omega_f(x) < 1/k\}\) with each \(\{x : \omega_f(x) < 1/k\}\) open; i.e. \(C(f)\) is a \(G_\delta\) set. (b) Use the Baire category theorem to show \(\mathbb{Q}\) is not a \(G_\delta\) subset of \(\mathbb{R}\). (c) Conclude no function \(f: \mathbb{R} \to \mathbb{R}\) is continuous exactly at the rationals and discontinuous exactly at the irrationals.`,
    },
    display: [
      String.raw`C(f) = \bigcap_{k=1}^{\infty} \{x : \omega_f(x) < 1/k\}`,
      String.raw`\mathbb{Q} = \bigcap_{n=1}^{\infty} G_n \ \ (G_n \text{ open}) \quad \Longrightarrow \quad \bigcap_{j=1}^{\infty}\left(G_j \setminus \{q_j\}\right) = \varnothing`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(f\)가 \(x\)에서 연속일 필요충분조건은 \(\omega_f(x) = 0\)이다: 연속이면 \(\delta\)-구간 안의 진동이 \(0\)으로 가고, 역으로 진동이 \(0\)이면 \(\varepsilon\)-\(\delta\) 조건이 그대로 따라온다. 따라서 \(C(f) = \bigcap_k \{\omega_f < 1/k\}\)이다. \(\omega_f(x_0) < 1/k\)라 하자. 하한의 정의에서 어떤 \(\delta > 0\)에 대해 \(M := \sup\{|f(y) - f(z)| : y, z \in (x_0 - \delta, x_0 + \delta)\} < 1/k\)이다. \(x_1 \in (x_0 - \delta/2, x_0 + \delta/2)\)이면 \((x_1 - \delta/2, x_1 + \delta/2) \subset (x_0 - \delta, x_0 + \delta)\)이므로 \(\omega_f(x_1) \le M < 1/k\)이다. 즉 \(\{\omega_f < 1/k\}\)는 \(x_0\)의 근방을 포함하므로 열려 있다.`,
          en: String.raw`(a) \(f\) is continuous at \(x\) iff \(\omega_f(x) = 0\): continuity drives the oscillation on \(\delta\)-intervals to \(0\), and conversely vanishing oscillation is exactly the \(\varepsilon\)-\(\delta\) condition. Hence \(C(f) = \bigcap_k \{\omega_f < 1/k\}\). Let \(\omega_f(x_0) < 1/k\). By definition of the infimum, some \(\delta > 0\) gives \(M := \sup\{|f(y) - f(z)| : y, z \in (x_0 - \delta, x_0 + \delta)\} < 1/k\). If \(x_1 \in (x_0 - \delta/2, x_0 + \delta/2)\) then \((x_1 - \delta/2, x_1 + \delta/2) \subset (x_0 - \delta, x_0 + \delta)\), so \(\omega_f(x_1) \le M < 1/k\). Thus \(\{\omega_f < 1/k\}\) contains a neighborhood of \(x_0\): it is open.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \(\mathbb{Q} = \bigcap_n G_n\) (\(G_n\) 열림)이라 가정하자. 각 \(G_n \supset \mathbb{Q}\)는 조밀하므로 열린 조밀 집합이다. \(\mathbb{Q} = \{q_1, q_2, \dots\}\)라 열거하고 \(H_j = G_j \cap (\mathbb{R} \setminus \{q_j\})\)라 두자. 각 \(H_j\)는 열린 조밀 집합이다 (\(\{q_j\}\)를 제거해도 조밀성은 유지된다). 베어 정리에 의해 \(\bigcap_j H_j\)는 \(\mathbb{R}\)에 조밀하지만, \(\bigcap_j H_j \subset \mathbb{Q} \setminus \mathbb{Q} = \varnothing\)이므로 모순이다. 따라서 \(\mathbb{Q}\)는 \(G_\delta\)가 아니다.`,
          en: String.raw`(b) Suppose \(\mathbb{Q} = \bigcap_n G_n\) with \(G_n\) open. Each \(G_n \supset \mathbb{Q}\) is dense, hence open dense. Enumerate \(\mathbb{Q} = \{q_1, q_2, \dots\}\) and put \(H_j = G_j \cap (\mathbb{R} \setminus \{q_j\})\). Each \(H_j\) is open dense (removing one point preserves density). By Baire, \(\bigcap_j H_j\) is dense in \(\mathbb{R}\), but \(\bigcap_j H_j \subset \mathbb{Q} \setminus \mathbb{Q} = \varnothing\) — a contradiction. So \(\mathbb{Q}\) is not \(G_\delta\).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(C(f) = \mathbb{Q}\)인 \(f\)가 존재한다면 (a)에 의해 \(\mathbb{Q}\)가 \(G_\delta\)가 되어 (b)에 모순이다. 따라서 유리수에서 정확히 연속인 함수는 존재하지 않는다. (참고로 토매 함수는 그 반대 — 무리수에서 정확히 연속 — 를 실현하며, 무리수 집합은 \(G_\delta\)이다.)`,
          en: String.raw`(c) If some \(f\) had \(C(f) = \mathbb{Q}\), then (a) would make \(\mathbb{Q}\) a \(G_\delta\), contradicting (b). Hence no function is continuous exactly on the rationals. (For contrast, Thomae's function realizes the reverse — continuous exactly at the irrationals — and the irrationals are \(G_\delta\).)`,
        },
      },
    ],
  },
];
