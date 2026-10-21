import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'convergence',
    statement: {
      ko: String.raw`\(p, q > 0\)일 때 이상적분 \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\)가 수렴함을 증명하세요.`,
      en: String.raw`Prove that the improper integral \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) converges for \(p, q > 0\).`,
    },
    display: [
      String.raw`\int_0^{1/2} t^{p-1}(1-t)^{q-1}\,dt \asymp \int_0^{1/2} t^{p-1}\,dt < \infty \iff p > 0`,
    ],
    preset: { p: 0.5, q: 2 },
    presetCaption: {
      ko: String.raw`\(p = 0.5\) — \(t = 0\)에서 발산하지만 적분은 수렴.`,
      en: String.raw`\(p = 0.5\) — blows up at \(t = 0\), yet the integral converges.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`적분을 \(t = 1/2\)에서 나눕니다. \((0, 1/2]\)에서는 \(\frac12 \leq 1-t < 1\)이므로 \((1-t)^{q-1}\)은 양의 상수 \(c_1 = \min(1, 2^{1-q})\)와 \(c_2 = \max(1, 2^{1-q})\) 사이에 갇힙니다. 따라서 \(c_1 t^{p-1} \leq t^{p-1}(1-t)^{q-1} \leq c_2 t^{p-1}\)이고, 비교판정법으로 \(\int_0^{1/2} t^{p-1}(1-t)^{q-1}\,dt\)의 수렴성은 \(\int_0^{1/2} t^{p-1}\,dt\)의 수렴성과 같습니다.`,
          en: String.raw`Split the integral at \(t = 1/2\). On \((0, 1/2]\) we have \(\frac12 \leq 1-t < 1\), so \((1-t)^{q-1}\) is trapped between the positive constants \(c_1 = \min(1, 2^{1-q})\) and \(c_2 = \max(1, 2^{1-q})\). Hence \(c_1 t^{p-1} \leq t^{p-1}(1-t)^{q-1} \leq c_2 t^{p-1}\), and the comparison test reduces the convergence of \(\int_0^{1/2} t^{p-1}(1-t)^{q-1}\,dt\) to that of \(\int_0^{1/2} t^{p-1}\,dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int_\delta^{1/2} t^{p-1}\,dt = \frac{(1/2)^p - \delta^p}{p}\) (\(p \neq 0\))이며, \(\delta \to 0^+\)일 때 이는 \(p > 0\)이면 \(\frac{2^{-p}}{p}\)로 수렴합니다. \(p = 0\)이면 \(-\ln(2\delta) \to \infty\)로, \(p < 0\)이면 \(\frac{\delta^p}{|p|} \to \infty\)로 발산합니다. 따라서 \(\int_0^{1/2} t^{p-1}\,dt\)는 \(p > 0\)일 때 정확히 수렴합니다.`,
          en: String.raw`\(\int_\delta^{1/2} t^{p-1}\,dt = \frac{(1/2)^p - \delta^p}{p}\) for \(p \neq 0\), which converges to \(\frac{2^{-p}}{p}\) as \(\delta \to 0^+\) when \(p > 0\). For \(p = 0\) it is \(-\ln(2\delta) \to \infty\), and for \(p < 0\) it is \(\frac{\delta^p}{|p|} \to \infty\). So \(\int_0^{1/2} t^{p-1}\,dt\) converges exactly when \(p > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(t = 1\) 근처는 대칭적입니다. \(s = 1-t\)로 치환하면 \(\int_{1/2}^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt = \int_{\varepsilon}^{1/2} (1-s)^{p-1} s^{q-1}\,ds\)가 되므로 (유한 구간 위의 \(C^1\) 치환이라 정당합니다), 앞의 논증에서 \(p\)와 \(q\)의 역할이 바뀌어 \(\int_{1/2}^1 t^{p-1}(1-t)^{q-1}\,dt\)는 \(q > 0\)일 때 정확히 수렴합니다.`,
          en: String.raw`The end \(t = 1\) is symmetric. With \(s = 1-t\), \(\int_{1/2}^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt = \int_{\varepsilon}^{1/2} (1-s)^{p-1} s^{q-1}\,ds\) (a legitimate \(C^1\) substitution on a compact interval), so the same argument with \(p\) and \(q\) swapped shows \(\int_{1/2}^1 t^{p-1}(1-t)^{q-1}\,dt\) converges exactly when \(q > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`중간 구간 \([\delta, 1-\delta]\)에서는 피적분함수가 연속이므로 적분이 항상 유한합니다. 따라서 이상적분 \(B(p,q)\)는 \(p > 0\)이고 \(q > 0\)일 때 정확히 수렴합니다 — 피적분함수가 양수이므로 양쪽 끝의 발산이 서로 상쇄될 일은 없습니다.`,
          en: String.raw`On the middle piece \([\delta, 1-\delta]\) the integrand is continuous, so the integral is always finite. Hence the improper integral \(B(p,q)\) converges exactly when \(p > 0\) and \(q > 0\) — the divergences at the two ends cannot cancel, since the integrand is positive.`,
        },
      },
    ],
  },
  {
    id: 'symmetry',
    statement: {
      ko: String.raw`\(B(p,q) = B(q,p)\)를 \(u = 1-t\) 치환으로 증명하세요.`,
      en: String.raw`Prove \(B(p,q) = B(q,p)\) with the substitution \(u = 1-t\).`,
    },
    display: [
      String.raw`B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt = \int_0^1 u^{q-1}(1-u)^{p-1}\,du = B(q,p)`,
    ],
    preset: { p: 2, q: 3 },
    presetCaption: {
      ko: String.raw`\(p = 2, q = 3\) — \(B(2,3) = B(3,2) = 1/12\).`,
      en: String.raw`\(p = 2, q = 3\) — \(B(2,3) = B(3,2) = 1/12\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`문제 1에서 \(p, q > 0\)일 때 이상적분이 수렴함을 알았으므로, 절단 적분 \(\int_\delta^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt\)에 \(u = 1-t\) (\(du = -dt\))를 대입할 수 있습니다 (유한 구간 위의 \(C^1\) 치환입니다).`,
          en: String.raw`Problem 1 gives convergence for \(p, q > 0\), so we may substitute \(u = 1-t\) (\(du = -dt\)) in the truncated integral \(\int_\delta^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt\) (a \(C^1\) substitution on a compact interval).`,
        },
      },
      {
        text: {
          ko: String.raw`적분 구간이 뒤집힙니다: \(t = \delta\)에서 \(u = 1-\delta\)이고 \(t = 1-\varepsilon\)에서 \(u = \varepsilon\)이므로 \(\int_\delta^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt = \int_{1-\delta}^{\varepsilon} (1-u)^{p-1}u^{q-1}(-du) = \int_{\varepsilon}^{1-\delta} u^{q-1}(1-u)^{p-1}\,du\)입니다.`,
          en: String.raw`The interval flips: \(t = \delta\) gives \(u = 1-\delta\) and \(t = 1-\varepsilon\) gives \(u = \varepsilon\), so \(\int_\delta^{1-\varepsilon} t^{p-1}(1-t)^{q-1}\,dt = \int_{1-\delta}^{\varepsilon} (1-u)^{p-1}u^{q-1}(-du) = \int_{\varepsilon}^{1-\delta} u^{q-1}(1-u)^{p-1}\,du\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\delta, \varepsilon \to 0^+\)으로 보내면 문제 1의 수렴에 의해 양쪽은 각각 \(B(p,q)\)와 \(B(q,p)\)로 수렴하므로 \(B(p,q) = B(q,p)\)입니다. 즉 곡선 \(t^{p-1}(1-t)^{q-1}\)을 좌우로 뒤집어도 그 아래 넓이는 같습니다.`,
          en: String.raw`Sending \(\delta, \varepsilon \to 0^+\), convergence from problem 1 turns the two sides into \(B(p,q)\) and \(B(q,p)\), so \(B(p,q) = B(q,p)\). Flipping the curve \(t^{p-1}(1-t)^{q-1}\) left-right leaves the area underneath unchanged.`,
        },
      },
    ],
  },
  {
    id: 'recurrence',
    statement: {
      ko: String.raw`부분적분으로 \(B(p+1,q) = \frac{p}{q}B(p,q+1)\)을 보이고, 이를 이용해 \(B(p+1,q) = \frac{p}{p+q}B(p,q)\)를 증명하세요.`,
      en: String.raw`Show \(B(p+1,q) = \frac{p}{q}B(p,q+1)\) by parts, then deduce \(B(p+1,q) = \frac{p}{p+q}B(p,q)\).`,
    },
    display: [String.raw`B(p+1,q) = \frac{p}{p+q}\,B(p,q)`],
    preset: { p: 1, q: 3 },
    presetCaption: {
      ko: String.raw`\(p = 1, q = 3\) — \(B(2,3) = \frac14 B(1,3) = \frac{1}{12}\).`,
      en: String.raw`\(p = 1, q = 3\) — \(B(2,3) = \frac14 B(1,3) = \frac{1}{12}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`이상적분에 직접 부분적분을 적용하지 않습니다. 절단 구간 \([\delta, 1-\varepsilon]\) (\(0 < \delta < 1-\varepsilon < 1\))에서는 피적분함수가 매끄러우므로, \(B(p+1,q) = \int_0^1 t^p(1-t)^{q-1}\,dt\)의 절단 적분에 \(u = t^p\), \(dv = (1-t)^{q-1}\,dt\)로 부분적분을 적용합니다. 그러면 \(du = p t^{p-1}\,dt\)이고 \(v = -\frac{(1-t)^q}{q}\)입니다. \(0 < p < 1\) 또는 \(0 < q < 1\)이면 도함수가 끝점에서 특이해지므로 이 절단이 필요합니다.`,
          en: String.raw`Do not apply parts directly to the improper integral. On the truncated interval \([\delta, 1-\varepsilon]\) (\(0 < \delta < 1-\varepsilon < 1\)) the integrand is smooth, so apply parts to the truncated integral of \(B(p+1,q) = \int_0^1 t^p(1-t)^{q-1}\,dt\) with \(u = t^p\), \(dv = (1-t)^{q-1}\,dt\). Then \(du = p t^{p-1}\,dt\) and \(v = -\frac{(1-t)^q}{q}\). The truncation is needed because for \(0 < p < 1\) or \(0 < q < 1\) the derivative is singular at the endpoints.`,
        },
      },
      {
        text: {
          ko: String.raw`절단 구간에서의 경계항은 \(\left[-\frac{t^p(1-t)^q}{q}\right]_{\delta}^{1-\varepsilon} = -\frac{(1-\varepsilon)^p \varepsilon^q}{q} + \frac{\delta^p (1-\delta)^q}{q}\)입니다. \(p, q > 0\)이므로 \(t^p (1-t)^q \to 0\)이 양쪽 끝 모두에서 성립합니다: \(\delta \to 0^+\)이면 \(\delta^p \to 0\)이고, \(\varepsilon \to 0^+\)이면 \(\varepsilon^q \to 0\)이므로 경계항은 \(0\)으로 갑니다. \(\delta, \varepsilon \to 0^+\)으로 보내고 문제 1의 수렴을 이용하면 \(B(p+1,q) = \frac{p}{q}\int_0^1 t^{p-1}(1-t)^q\,dt = \frac{p}{q}B(p,q+1)\)을 얻습니다.`,
          en: String.raw`On the truncated interval the boundary term is \(\left[-\frac{t^p(1-t)^q}{q}\right]_{\delta}^{1-\varepsilon} = -\frac{(1-\varepsilon)^p \varepsilon^q}{q} + \frac{\delta^p (1-\delta)^q}{q}\). Since \(p, q > 0\), \(t^p (1-t)^q \to 0\) at both ends: \(\delta^p \to 0\) as \(\delta \to 0^+\) and \(\varepsilon^q \to 0\) as \(\varepsilon \to 0^+\), so the boundary term tends to \(0\). Sending \(\delta, \varepsilon \to 0^+\) and using convergence from problem 1 gives \(B(p+1,q) = \frac{p}{q}\int_0^1 t^{p-1}(1-t)^q\,dt = \frac{p}{q}B(p,q+1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`한편 \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\)의 피적분함수에 \(1 = t + (1-t)\)를 곱하면 \(\int_0^1 t^p(1-t)^{q-1}\,dt + \int_0^1 t^{p-1}(1-t)^q\,dt\), 즉 \(B(p+1,q) + B(p,q+1)\)이 됩니다.`,
          en: String.raw`Meanwhile, multiplying the integrand of \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) by \(1 = t + (1-t)\) gives \(\int_0^1 t^p(1-t)^{q-1}\,dt + \int_0^1 t^{p-1}(1-t)^q\,dt\), that is, \(B(p+1,q) + B(p,q+1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 번째 단계에서 \(B(p,q+1) = \frac{q}{p}B(p+1,q)\)이므로 이를 대입하면 \(B(p,q) = B(p+1,q) + \frac{q}{p}B(p+1,q) = \frac{p+q}{p}B(p+1,q)\)입니다. 정리하면 \(B(p+1,q) = \frac{p}{p+q}B(p,q)\)를 얻습니다.`,
          en: String.raw`From the second step, \(B(p,q+1) = \frac{q}{p}B(p+1,q)\); substituting gives \(B(p,q) = B(p+1,q) + \frac{q}{p}B(p+1,q) = \frac{p+q}{p}B(p+1,q)\). Rearranging yields \(B(p+1,q) = \frac{p}{p+q}B(p,q)\).`,
        },
      },
      {
        text: {
          ko: String.raw`참고 (증명이 아닌 아이디어 수준의 스케치): 감마함수와의 관계 \(B(p,q) = \frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}\)는 다음과 같은 표준 스케치로 얻어집니다 — \(\Gamma(p)\Gamma(q)\)를 \((0,\infty)^2\) 위의 이중적분으로 쓰고 극좌표 치환 \(t = r^2\sin^2\theta\), \(s = r^2\cos^2\theta\)를 하면 반경 방향 적분이 \(\Gamma(p+q)\)로, 각도 방향 적분이 \(B(p,q)\)로 분리됩니다. 무한 영역에서의 Fubini 정리 정당화까지 포함한 완전한 증명은 이 장면의 범위를 넘어서므로, 여기서는 감마함수와의 다리로서의 관계식으로만 받아들입니다.`,
          en: String.raw`A note (an idea-level sketch, not a proof): the bridge to the gamma function, \(B(p,q) = \frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}\), follows the standard sketch — write \(\Gamma(p)\Gamma(q)\) as a double integral over \((0,\infty)^2\); the polar substitution \(t = r^2\sin^2\theta\), \(s = r^2\cos^2\theta\) then separates the radial part into \(\Gamma(p+q)\) and the angular part into \(B(p,q)\). The full justification, including Fubini's theorem on the unbounded domain, goes beyond this scene, so we take the relation as the bridge, not as a proved theorem here.`,
        },
      },
    ],
  },
];
