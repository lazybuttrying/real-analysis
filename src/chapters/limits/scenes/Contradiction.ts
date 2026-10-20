import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { contradictionModel, type EuclidData } from '../models/contradiction';

/**
 * Euclid's proof that the primes are infinite, by contradiction: assume the
 * first k primes were ALL the primes. Chips show the assumed-complete list,
 * P = p_1*...*p_k, N = P + 1, and N's factorization — every factor a new
 * prime off the list. Sliding k walks through Euclid's argument; k = 6 shows
 * the classic subtlety that N itself need not be prime (30031 = 59 * 509).
 */

const MARGIN = { top: 36, right: 20, bottom: 20, left: 20 };

const SUBSCRIPTS = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈'];

function readoutText(data: EuclidData, lang: Lang): string {
  const productExpr = data.primes.join(' \\cdot ');
  const factorExpr = data.factors.join(' \\times ');
  return localize(
    {
      ko: String.raw`가정: 소수는 \(p_1, \ldots, p_k\)뿐이다 (전부 \(k = ${data.k}\)개: ${data.primes.join(', ')}).
\(P = ${productExpr} = ${fmt(data.product, 0)}\), \(N = P + 1 = ${fmt(data.n, 0)}\).
\(N = ${factorExpr}\) — 소인수 ${data.factors.join(', ')}은(는) 모두 목록에 없는 새 소수다.`,
      en: String.raw`Assumption: the primes \(p_1, \ldots, p_k\) are all there are (\(k = ${data.k}\) of them: ${data.primes.join(', ')}).
\(P = ${productExpr} = ${fmt(data.product, 0)}\), \(N = P + 1 = ${fmt(data.n, 0)}\).
\(N = ${factorExpr}\) — the prime factors ${data.factors.join(', ')} are all new primes, off the list.`,
    },
    lang,
  );
}

