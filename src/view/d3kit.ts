import { select, type Selection } from 'd3';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGIN: Margin = { top: 16, right: 16, bottom: 36, left: 52 };

export interface Chart {
  readonly svg: Selection<SVGSVGElement, unknown, null, undefined>;
  /** 마진 안쪽 그림 영역 */
  readonly g: Selection<SVGGElement, unknown, null, undefined>;
  /** g 의 크기(마진 제외) */
  width: number;
  height: number;
  setSize(outerWidth: number, outerHeight: number): void;
  destroy(): void;
}

/** 호스트 안에 SVG 차트 뼈대를 만든다. 호스트 높이는 CSS로 정해져 있어야 한다. */
export function createChart(host: HTMLElement, margin: Margin = DEFAULT_MARGIN): Chart {
  const svg = select(host)
    .append('svg')
    .attr('role', 'img')
    .style('display', 'block')
    .style('width', '100%')
    .style('height', '100%');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const chart: Chart = {
    svg,
    g,
    width: 0,
    height: 0,
    setSize(outerWidth, outerHeight) {
      chart.width = Math.max(0, outerWidth - margin.left - margin.right);
      chart.height = Math.max(0, outerHeight - margin.top - margin.bottom);
      svg.attr('viewBox', `0 0 ${outerWidth} ${outerHeight}`);
    },
    destroy() {
      svg.remove();
    },
  };

  chart.setSize(host.clientWidth || 640, host.clientHeight || 360);
  return chart;
}
