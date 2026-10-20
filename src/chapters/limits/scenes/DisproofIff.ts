import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { disproofIffModel, type DisproofClaim, type DisproofData } from '../models/disproofIff';

/**
 * Counterexamples kill universal claims, and iff claims need both directions.
 * All four claims here are FALSE: every one of them dies at a single witness.
 * The scene walks each claim's claim text, tests the slider value n against it
 * (hypothesis/conclusion lights), and boxes the smallest known counterexample.
 * The iff half of the concept lives in the slots and the problems: the claim
 * "n is even if and only if n^2 is even" splits into two genuinely different
 * proofs, one per direction.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

const CLAIM_TITLE: Record<DisproofClaim, { ko: string; en: string }> = {
  'primes-odd': { ko: '모든 소수는 홀수이다.', en: 'Every prime number is odd.' },
  div4: {
    ko: '4가 n²를 나누면 4는 n도 나눈다.',
    en: 'If 4 divides n² then 4 divides n.',
  },
  'irrational-sum': {
    ko: '두 무리수의 합은 무리수이다.',
    en: 'The sum of two irrational numbers is irrational.',
  },
  'abs-equal': {
    ko: '|x| = |y|이면 x = y이다.',
    en: 'If |x| = |y| then x = y.',
  },
};

function lightColor(on: boolean): string {
  return on ? 'var(--accent)' : 'var(--neg, #c0453e)';
}

function verdictStrip(data: DisproofData, lang: Lang): string {
  switch (data.claim) {
    case 'primes-odd':
      return localize(
        {
          ko: String.raw`테스트 \(n = ${fmt(data.n, 0)}\): 소수인가? ${data.nIsPrime ? '예' : '아니오'} · 짝수인가? ${data.nIsEven ? '예' : '아니오'}${data.nIsPrimesOddCounterexample ? ' → 반례! 소수이면서 짝수이다.' : ''}`,
          en: String.raw`test \(n = ${fmt(data.n, 0)}\): prime? ${data.nIsPrime ? 'yes' : 'no'} · even? ${data.nIsEven ? 'yes' : 'no'}${data.nIsPrimesOddCounterexample ? ' → counterexample! prime and even.' : ''}`,
        },
        lang,
      );
    case 'div4':
      return localize(
        {
          ko: String.raw`테스트 \(n = ${fmt(data.n, 0)}\): 가정 \(4 \mid ${fmt(data.n2, 0)}\) — ${data.div4Hypothesis ? '참' : '거짓'} · 결론 \(4 \mid ${fmt(data.n, 0)}\) — ${data.div4Conclusion ? '참' : '거짓'}${data.div4IsCounterexample ? ' → 반례! 가정은 참, 결론은 거짓.' : ''}`,
          en: String.raw`test \(n = ${fmt(data.n, 0)}\): hypothesis \(4 \mid ${fmt(data.n2, 0)}\) — ${data.div4Hypothesis ? 'true' : 'false'} · conclusion \(4 \mid ${fmt(data.n, 0)}\) — ${data.div4Conclusion ? 'true' : 'false'}${data.div4IsCounterexample ? ' → counterexample! hypothesis true, conclusion false.' : ''}`,
        },
        lang,
      );
    case 'irrational-sum':
      return localize(
        {
          ko: String.raw`(슬라이더는 이 주장에 영향을 주지 않습니다.) 쌍 \((\sqrt{2}, -\sqrt{2})\): 합 \(= ${fmt(data.irrSum, 6)}\) — 유리수이므로 반례!`,
          en: String.raw`(the slider does not affect this claim.) pair \((\sqrt{2}, -\sqrt{2})\): sum \(= ${fmt(data.irrSum, 6)}\) — rational, so it is a counterexample!`,
        },
        lang,
      );
    case 'abs-equal':
      return localize(
        {
          ko: String.raw`테스트 쌍 \((x, y) = (${fmt(data.absX, 0)}, ${fmt(data.absY, 0)})\): \(|x| = |y| = ${fmt(data.absXValue, 0)}\) — ${data.absIsCounterexample ? `참이지만 \(x \ne y\) → 반례!` : `참이고 \(x = y\)이다.`}`,
          en: String.raw`test pair \((x, y) = (${fmt(data.absX, 0)}, ${fmt(data.absY, 0)})\): \(|x| = |y| = ${fmt(data.absXValue, 0)}\) — ${data.absIsCounterexample ? `true but \(x \ne y\) → counterexample!` : `true, and \(x = y\).`}`,
        },
        lang,
      );
  }
}

function readoutText(data: DisproofData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`주장: “${CLAIM_TITLE[data.claim].ko}” — 판정: 거짓 (반례 존재)
${verdictStrip(data, 'ko')}
가장 작은 반례: ${data.smallest.label} — ${data.smallest.value}`,
      en: String.raw`claim: "${CLAIM_TITLE[data.claim].en}" — verdict: FALSE (counterexample exists)
${verdictStrip(data, 'en')}
smallest counterexample: ${data.smallest.label} — ${data.smallest.value}`,
    },
    lang,
  );
}

function explainText(data: DisproofData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`보편 명제 “모든 \(x\)에 대해 \(P(x)\)”를 반박하는 데에는 단 하나의 반례면 충분합니다. 왜냐하면 \(\lnot(\forall x\, P(x)) = \exists x\, \lnot P(x)\) — 부정은 존재 명제로 바뀌기 때문입니다. 백 개의 지지 예는 주장을 증명하지 못하지만, 한 개의 반례는 주장을 확정적으로 죽입니다. 위 네 주장은 모두 거짓이니, 주장 메뉴를 바꿔 보며 각 반례를 확인해 보세요. \(n\) 슬라이더로 다른 값을 시험해도 반례 자체는 사라지지 않습니다.`,
      en: String.raw`To refute a universal claim "for every \(x\), \(P(x)\)" it suffices to produce a single counterexample. That is because \(\lnot(\forall x\, P(x)) = \exists x\, \lnot P(x)\) — negation turns a universal claim into an existential one. A hundred supporting examples never prove the claim, but one counterexample kills it outright. All four claims above are false; switch the claim menu to inspect each counterexample. Testing other values with the \(n\) slider never resurrects the claim.`,
    },
    lang,
  );
  const n2Note =
    data.claim === 'div4'
      ? localize(
          {
            ko: String.raw` div4 주장에서 \(n = 2\)가 반례인 이유는 “\(n^2\)이 4의 배수”와 “\(n\)이 4의 배수” 사이에 틈이 있기 때문입니다: 2가 두 번 곱해져서야 비로소 4의 배수가 됩니다.`,
            en: String.raw` For div4, \(n = 2\) works because there is a gap between "\(n^2\) is a multiple of 4" and "\(n\) is a multiple of 4": it takes 2 multiplied by itself to reach a multiple of 4.`,
          },
          lang,
        )
      : '';
  return body + n2Note;
}

function iffText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`한편 “\(P \iff Q\)”는 두 개의 독립된 명제입니다: \(P \Rightarrow Q\)와 \(Q \Rightarrow P\). 한쪽만 증명하면 절반짜리 증명입니다. 예를 들어 “\(n\)이 짝수 \(\iff\) \(n^2\)이 짝수”에서, \(\Rightarrow\) 방향은 직접 증명 \(n = 2k \Rightarrow n^2 = 2(2k^2)\)으로 간단하지만, \(\Leftarrow\) 방향은 대우 “\(n\)이 홀수이면 \(n^2\)도 홀수”를 잡아야 합니다 — 서로 다른 증명입니다. 아래 문제 2와 3에서 양방향을 각각 증명해 보세요.`,
      en: String.raw`Meanwhile "\(P \iff Q\)" is two independent statements: \(P \Rightarrow Q\) and \(Q \Rightarrow P\). Proving only one direction is half a proof. For example, in "\(n\) is even \(\iff\) \(n^2\) is even", the \(\Rightarrow\) direction is easy by direct proof \(n = 2k \Rightarrow n^2 = 2(2k^2)\), but the \(\Leftarrow\) direction needs the contrapositive "if \(n\) is odd then \(n^2\) is odd" — a genuinely different proof. Prove each direction in problems 2 and 3 below.`,
    },
    lang,
  );
}

function drawTestStrip(chart: Chart, data: DisproofData, lang: Lang, yTop: number): number {
  const { g, width } = chart;
  let y = yTop;
  const items: { label: string; value: string; on: boolean; badWhenOn?: boolean }[] = [];
  const ko = lang === 'ko';
  switch (data.claim) {
    case 'primes-odd':
      items.push(
        { label: ko ? 'n이 소수' : 'n is prime', value: data.nIsPrime ? '✓' : '✗', on: data.nIsPrime },
        { label: ko ? 'n이 짝수' : 'n is even', value: data.nIsEven ? '✓' : '✗', on: data.nIsEven },
        {
          label: ko ? '반례 (소수·짝수)' : 'counterexample (prime·even)',
          value: data.nIsPrimesOddCounterexample ? '✓' : '—',
          on: data.nIsPrimesOddCounterexample,
          badWhenOn: false,
        },
      );
      break;
    case 'div4':
      items.push(
        { label: ko ? `가정 4 | n² = ${fmt(data.n2, 0)}` : `hypothesis 4 | n² = ${fmt(data.n2, 0)}`, value: data.div4Hypothesis ? '✓' : '✗', on: data.div4Hypothesis },
        { label: ko ? `결론 4 | n = ${fmt(data.n, 0)}` : `conclusion 4 | n = ${fmt(data.n, 0)}`, value: data.div4Conclusion ? '✓' : '✗', on: data.div4Conclusion },
        {
          label: ko ? '반례 (가정 참·결론 거짓)' : 'counterexample (hyp true, concl false)',
          value: data.div4IsCounterexample ? '✓' : '—',
          on: data.div4IsCounterexample,
        },
      );
      break;
    case 'irrational-sum':
      items.push(
        { label: ko ? '√2 무리수' : '√2 irrational', value: '✓', on: true },
        { label: ko ? '−√2 무리수' : '−√2 irrational', value: '✓', on: true },
        { label: ko ? `합 = 0 (유리수)` : `sum = 0 (rational)`, value: '✓', on: true },
      );
      break;
    case 'abs-equal':
      items.push(
        { label: ko ? `|x| = |y| = ${fmt(data.absXValue, 0)}` : `|x| = |y| = ${fmt(data.absXValue, 0)}`, value: '✓', on: true },
        { label: ko ? `x = ${fmt(data.absX, 0)}` : `x = ${fmt(data.absX, 0)}`, value: fmt(data.absX, 0), on: true },
        { label: ko ? `y = ${fmt(data.absY, 0)}` : `y = ${fmt(data.absY, 0)}`, value: fmt(data.absY, 0), on: true },
        {
          label: ko ? '반례 (x ≠ y)' : 'counterexample (x ≠ y)',
          value: data.absIsCounterexample ? '✓' : '—',
          on: data.absIsCounterexample,
        },
      );
      break;
  }
  const rows = Math.ceil(items.length / 2);
  const colW = width / 2;
  items.forEach((item, i) => {
    const cx = (i % 2) * colW;
    const ry = y + Math.floor(i / 2) * 30;
    g.append('circle')
      .attr('cx', cx + 10)
      .attr('cy', ry - 4)
      .attr('r', 8)
      .attr('fill', lightColor(item.on))
      .attr('opacity', item.on ? 0.85 : 0.25);
    g.append('text')
      .attr('x', cx + 10)
      .attr('y', ry - 4 + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .attr('fill', '#fff')
      .text(item.on ? '●' : '○');
    g.append('text')
      .attr('x', cx + 26)
      .attr('y', ry)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`${item.label}: ${item.value}`);
  });
  return y + rows * 30 + 8;
}

function drawMain(chart: Chart, data: DisproofData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `판정 패널 — “${CLAIM_TITLE[data.claim].ko}”`,
          en: `Verdict panel — "${CLAIM_TITLE[data.claim].en}"`,
        },
        lang,
      ),
    );

  // Big verdict stamp.
  g.append('text')
    .attr('x', width)
    .attr('y', -20)
    .attr('text-anchor', 'end')
    .attr('font-size', 13)
    .attr('font-weight', 700)
    .attr('fill', 'var(--neg, #c0453e)')
    .text(localize({ ko: '판정: 거짓', en: 'verdict: FALSE' }, lang));

  const afterStrip = drawTestStrip(chart, data, lang, 18);

  // Smallest-counterexample box.
  const boxY = Math.min(afterStrip, height - 78);
  g.append('rect')
    .attr('x', 0)
    .attr('y', boxY)
    .attr('width', width)
    .attr('height', 70)
    .attr('rx', 8)
    .attr('fill', 'var(--accent)')
    .attr('opacity', 0.12)
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 1.5);
  g.append('text')
    .attr('x', 12)
    .attr('y', boxY + 22)
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '가장 작은 반례', en: 'smallest counterexample' }, lang));
  g.append('text')
    .attr('x', 12)
    .attr('y', boxY + 44)
    .attr('font-size', 13)
    .attr('fill', 'currentColor')
    .text(data.smallest.label);
  g.append('text')
    .attr('x', 12)
    .attr('y', boxY + 62)
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .text(data.smallest.value);
}

export default defineSimpleScene<DisproofData>({
  model: disproofIffModel,
  margin: MARGIN,
  fallbackHeight: 260,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: (_data, lang) => iffText(lang), cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