function explainText(data: EuclidData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`\(P\)는 목록의 모든 소수의 배수이므로, \(N = P + 1\)을 어떤 \(p_i\)로 나누어도 나머지는 1이다 — 즉 \(N\)은 목록의 어떤 소수로도 나누어떨어지지 않는다. 칩 아래의 "나머지 1"이 바로 그 뜻이다.
그런데 \(N \ge 2\)이므로 \(N\)은 소인수를 가진다 (2 이상의 모든 정수는 소인수를 가진다). 그 소인수는 \(N\)을 나누지만 \(P\)를 나누지 않으므로 (\(N - P = 1\)), 목록의 어느 소수와도 다르다 — "소수가 \(k\)개뿐"이라는 가정과 모순이다. 따라서 소수는 무한히 많다.`,
      en: String.raw`\(P\) is a multiple of every prime on the list, so dividing \(N = P + 1\) by any \(p_i\) leaves remainder 1 — \(N\) is divisible by no prime on the list ("remainder 1" under each chip). But \(N \ge 2\), so \(N\) has a prime factor (every integer \(\ge 2\) does). That factor divides \(N\) but not \(P\) (since \(N - P = 1\)), so it differs from every prime on the list — contradicting the assumption that the \(k\) primes were all. Hence there are infinitely many primes.`,
    },
    lang,
  );
  const subtlety =
    data.k === 6
      ? localize(
          {
            ko: String.raw` 지금 \(k = 6\): \(N = 30031 = 59 \times 509\)는 합성수다 — 유클리드의 \(N\)은 소수일 필요가 없다. 중요한 것은 \(N\)의 소인수들이 모두 목록 밖의 새 소수라는 점이다.`,
            en: String.raw` Right now \(k = 6\): \(N = 30031 = 59 \times 509\) is composite — Euclid's \(N\) need not be prime. What matters is that all of \(N\)'s prime factors are new primes off the list.`,
          },
          lang,
        )
      : localize(
          {
            ko: String.raw` \(N\) 자체가 소수인지 합성수인지는 중요하지 않다 (슬라이더를 \(k = 6\)으로 옮겨 보세요) — 중요한 것은 \(N\)의 소인수가 모두 목록 밖의 새 소수라는 점이다.`,
            en: String.raw` Whether \(N\) itself is prime or composite is irrelevant (try the slider at \(k = 6\)) — what matters is that every prime factor of \(N\) is a new prime off the list.`,
          },
          lang,
        );
  return body + subtlety;
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`귀류법의 모양: \(\lnot P\)를 가정하고, 거기서 모순 \(\bot\)을 이끌어낸 뒤 \(P\)를 결론짓는다. 유클리드는 "\(P\): 소수는 무한히 많다"의 부정인 "소수는 유한하다"를 가정해 모순을 도출했다.
주의: 귀류법은 존재를 증명하면서도 그 대상을 직접 보여주지 않을 때가 많다 — 위 증명은 "목록 밖에 새 소수가 있다"는 것만 보이고, 그 소수가 무엇인지는 \(N\)을 소인수분해해야 알 수 있다.`,
      en: String.raw`The shape of proof by contradiction: assume \(\lnot P\), derive a contradiction \(\bot\) from it, then conclude \(P\). Euclid assumed the negation of "\(P\): there are infinitely many primes" — "there are finitely many" — and derived a contradiction.
Caution: contradiction often proves existence without exhibiting the object — the proof above only shows "a new prime exists off the list"; finding it requires factoring \(N\).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: EuclidData, lang: Lang): void {
  const { g, width } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: '유클리드의 증명: 소수는 무한히 많다', en: "Euclid's proof: there are infinitely many primes" },
        lang,
      ),
    );

  const accent = 'var(--accent)';
  const bound = 'var(--bound)';

  // The assumed-complete list of primes as chips.
  g.append('text')
    .attr('x', 0)
    .attr('y', 4)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .text(
      localize(
        { ko: '가정: 소수는 이 k개가 전부', en: 'assumption: these k primes are all there are' },
        lang,
      ),
    );
  const chipGap = 8;
  const chipW = Math.min(64, (width - (data.k - 1) * chipGap) / data.k);
  const chipH = 38;
  const chipY = 14;
  data.primes.forEach((p, i) => {
    const x = i * (chipW + chipGap);
    g.append('rect')
      .attr('x', x)
      .attr('y', chipY)
      .attr('width', chipW)
      .attr('height', chipH)
      .attr('rx', 6)
      .attr('fill', bound)
      .attr('opacity', 0.28)
      .attr('stroke', bound)
      .attr('stroke-width', 1.5);
    g.append('text')
      .attr('x', x + chipW / 2)
      .attr('y', chipY + 17)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(`p${SUBSCRIPTS[i] ?? ''}`);
    g.append('text')
      .attr('x', x + chipW / 2)
      .attr('y', chipY + 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(String(p));
    g.append('text')
      .attr('x', x + chipW / 2)
      .attr('y', chipY + chipH + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(localize({ ko: '나머지 1', en: 'rem 1' }, lang));
  });

  // P and N.
  const lineY = chipY + chipH + 44;
  g.append('text')
    .attr('x', 0)
    .attr('y', lineY)
    .attr('font-size', 14)
    .attr('fill', 'currentColor')
    .text(`P = ${data.primes.join('·')} = ${fmt(data.product, 0)}`);
  g.append('text')
    .attr('x', 0)
    .attr('y', lineY + 30)
    .attr('font-size', 17)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text(`N = P + 1 = ${fmt(data.n, 0)}`);

  // N's factorization: every factor is a new prime, the smallest one highlighted.
  const facY = lineY + 64;
  g.append('text')
    .attr('x', 0)
    .attr('y', facY - 8)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .text(
      localize(
        { ko: 'N의 소인수분해 — 모두 새 소수 (목록에 없음)', en: 'prime factorization of N — all new primes (off the list)' },
        lang,
      ),
    );
  const facW = 72;
  data.factors.forEach((f, i) => {
    const x = i * (facW + chipGap);
    const isNew = i === 0;
    g.append('rect')
      .attr('x', x)
      .attr('y', facY)
      .attr('width', facW)
      .attr('height', chipH)
      .attr('rx', 6)
      .attr('fill', isNew ? accent : bound)
      .attr('opacity', isNew ? 0.45 : 0.28)
      .attr('stroke', isNew ? accent : bound)
      .attr('stroke-width', isNew ? 2.5 : 1.5);
    g.append('text')
      .attr('x', x + facW / 2)
      .attr('y', facY + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(fmt(f, 0));
    if (i < data.factors.length - 1) {
      g.append('text')
        .attr('x', x + facW + chipGap / 2)
        .attr('y', facY + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)
        .attr('fill', 'currentColor')
        .text('×');
    }
  });
  g.append('text')
    .attr('x', 0)
    .attr('y', facY + chipH + 18)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `가장 작은 소인수 ${fmt(data.spf, 0)}은(는) ${data.primes[data.k - 1]}보다 크다 — 목록 밖에 있다. 모순!`,
          en: `the smallest prime factor ${fmt(data.spf, 0)} exceeds ${data.primes[data.k - 1]} — it is off the list. Contradiction!`,
        },
        lang,
      ),
    );
}

export default defineSimpleScene<EuclidData>({
  model: contradictionModel,
  margin: MARGIN,
  fallbackHeight: 330,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: (_data, lang) => verdictText(lang), cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
