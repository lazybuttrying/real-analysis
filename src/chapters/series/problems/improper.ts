import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'p2-integral',
          statement: {
            ko: String.raw`\(\int_1^\infty \frac{dx}{x^2} = 1\)을 직접 계산하세요.`,
            en: String.raw`Compute \(\int_1^\infty \frac{dx}{x^2} = 1\) directly.`,
          },
          display: [String.raw`\int_1^R \frac{dx}{x^2} = 1 - \frac{1}{R} \to 1`],
          preset: { kind: 'tail', p: 2, R: 20, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=2, R=20\): 넓이 \(0.95\)가 \(1\)을 향해 다가갑니다.`,
            en: String.raw`\(p=2, R=20\): area \(0.95\) approaches \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\int_1^R x^{-2}\,dx = \left[-x^{-1}\right]_1^R = 1 - \frac{1}{R}\)입니다.`,
                en: String.raw`\(\int_1^R x^{-2}\,dx = \left[-x^{-1}\right]_1^R = 1 - \frac{1}{R}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(R \to \infty\)이면 \(\frac{1}{R} \to 0\)이므로 넓이는 \(1\)로 수렴합니다. \(R = 20\)에서 \(1 - \frac{1}{20} = 0.95\) — 캡션의 수치와 일치합니다.`,
                en: String.raw`As \(R \to \infty\), \(\frac{1}{R} \to 0\), so the area tends to \(1\). At \(R = 20\): \(1 - \frac{1}{20} = 0.95\) — matching the caption's figure.`,
              },
            },
          ],
        },
        {
          id: 'p-le-one-diverges',
          statement: {
            ko: String.raw`\(p \leq 1\)일 때 \(\int_1^\infty \frac{dx}{x^p}\)가 발산함을 증명하세요.`,
            en: String.raw`Prove \(\int_1^\infty \frac{dx}{x^p}\) diverges for \(p \leq 1\).`,
          },
          display: [String.raw`\int_1^R \frac{dx}{x} = \ln R \to \infty`],
          preset: { kind: 'tail', p: 1, R: 50, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=1\): 넓이가 \(\ln R\)처럼 끝없이 자랍니다.`,
            en: String.raw`\(p=1\): the area grows like \(\ln R\) without bound.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(p = 1\): \(\int_1^R \frac{dx}{x} = \ln R \to \infty\) (\(R \to \infty\)). \(R = 50\)에서 넓이는 \(\ln 50 \approx 3.912\)입니다.`,
                en: String.raw`\(p = 1\): \(\int_1^R \frac{dx}{x} = \ln R \to \infty\) as \(R \to \infty\). At \(R = 50\) the area is \(\ln 50 \approx 3.912\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(p < 1\): \(\int_1^R x^{-p}\,dx = \frac{R^{1-p}-1}{1-p}\)이고 \(1 - p > 0\)이므로 \(R \to \infty\)일 때 \(\infty\)로 발산합니다.`,
                en: String.raw`\(p < 1\): \(\int_1^R x^{-p}\,dx = \frac{R^{1-p}-1}{1-p}\), and since \(1 - p > 0\) this diverges to \(\infty\) as \(R \to \infty\).`,
              },
            },
          ],
        },
        {
          id: 'singular-half',
          statement: {
            ko: String.raw`\(\int_0^1 \frac{dx}{\sqrt{x}} = 2\)를 특이점에서의 극한으로 계산하세요.`,
            en: String.raw`Compute \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\) as a limit at the singularity.`,
          },
          display: [String.raw`\int_\varepsilon^1 x^{-1/2}\,dx = 2 - 2\sqrt{\varepsilon} \to 2`],
          preset: { kind: 'singular', p: 0.5, R: 10, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=1/2, \varepsilon=0.01\): 넓이 \(1.8\)이 \(2\)로 다가갑니다.`,
            en: String.raw`\(p=1/2, \varepsilon=0.01\): area \(1.8\) approaches \(2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\int_\varepsilon^1 x^{-1/2}\,dx = \left[2\sqrt{x}\right]_\varepsilon^1 = 2 - 2\sqrt{\varepsilon}\)입니다.`,
                en: String.raw`\(\int_\varepsilon^1 x^{-1/2}\,dx = \left[2\sqrt{x}\right]_\varepsilon^1 = 2 - 2\sqrt{\varepsilon}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon \to 0^+\)이면 \(\sqrt{\varepsilon} \to 0\)이므로 넓이는 \(2\)로 수렴합니다. \(\varepsilon = 0.01\)에서 \(2 - 2\sqrt{0.01} = 2 - 0.2 = 1.8\) — 캡션의 수치와 일치합니다.`,
                en: String.raw`As \(\varepsilon \to 0^+\), \(\sqrt{\varepsilon} \to 0\), so the area tends to \(2\). At \(\varepsilon = 0.01\): \(2 - 2\sqrt{0.01} = 2 - 0.2 = 1.8\) — matching the caption's figure.`,
              },
            },
          ],
        },
      ];
