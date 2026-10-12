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
  /** Drawing area inside the margins */
  readonly g: Selection<SVGGElement, unknown, null, undefined>;
  /** Size of g (excluding the margins) */
  width: number;
  height: number;
  setSize(outerWidth: number, outerHeight: number): void;
  destroy(): void;
}

/** Builds the SVG chart skeleton inside the host. The host height must be set in CSS. */
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
