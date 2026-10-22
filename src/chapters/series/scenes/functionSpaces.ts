import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  functionSpacesModel,
  FS_X_MAX,
  type FsPoint,
  type FunctionSpacesData,
} from '../models/functionSpaces';

/**
 * Function spaces, live. Spaces mode draws one representative of each
 * layer of C_c subset C_0 subset C_b on [-4, 4]: the tent bump
 * (compactly supported), e^{-|x|} (vanishing at infinity, positive
 * everywhere), and the constant 1 (bounded, never vanishing). The
 * window-edge readouts show the tails: 0, e^{-4}, 1.
 * Cutoff mode draws f = e^{-|x|}, the cutoff phi_k, and the product
 * f_k = phi_k f in C_c: phi_k is 1 up to |x| = k and slides to 0 at
 * |x| = k + 1, and the sup error is exactly e^{-(k+1)}.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 56 };

const path = line<FsPoint>()
  .x((d) => d.x)
  .y((d) => d.y);

function readoutText(data: FunctionSpacesData, lang: Lang): string {
  if (data.mode === 'spaces') {
    return localize(
      {
        ko: String.raw`창 끝 \(x = 4\)에서의 값: 텐트 \(= ${fmt(data.tentTail, 4)}\), \(e^{-|x|} = ${fmt(data.expTail, 4)}\), 상수 \(1 = ${fmt(data.oneTail, 4)}\). sup 노름은 셋 다 \(1\)입니다.`,
        en: String.raw`Values at the window edge \(x = 4\): tent \(= ${fmt(data.tentTail, 4)}\), \(e^{-|x|} = ${fmt(data.expTail, 4)}\), constant \(1 = ${fmt(data.oneTail, 4)}\). All three sup norms are \(1\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(k = ${fmt(data.k, 2)}\): \(f_k = \varphi_k f\)는 \(|x| \ge ${fmt(data.supportHi, 2)}\)에서 사라집니다. sup 오차 \(\|f - f_k\|_\infty = e^{-(k+1)} = ${fmt(data.errorExact, 6)}\) (수치 계산 \( ${fmt(data.errorNumeric, 6)}\), 느슨한 bound \(e^{-k} = ${fmt(data.errorBound, 6)}\)).`,
      en: String.raw`\(k = ${fmt(data.k, 2)}\): \(f_k = \varphi_k f\) vanishes for \(|x| \ge ${fmt(data.supportHi, 2)}\). Sup error \(\|f - f_k\|_\infty = e^{-(k+1)} = ${fmt(data.errorExact, 6)}\) (numeric \( ${fmt(data.errorNumeric, 6)}\), loose bound \(e^{-k} = ${fmt(data.errorBound, 6)}\)).`,
    },
    lang,
  );
}

function explainText(data: FunctionSpacesData, lang: Lang): string {
  if (data.mode === 'spaces') {
    return localize(
      {
        ko: String.raw`포함 관계 \(C_c \subsetneq C_0 \subsetneq C_b\)의 각 층마다 증인이 하나씩 있습니다. 텐트 함수는 유한 구간 밖에서 완전히 \(0\)이라 \(C_c\)에 있습니다. \(e^{-|x|}\)는 어디에서도 \(0\)이 되지 않지만 멀리 갈수록 \(0\)으로 사라져 \(C_0\)에만 있습니다. 상수 \(1\)은 유계이지만 사라지지 않아 \(C_b\)에만 있습니다.`,
        en: String.raw`Each layer of \(C_c \subsetneq C_0 \subsetneq C_b\) has its witness. The tent is exactly \(0\) outside a finite interval, so it lies in \(C_c\). The function \(e^{-|x|}\) is zero nowhere but fades to \(0\) at infinity, so it lies in \(C_0\) only. The constant \(1\) is bounded but never fades, so it lies in \(C_b\) only.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`절단 \(\varphi_k\)는 \(|x| \le k\)에서 \(1\), \(|x| \ge k+1\)에서 \(0\), 그 사이에서는 선형으로 내려갑니다. 곱 \(f_k = \varphi_k f\)는 연속이고 지지집합이 \([-(k+1), k+1]\) 안에 있어 \(C_c\)에 속합니다. \(|x| \le k\)에서는 \(f\)와 완전히 같고, 오차는 꼬리에서만 생깁니다.`,
      en: String.raw`The cutoff \(\varphi_k\) is \(1\) for \(|x| \le k\), \(0\) for \(|x| \ge k+1\), and linear in between. The product \(f_k = \varphi_k f\) is continuous with support inside \([-(k+1), k+1]\), so it lies in \(C_c\). It agrees with \(f\) exactly on \(|x| \le k\); the error lives only in the tails.`,
    },
    lang,
  );
}

function verdictText(data: FunctionSpacesData, lang: Lang): string {
  if (data.mode === 'spaces') {
    return localize(
      {
        ko: String.raw`판정: 두 포함 모두 진짜입니다 (strict). \(C_0\)는 \(C_b\) 안에서 닫혀 있고 (문제 1), \(C_c\)는 \(C_0\) 안에서 dense이지만 닫혀 있지 않습니다 (문제 2·3).`,
        en: String.raw`Verdict: both inclusions are strict. \(C_0\) is closed inside \(C_b\) (Problem 1), while \(C_c\) is dense in \(C_0\) but not closed (Problems 2 and 3).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: \(k\)를 키울수록 오차 \(e^{-(k+1)}\)가 \(0\)으로 가므로, \(C_c\)의 원소들로 \(f \in C_0\)를 원하는 만큼 가깝게 근사할 수 있습니다 — \(C_c\)는 \(C_0\) 안에서 dense입니다 (문제 2). 그런데 극한 \(f\) 자체는 \(C_c\)에 없습니다 (문제 3).`,
      en: String.raw`Verdict: as \(k\) grows the error \(e^{-(k+1)}\) tends to \(0\), so elements of \(C_c\) approximate \(f \in C_0\) as closely as desired — \(C_c\) is dense in \(C_0\) (Problem 2). Yet the limit \(f\) itself is not in \(C_c\) (Problem 3).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: FunctionSpacesData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const x = scaleLinear().domain([-FS_X_MAX, FS_X_MAX]).range([0, width]);
  const y = scaleLinear().domain([-0.18, 1.3]).range([height, 0]);
  const px = path.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(9));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(6));

  const title: LocalizedText =
    data.mode === 'spaces'
      ? {
          ko: '세 층의 대표원소: 텐트 (C_c), e^{-|x|} (C_0), 상수 1 (C_b)',
          en: 'One witness per layer: tent (C_c), e^{-|x|} (C_0), constant 1 (C_b)',
        }
      : {
          ko: `절단 근사: f = e^{-|x|}, φ_k, f_k = φ_k f (k = ${fmt(data.k, 2)})`,
          en: `Cutoff approximation: f = e^{-|x|}, phi_k, f_k = phi_k f (k = ${fmt(data.k, 2)})`,
        };
  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize(title, lang));

  const curve = (
    points: readonly FsPoint[],
    color: string,
    widthPx: number,
    dashed: boolean,
    opacity: number,
  ): void => {
    const p = g
      .append('path')
      .attr('fill', 'none')
      .attr('stroke-width', widthPx)
      .attr('opacity', opacity)
      .style('stroke', color)
      .attr('d', px(points as FsPoint[]) ?? '');
    if (dashed) p.attr('stroke-dasharray', '6 4');
  };

  if (data.mode === 'spaces') {
    curve(data.oneSamples, 'currentColor', 2, true, 0.6);
    curve(data.expSamples, 'var(--bound)', 2.5, false, 1);
    curve(data.tentSamples, 'var(--accent)', 2.5, false, 1);
  } else {
    // The cutoff phi_k (thin, dashed), f itself (faint), f_k (accent).
    curve(data.phiSamples, 'currentColor', 1.5, true, 0.55);
    curve(data.expSamples, 'var(--bound)', 2, false, 0.55);
    curve(data.fkSamples, 'var(--accent)', 2.5, false, 1);
    // Support markers at +-(k+1).
    for (const s of [-data.supportHi, data.supportHi]) {
      g.append('line')
        .attr('x1', x(s))
        .attr('x2', x(s))
        .attr('y1', y(0))
        .attr('y2', y(1.15))
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', 0.5);
    }
  }

  // Legend.
  const legendY = height + 34;
  const legend = (lx: number, color: string, label: LocalizedText): void => {
    g.append('text')
      .attr('x', lx)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', color)
      .text(localize(label, lang));
  };
  if (data.mode === 'spaces') {
    legend(8, 'var(--accent)', { ko: '— 텐트 (C_c)', en: '— tent (C_c)' });
    legend(width * 0.34, 'var(--bound)', { ko: '— e^{-|x|} (C_0)', en: '— e^{-|x|} (C_0)' });
    legend(width * 0.66, 'currentColor', { ko: '┄ 상수 1 (C_b)', en: '┄ constant 1 (C_b)' });
  } else {
    legend(8, 'var(--accent)', { ko: '— f_k = φ_k f (C_c)', en: '— f_k = phi_k f (C_c)' });
    legend(width * 0.36, 'var(--bound)', { ko: '— f = e^{-|x|}', en: '— f = e^{-|x|}' });
    legend(width * 0.68, 'currentColor', { ko: '┄ φ_k (절단)', en: '┄ phi_k (cutoff)' });
  }
}

export default defineSimpleScene<FunctionSpacesData>({
  model: functionSpacesModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
