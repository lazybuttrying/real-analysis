import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the limits chapter.
 * Ordered easy -> hard: difficulties 1,1,1,1, 2,2,2,2,2, 3,3,3.
 * All statements are original compositions; solutions are complete
 * bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'squeeze-sine',
    difficulty: 1,
    topics: ['epsilon-n'],
    statement: {
      ko: String.raw`\(a_n = \frac{n + \sin n}{n^2 + 1}\)이라 하자. \(\varepsilon\)-\(N\) 논법으로 직접 증명하여 \(\lim_{n \to \infty} a_n = 0\)임을 보이고, 주어진 \(\varepsilon > 0\)에 대해 사용할 수 있는 \(N(\varepsilon)\)을 명시적인 공식으로 구하라.`,
      en: String.raw`Let \(a_n = \frac{n + \sin n}{n^2 + 1}\). Prove directly from the \(\varepsilon\)-\(N\) definition that \(\lim_{n \to \infty} a_n = 0\), and give an explicit formula for a usable \(N(\varepsilon)\) in terms of \(\varepsilon > 0\).`,
    },
    display: [
      String.raw`\left|\frac{n + \sin n}{n^2 + 1}\right| \le \frac{2}{n}`,
      String.raw`N(\varepsilon) = \left\lceil \frac{2}{\varepsilon} \right\rceil`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`분자의 진동 항을 먼저 가둔다. 모든 실수 \(t\)에 대해 \(|\sin t| \le 1\)이므로 \(|n + \sin n| \le n + 1\)이다. \(n \ge 1\)일 때 \(n + 1 \le 2n\)이고 분모는 \(n^2 + 1 \ge n^2\)이므로`,
          en: String.raw`First trap the oscillating term in the numerator. Since \(|\sin t| \le 1\) for every real \(t\), \(|n + \sin n| \le n + 1\). For \(n \ge 1\) we have \(n + 1 \le 2n\) and the denominator satisfies \(n^2 + 1 \ge n^2\), so`,
        },
        display: [String.raw`|a_n - 0| = \frac{|n + \sin n|}{n^2 + 1} \le \frac{2n}{n^2} = \frac{2}{n}.`],
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(N(\varepsilon) = \lceil 2/\varepsilon \rceil\)이라 두자. \(n > N\)이면 \(n > 2/\varepsilon\), 즉 \(2/n < \varepsilon\)이다. 위 부등식과 결합하면 \(|a_n - 0| < \varepsilon\)을 얻으므로 \(\varepsilon\)-\(N\) 정의에 의해 \(a_n \to 0\)이다.`,
          en: String.raw`Given \(\varepsilon > 0\), put \(N(\varepsilon) = \lceil 2/\varepsilon \rceil\). If \(n > N\) then \(n > 2/\varepsilon\), i.e. \(2/n < \varepsilon\). Combined with the estimate above, \(|a_n - 0| < \varepsilon\), so \(a_n \to 0\) by the \(\varepsilon\)-\(N\) definition.`,
        },
      },
    ],
    viz: {
      sceneId: 'epsilon-n',
      preset: { seq: '1/n', epsilon: 0.1 },
      presetCaption: {
        ko: String.raw`\(\varepsilon = 0.1\): 꼬리가 \(\varepsilon\) 띠 안에 완전히 들어가는 순간이 바로 우리가 찾은 \(N\)이다.`,
        en: String.raw`\(\varepsilon = 0.1\): the moment the tail fits entirely inside the \(\varepsilon\)-band is exactly the \(N\) we found.`,
      },
    },
  },
  {
    id: 'rational-approx-sqrt2',
    difficulty: 1,
    topics: ['epsilon-n', 'integers-rationals'],
    statement: {
      ko: String.raw`\(n \ge 1\)에 대해 \(a_n = \frac{\lfloor n\sqrt{2} \rfloor}{n}\)이라 하자. 여기서 \(\lfloor x \rfloor\)는 \(x\) 이하의 가장 큰 정수이다. (a) 각 \(a_n\)이 유리수임을 보여라. (b) \(\varepsilon\)-\(N\) 논법으로 \(a_n \to \sqrt{2}\)임을 증명하라. (c) \(\sqrt{2}\)가 무리수임을 증명하라. 유리수 수열이 무리수 극한으로 수렴할 수 있음을 결론지어라.`,
      en: String.raw`For \(n \ge 1\) let \(a_n = \frac{\lfloor n\sqrt{2} \rfloor}{n}\), where \(\lfloor x \rfloor\) is the greatest integer \(\le x\). (a) Show each \(a_n\) is rational. (b) Prove \(a_n \to \sqrt{2}\) from the \(\varepsilon\)-\(N\) definition. (c) Prove \(\sqrt{2}\) is irrational. Conclude that a sequence of rationals can converge to an irrational limit.`,
    },
    display: [
      String.raw`0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1`,
      String.raw`\left|a_n - \sqrt{2}\right| < \frac{1}{n}`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(\lfloor n\sqrt{2} \rfloor\)는 정수이므로 \(a_n\)은 정수 나누기 \(n\) 꼴, 즉 유리수이다. (b) 내림 함수의 정의에서 \(0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1\)이다. \(n\)으로 나누면 \(|a_n - \sqrt{2}| < 1/n\)을 얻는다. \(\varepsilon > 0\)에 대해 \(N = \lceil 1/\varepsilon \rceil\)이라 두면, \(n > N\)일 때 \(|a_n - \sqrt{2}| < 1/n < \varepsilon\)이므로 \(a_n \to \sqrt{2}\)이다.`,
          en: String.raw`(a) \(\lfloor n\sqrt{2} \rfloor\) is an integer, so \(a_n\) is an integer divided by \(n\): rational. (b) From the definition of the floor function, \(0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1\). Dividing by \(n\) gives \(|a_n - \sqrt{2}| < 1/n\). For \(\varepsilon > 0\) put \(N = \lceil 1/\varepsilon \rceil\); if \(n > N\) then \(|a_n - \sqrt{2}| < 1/n < \varepsilon\), so \(a_n \to \sqrt{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(\sqrt{2} = p/q\) (서로소인 양의 정수 \(p, q\))라 가정하면 \(p^2 = 2q^2\)이다. 따라서 \(p^2\)은 짝수이고, 짝수의 제곱이 짝수이므로 \(p\)도 짝수이다: \(p = 2r\). 대입하면 \(4r^2 = 2q^2\), 즉 \(q^2 = 2r^2\)이므로 같은 논리로 \(q\)도 짝수이다. 이는 \(p, q\)가 서로소라는 가정에 모순이다. 따라서 \(\sqrt{2}\)는 무리수이다.`,
          en: String.raw`(c) Suppose \(\sqrt{2} = p/q\) with coprime positive integers \(p, q\). Then \(p^2 = 2q^2\), so \(p^2\) is even, hence \(p\) is even (an even square has an even root): \(p = 2r\). Substituting gives \(4r^2 = 2q^2\), i.e. \(q^2 = 2r^2\), so by the same argument \(q\) is even. This contradicts coprimality. Hence \(\sqrt{2}\) is irrational.`,
        },
      },
      {
        text: {
          ko: String.raw`유리수 수열 \((a_n)\)이 무리수 \(\sqrt{2}\)로 수렴하므로, 유리수들의 극한이 유리수이리라는 기대는 거짓이다. 수열의 극한은 원래 집합을 "빠져나갈" 수 있다.`,
          en: String.raw`The rational sequence \((a_n)\) converges to the irrational \(\sqrt{2}\), so the expectation that a limit of rationals stays rational is false. A sequence limit can "escape" the set its terms live in.`,
        },
      },
    ],
  },
  {
    id: 'limsup-two-subseq',
    difficulty: 1,
    topics: ['limsup-liminf'],
    statement: {
      ko: String.raw`\(a_n = (2 + (-1)^n)\left(1 - \frac{1}{n+1}\right)\)이라 하자. \(\limsup_{n \to \infty} a_n\)과 \(\liminf_{n \to \infty} a_n\)을 구하고, 부분수열 논증을 이용해 엄밀히 증명하라.`,
      en: String.raw`Let \(a_n = (2 + (-1)^n)\left(1 - \frac{1}{n+1}\right)\). Find \(\limsup_{n \to \infty} a_n\) and \(\liminf_{n \to \infty} a_n\), with a rigorous proof using subsequence arguments.`,
    },
    display: [String.raw`a_{2k} = 3\left(1 - \frac{1}{2k+1}\right), \qquad a_{2k+1} = 1 - \frac{1}{2k+2}`],
    solution: [
      {
        text: {
          ko: String.raw`짝수 항과 홀수 항을 분리한다. \(n = 2k\)일 때 \((-1)^n = 1\)이므로 \(a_{2k} = 3(1 - 1/(2k+1)) \to 3\)이다. \(n = 2k+1\)일 때 \((-1)^n = -1\)이므로 \(a_{2k+1} = 1 - 1/(2k+2) \to 1\)이다. 따라서 \(\limsup a_n \ge 3\)이고 \(\liminf a_n \le 1\)이다.`,
          en: String.raw`Separate even and odd terms. For \(n = 2k\), \((-1)^n = 1\), so \(a_{2k} = 3(1 - 1/(2k+1)) \to 3\). For \(n = 2k+1\), \((-1)^n = -1\), so \(a_{2k+1} = 1 - 1/(2k+2) \to 1\). Hence \(\limsup a_n \ge 3\) and \(\liminf a_n \le 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`반대 방향 부등식을 위해 모든 항을 가둔다. \(1 \le 2 + (-1)^n \le 3\)이고 \(0 < 1 - 1/(n+1) < 1\)이므로 모든 \(n\)에 대해 \(a_n < 3\)이다. 따라서 \(\limsup a_n \le 3\)이고, 짝수 부분수열과 합쳐 \(\limsup a_n = 3\)을 얻는다. 마찬가지로 \(a_n \ge 1 \cdot (1 - 1/(n+1))\)이고 \(1 - 1/(n+1) \to 1\)이므로 \(\liminf a_n \ge 1\)이다. 홀수 부분수열과 합쳐 \(\liminf a_n = 1\)을 얻는다.`,
          en: String.raw`For the reverse inequalities, trap every term. Since \(1 \le 2 + (-1)^n \le 3\) and \(0 < 1 - 1/(n+1) < 1\), we have \(a_n < 3\) for all \(n\). Hence \(\limsup a_n \le 3\), and with the even subsequence, \(\limsup a_n = 3\). Likewise \(a_n \ge 1 \cdot (1 - 1/(n+1))\) and \(1 - 1/(n+1) \to 1\), so \(\liminf a_n \ge 1\). With the odd subsequence, \(\liminf a_n = 1\).`,
        },
      },
    ],
  },
  {
    id: 'open-interval-image',
    difficulty: 1,
    topics: ['continuity', 'opensets'],
    statement: {
      ko: String.raw`참·거짓을 판정하고 증명하라: 열린 구간의 연속함수에 의한 상은 항상 열린 집합이다.`,
      en: String.raw`True or false, with proof: the continuous image of an open interval is always an open set.`,
    },
    display: [String.raw`f(x) = x^2, \qquad I = (-1, 1), \qquad f(I) = [0, 1)`],
    solution: [
      {
        text: {
          ko: String.raw`거짓이다. \(f(x) = x^2\) (\(x \in \mathbb{R}\))는 연속이고 \(I = (-1, 1)\)은 열린 구간이다. \(f(I) = [0, 1)\)임을 주장한다. \(0 \le y < 1\)이면 \(x = \sqrt{y} \in [0, 1) \subset I\)이고 \(f(x) = y\)이므로 \(y \in f(I)\)이다. \(y < 0\)이면 \(x^2 \ge 0\)이므로 도달 불가능하고, \(y \ge 1\)이면 \(|x| < 1\)에서 \(x^2 < 1\)이므로 도달 불가능하다.`,
          en: String.raw`False. \(f(x) = x^2\) on \(\mathbb{R}\) is continuous and \(I = (-1, 1)\) is an open interval. We claim \(f(I) = [0, 1)\). If \(0 \le y < 1\) then \(x = \sqrt{y} \in [0, 1) \subset I\) and \(f(x) = y\), so \(y \in f(I)\). If \(y < 0\) it is unreachable since \(x^2 \ge 0\); if \(y \ge 1\) it is unreachable since \(|x| < 1\) implies \(x^2 < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\([0, 1)\)은 \(\mathbb{R}\)에서 열린 집합이 아니다: \(0 \in [0, 1)\)이지만, 모든 \(\varepsilon > 0\)에 대해 \(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\)이면서 \(-\varepsilon/2 \notin [0, 1)\)이다. 따라서 열린 구간의 연속상 \([0, 1)\)은 열려 있지 않다. 연속성은 열린성을 보존하지 않는다 (닫힌성은 보존한다: 콤팩트 집합의 연속상은 콤팩트).`,
          en: String.raw`\([0, 1)\) is not open in \(\mathbb{R}\): \(0 \in [0, 1)\) but for every \(\varepsilon > 0\), \(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\) while \(-\varepsilon/2 \notin [0, 1)\). So the continuous image \([0, 1)\) of the open interval is not open. Continuity does not preserve openness (it does preserve closedness via compactness: the continuous image of a compact set is compact).`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'uniform-vanishing-bump',
    difficulty: 2,
    topics: ['uniform'],
    statement: {
      ko: String.raw`\(\mathbb{R}\) 위에서 \(f_n(x) = \frac{x}{1 + n x^2}\)이라 하자. 각 점별 극한 \(\lim_{n \to \infty} f_n(x)\)를 구하고, 수렴이 \(\mathbb{R}\) 위에서 균등함을 증명하라. \(\sup_{x \in \mathbb{R}} |f_n(x)|\)의 정확한 값을 구하라.`,
      en: String.raw`On \(\mathbb{R}\) let \(f_n(x) = \frac{x}{1 + n x^2}\). Find the pointwise limit \(\lim_{n \to \infty} f_n(x)\) at each \(x\), prove the convergence is uniform on \(\mathbb{R}\), and compute the exact value of \(\sup_{x \in \mathbb{R}} |f_n(x)|\).`,
    },
    display: [
      String.raw`f_n(x) \to 0 \quad (n \to \infty) \text{ for every } x`,
      String.raw`\sup_{\mathbb{R}} |f_n| = \frac{1}{2\sqrt{n}} \to 0`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`먼저 점별 극한을 구한다. \(x = 0\)이면 \(f_n(0) = 0\)이다. \(x \ne 0\)이면 \(1 + nx^2 \ge nx^2\)이므로 \(|f_n(x)| \le \frac{|x|}{nx^2} = \frac{1}{n|x|} \to 0\)이다. 따라서 점별 극한함수는 \(f \equiv 0\)이다.`,
          en: String.raw`First the pointwise limit. If \(x = 0\) then \(f_n(0) = 0\). If \(x \ne 0\) then \(1 + nx^2 \ge nx^2\), so \(|f_n(x)| \le \frac{|x|}{nx^2} = \frac{1}{n|x|} \to 0\). Hence the pointwise limit is \(f \equiv 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`균등수렴은 상한 노름으로 판정한다: \(f_n \to f\)가 균등할 필요충분조건은 \(\sup |f_n - f| \to 0\)이다. \(f_n\)은 기함수이므로 \(|f_n|\)의 상한은 \(x \ge 0\)에서 찾으면 된다. \(x \ge 0\)에서 미분하면 \(g_n'(x) = \frac{1 - nx^2}{(1 + nx^2)^2}\)이므로 유일한 임계점은 \(x = 1/\sqrt{n}\)이고, 그 값은 \(g_n(1/\sqrt{n}) = \frac{1/\sqrt{n}}{2} = \frac{1}{2\sqrt{n}}\)이다. 경계(\(x = 0\) 또는 \(x \to \infty\))에서는 값이 \(0\)이므로 이것이 전역 최댓값이다.`,
          en: String.raw`Uniform convergence is decided by the sup norm: \(f_n \to f\) uniformly iff \(\sup |f_n - f| \to 0\). Since \(f_n\) is odd, the supremum of \(|f_n|\) is found on \(x \ge 0\). Differentiating there, \(g_n'(x) = \frac{1 - nx^2}{(1 + nx^2)^2}\), so the unique critical point is \(x = 1/\sqrt{n}\) with value \(g_n(1/\sqrt{n}) = \frac{1/\sqrt{n}}{2} = \frac{1}{2\sqrt{n}}\). The boundary values (\(x = 0\) and \(x \to \infty\)) are \(0\), so this is the global maximum.`,
        },
      },
      {
        text: {
          ko: String.raw`기함수 대칭성에 의해 \(\sup_{x \in \mathbb{R}} |f_n(x)| = \frac{1}{2\sqrt{n}} \to 0\)이다. 따라서 \(f_n \to 0\)은 \(\mathbb{R}\) 위에서 균등수렴한다. 봉우리의 위치 \(1/\sqrt{n}\)은 \(0\)으로 이동하지만 높이가 \(1/(2\sqrt{n})\)으로 함께 꺼지므로 균등수렴이 성립한다.`,
          en: String.raw`By odd symmetry, \(\sup_{x \in \mathbb{R}} |f_n(x)| = \frac{1}{2\sqrt{n}} \to 0\). Hence \(f_n \to 0\) uniformly on \(\mathbb{R}\). The bump's location \(1/\sqrt{n}\) drifts toward \(0\), but its height \(1/(2\sqrt{n})\) collapses too, which is exactly why the convergence is uniform.`,
        },
      },
    ],
  },
  {
    id: 'liouville-dense-gdelta',
    difficulty: 2,
    topics: ['baire-category', 'countable'],
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
  {
    id: 'geometric-mean-cesaro',
    difficulty: 2,
    topics: ['stolz-cesaro', 'limsup-liminf'],
    statement: {
      ko: String.raw`\(a_n > 0\)이고 \(a_n \to L > 0\)이라 하자. 기하평균 \(G_n = (a_1 a_2 \cdots a_n)^{1/n}\)이 \(L\)로 수렴함을 증명하라. (힌트: 로그를 취하면 체사로 평균이 된다.)`,
      en: String.raw`Let \(a_n > 0\) with \(a_n \to L > 0\). Prove the geometric mean \(G_n = (a_1 a_2 \cdots a_n)^{1/n}\) converges to \(L\). (Hint: taking logarithms turns this into a Cesaro mean.)`,
    },
    display: [
      String.raw`\log G_n = \frac{\log a_1 + \cdots + \log a_n}{n}`,
      String.raw`G_n = \exp\left(\frac{1}{n}\sum_{k=1}^{n} \log a_k\right) \to \exp(\log L) = L`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`\(b_n = \log a_n\)이라 두자. \(L > 0\)에서 로그함수가 연속이므로 \(b_n \to \log L\)이다. 체사로 정리(수열이 수렴하면 산술평균도 같은 극한으로 수렴한다)에 의해`,
          en: String.raw`Put \(b_n = \log a_n\). Since \(\log\) is continuous at \(L > 0\), \(b_n \to \log L\). By Cesaro's theorem (if a sequence converges, so do its arithmetic means, to the same limit),`,
        },
        display: [String.raw`\frac{b_1 + \cdots + b_n}{n} \longrightarrow \log L \qquad (n \to \infty).`],
      },
      {
        text: {
          ko: String.raw`한편 \(\log G_n = \frac{1}{n}\sum_{k=1}^n \log a_k\)이므로, 지수함수의 연속성에 의해 \(G_n = \exp(\log G_n) \to \exp(\log L) = L\)이다. 조건 \(L > 0\)은 로그를 취하기 위해 필수적이다.`,
          en: String.raw`But \(\log G_n = \frac{1}{n}\sum_{k=1}^n \log a_k\), so by continuity of the exponential, \(G_n = \exp(\log G_n) \to \exp(\log L) = L\). The hypothesis \(L > 0\) is essential for taking logarithms.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'moments-zero',
    difficulty: 3,
    topics: ['weierstrass-approx', 'uniform'],
    statement: {
      ko: String.raw`\(f\)가 \([0, 1]\)에서 연속이고 모든 정수 \(n \ge 0\)에 대해 \(\int_0^1 x^n f(x)\,dx = 0\)이라 하자. 바이어슈트라스 근사정리를 이용해 \(f \equiv 0\)임을 증명하라.`,
      en: String.raw`Let \(f\) be continuous on \([0, 1]\) and suppose \(\int_0^1 x^n f(x)\,dx = 0\) for every integer \(n \ge 0\). Use the Weierstrass approximation theorem to prove \(f \equiv 0\).`,
    },
    display: [
      String.raw`\int_0^1 x^n f(x)\,dx = 0 \quad \forall n \ge 0 \quad \Longrightarrow \quad f \equiv 0`,
      String.raw`\int_0^1 f(x)^2\,dx = \lim_{k \to \infty} \int_0^1 p_k(x) f(x)\,dx = 0`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`먼저 가정을 다항식 전체로 확장한다. \(p(x) = \sum_{j=0}^m c_j x^j\)이면 적분의 선형성에 의해 \(\int_0^1 p(x) f(x)\,dx = \sum_{j=0}^m c_j \int_0^1 x^j f(x)\,dx = 0\)이다. 즉 모든 다항식 \(p\)에 대해 \(\int_0^1 pf = 0\)이다.`,
          en: String.raw`First extend the hypothesis to all polynomials. If \(p(x) = \sum_{j=0}^m c_j x^j\), linearity of the integral gives \(\int_0^1 p(x) f(x)\,dx = \sum_{j=0}^m c_j \int_0^1 x^j f(x)\,dx = 0\). So \(\int_0^1 pf = 0\) for every polynomial \(p\).`,
        },
      },
      {
        text: {
          ko: String.raw`바이어슈트라스 근사정리에 의해 다항식 수열 \((p_k)\)가 \(f\)에 \([0, 1]\)에서 균등수렴한다: \(\|p_k - f\|_\infty \to 0\). \(M = \max_{[0,1]} |f|\) (콤팩트 구간 위의 연속함수는 최댓값을 갖는다)이라 두면`,
          en: String.raw`By the Weierstrass approximation theorem, there are polynomials \((p_k)\) with \(p_k \to f\) uniformly on \([0, 1]\): \(\|p_k - f\|_\infty \to 0\). Put \(M = \max_{[0,1]} |f|\) (a continuous function on a compact interval attains its maximum). Then`,
        },
        display: [
          String.raw`\left|\int_0^1 p_k f - \int_0^1 f^2\right| = \left|\int_0^1 (p_k - f) f\right| \le \|p_k - f\|_\infty \cdot M \longrightarrow 0.`,
        ],
      },
      {
        text: {
          ko: String.raw`그런데 각 \(\int_0^1 p_k f = 0\)이므로 극한을 취하면 \(\int_0^1 f(x)^2\,dx = 0\)을 얻는다. \(f^2\)는 연속이고 \(0\) 이상이므로 \(f^2 \equiv 0\)이다: \(f(c)^2 = \eta > 0\)인 점 \(c\)가 있다면 연속성에 의해 어떤 구간에서 \(f^2 \ge \eta/2\)가 되어 적분이 양수가 되기 때문이다. 따라서 \(f \equiv 0\)이다.`,
          en: String.raw`Since each \(\int_0^1 p_k f = 0\), passing to the limit gives \(\int_0^1 f(x)^2\,dx = 0\). As \(f^2\) is continuous and nonnegative, \(f^2 \equiv 0\): if \(f(c)^2 = \eta > 0\) at some \(c\), continuity would force \(f^2 \ge \eta/2\) on an interval, making the integral positive. Hence \(f \equiv 0\).`,
        },
      },
    ],
  },
  {
    id: 'no-continuous-exactly-on-rationals',
    difficulty: 3,
    topics: ['baire-category', 'continuity'],
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
  {
    id: 'ratio-root-sandwich',
    difficulty: 3,
    topics: ['limsup-liminf', 'stolz-cesaro'],
    statement: {
      ko: String.raw`\(a_n > 0\)인 수열에 대해 다음 부등식을 증명하라: \(\liminf_{n \to \infty} \frac{a_{n+1}}{a_n} \le \liminf_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} \frac{a_{n+1}}{a_n}\). 추가로, \(\frac{a_{n+1}}{a_n} \to L > 0\)이면 로그를 취해 스톨츠-체사로 정리로 \(a_n^{1/n} \to L\)임을 보여라.`,
      en: String.raw`For a sequence with \(a_n > 0\), prove \(\liminf_{n \to \infty} \frac{a_{n+1}}{a_n} \le \liminf_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} \frac{a_{n+1}}{a_n}\). Additionally, if \(\frac{a_{n+1}}{a_n} \to L > 0\), take logarithms and use the Stolz-Cesaro theorem to show \(a_n^{1/n} \to L\).`,
    },
    display: [
      String.raw`\liminf \frac{a_{n+1}}{a_n} \le \liminf a_n^{1/n} \le \limsup a_n^{1/n} \le \limsup \frac{a_{n+1}}{a_n}`,
      String.raw`\frac{a_{n+1}}{a_n} \to L > 0 \quad \Longrightarrow \quad a_n^{1/n} \to L`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`가운데 부등식 \(\liminf \le \limsup\)은 자명하다. 마지막 부등식을 증명한다. \(R = \limsup a_{n+1}/a_n\)이라 하자. \(R = \infty\)이면 자명하므로 \(R < \infty\)이라 하자. \(R < \beta < \infty\)인 \(\beta\)를 잡으면, 정의에 의해 \(n \ge N\)일 때 \(a_{n+1}/a_n < \beta\)이다. 따라서 \(k \ge 1\)에 대해 \(a_{N+k} < a_N \beta^k\)이고, \(N+k\) 제곱근을 취하면`,
          en: String.raw`The middle inequality \(\liminf \le \limsup\) is trivial. We prove the last one. Let \(R = \limsup a_{n+1}/a_n\); if \(R = \infty\) there is nothing to prove, so assume \(R < \infty\). Take \(\beta\) with \(R < \beta < \infty\). By definition, \(a_{n+1}/a_n < \beta\) for \(n \ge N\). Hence \(a_{N+k} < a_N \beta^k\) for \(k \ge 1\), and taking \((N+k)\)-th roots,`,
        },
        display: [String.raw`a_{N+k}^{1/(N+k)} < a_N^{1/(N+k)} \cdot \beta^{k/(N+k)} \longrightarrow 1 \cdot \beta = \beta.`],
      },
      {
        text: {
          ko: String.raw`(\(a_N\)은 고정되어 있고 지수가 \(0\)으로 가므로 \(a_N^{1/(N+k)} \to 1\)이다.) 따라서 \(\limsup a_n^{1/n} \le \beta\)이고, \(\beta \downarrow R\)로 보내면 \(\limsup a_n^{1/n} \le R\)을 얻는다. 첫 번째 부등식은 대칭적이다: \(r = \liminf a_{n+1}/a_n\)이라 하자. \(r = 0\)이면 자명하므로 \(r > 0\)이라 하자. \(0 < \alpha < r\)을 잡으면 \(n \ge N\)일 때 \(a_{n+1}/a_n > \alpha\)이고, \(a_{N+k} > a_N \alpha^k\)에서 \(a_{N+k}^{1/(N+k)} > a_N^{1/(N+k)} \alpha^{k/(N+k)} \to \alpha\)를 얻는다. 따라서 \(\liminf a_n^{1/n} \ge \alpha\)이고, \(\alpha \uparrow r\)로 보내면 \(\liminf a_n^{1/n} \ge r\)이다.`,
          en: String.raw`(\(a_N\) is fixed and the exponent tends to \(0\), so \(a_N^{1/(N+k)} \to 1\).) Hence \(\limsup a_n^{1/n} \le \beta\); letting \(\beta \downarrow R\) gives \(\limsup a_n^{1/n} \le R\). The first inequality is symmetric: let \(r = \liminf a_{n+1}/a_n\). If \(r = 0\) there is nothing to prove; assume \(r > 0\). Take \(0 < \alpha < r\); then \(a_{n+1}/a_n > \alpha\) for \(n \ge N\), and from \(a_{N+k} > a_N \alpha^k\) we get \(a_{N+k}^{1/(N+k)} > a_N^{1/(N+k)} \alpha^{k/(N+k)} \to \alpha\). So \(\liminf a_n^{1/n} \ge \alpha\), and \(\alpha \uparrow r\) gives \(\liminf a_n^{1/n} \ge r\).`,
        },
      },
      {
        text: {
          ko: String.raw`마지막으로 극한 형태: \(\frac{a_{n+1}}{a_n} \to L > 0\)이면 \(\log a_{n+1} - \log a_n = \log\frac{a_{n+1}}{a_n} \to \log L\)이다. 분자 \(\log a_n\), 분모 \(n\)에 스톨츠-체사로 정리를 적용하면 \(\frac{\log a_n}{n} \to \log L\)이고, 지수화하면 \(a_n^{1/n} = \exp(\frac{\log a_n}{n}) \to \exp(\log L) = L\)이다. 비율 판정법이 근 판정법을 함의하는 이유가 바로 이것이다.`,
          en: String.raw`Finally the limit form: if \(\frac{a_{n+1}}{a_n} \to L > 0\) then \(\log a_{n+1} - \log a_n = \log\frac{a_{n+1}}{a_n} \to \log L\). Applying Stolz-Cesaro to numerator \(\log a_n\) and denominator \(n\) gives \(\frac{\log a_n}{n} \to \log L\), and exponentiating, \(a_n^{1/n} = \exp(\frac{\log a_n}{n}) \to \exp(\log L) = L\). This is why the ratio test implies the root test.`,
        },
      },
    ],
  },
];
