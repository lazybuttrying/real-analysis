import {
  drag,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  zoom,
  zoomIdentity,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3';
import { catalog } from '../catalog.ts';
import { localize, type Lang } from '../contracts.ts';
import { buildConceptMap } from '../concept-map.ts';
import { homeUrl, parsePath, sceneUrl, withLang } from '../paths.ts';
import { h } from './dom.ts';
import { langSwitcher, tr } from './i18n.ts';
import { mountSearch } from './search.ts';

const BASE = import.meta.env.BASE_URL;
const SVG_NS = 'http://www.w3.org/2000/svg';
const WIDTH = 960;
const HEIGHT = 640;
const SETTLE_TICKS = 320;

interface SimNode extends SimulationNodeDatum {
  chapterId: string;
  sceneId: string;
  title: string;
  chapterTitle: string;
  isEntry: boolean;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: 'prereq' | 'path';
}

/** chapterId/sceneId -> localized titles, for node labels and tooltips. */
const sceneOf = new Map<string, { title: (lang: Lang) => string; chapterTitle: (lang: Lang) => string }>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) {
    sceneOf.set(`${chapter.id}/${scene.id}`, {
      title: (lang: Lang) => localize(scene.title, lang),
      chapterTitle: (lang: Lang) => localize(chapter.title, lang),
    });
  }
}

function svgEl(tag: string, attrs: Readonly<Record<string, string>> = {}): SVGElement {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  return element;
}

function pageHeader(lang: Lang): HTMLElement {
  const headerSearch = h('span', { class: 'header-search' });
  const header = h(
    'header',
    { class: 'home-header' },
    h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, 'Real Analysis'),
    headerSearch,
    langSwitcher(lang, (target) => withLang(BASE, parsePath(BASE, location.pathname), target)),
  );
  mountSearch(headerSearch, lang);
  return header;
}

/**
 * Client-side render of /<lang>/map/: a d3 force-directed concept map of all
 * scenes, linked by prerequisite relations (solid) and learning-path reading
 * order (dashed). The layout is pre-settled synchronously (deterministic —
 * nodes start on chapter rings, no Math.random), so the first paint is the
 * final layout; drag and zoom stay interactive afterwards.
 */
export function renderMapPage(root: HTMLElement, lang: Lang): void {
  document.title = `${tr(lang, 'map')} | Real Analysis`;
  const { nodes, edges } = buildConceptMap();

  const simNodes: SimNode[] = nodes.map((node) => {
    const info = sceneOf.get(`${node.chapterId}/${node.sceneId}`);
    return {
      chapterId: node.chapterId,
      sceneId: node.sceneId,
      title: info?.title(lang) ?? node.sceneId,
      chapterTitle: info?.chapterTitle(lang) ?? node.chapterId,
      isEntry: node.isEntry,
    };
  });
  const simLinks: SimLink[] = edges.map((edge) => ({
    source: `${edge.source.chapterId}/${edge.source.sceneId}`,
    target: `${edge.target.chapterId}/${edge.target.sceneId}`,
    kind: edge.kind,
  }));

  // One anchor per chapter, arranged in a triangle, so the graph settles into
  // visible chapter lobes instead of a single clump. Fully deterministic.
  const chapterOrder = catalog.map((chapter) => chapter.id);
  const chapterCenters = new Map<string, { x: number; y: number }>();
  for (const [index, chapterId] of chapterOrder.entries()) {
    const angle = -Math.PI / 2 + (index / Math.max(1, chapterOrder.length)) * Math.PI * 2;
    const radius = Math.min(WIDTH, HEIGHT) * 0.30;
    chapterCenters.set(chapterId, {
      x: WIDTH / 2 + radius * Math.cos(angle),
      y: HEIGHT / 2 + radius * Math.sin(angle),
    });
  }
  const chapterCenter = (chapterId: string): { x: number; y: number } =>
    chapterCenters.get(chapterId) ?? { x: WIDTH / 2, y: HEIGHT / 2 };

  // Deterministic start: nodes seed around their own chapter's center, so the
  // settled layout does not depend on Math.random.
  for (const node of simNodes) {
    const center = chapterCenter(node.chapterId);
    const siblings = simNodes.filter((candidate) => candidate.chapterId === node.chapterId);
    const slot = siblings.indexOf(node);
    const radius = 50 + (slot % 6) * 24;
    const angle = (slot / Math.max(1, siblings.length)) * Math.PI * 2;
    node.x = center.x + radius * Math.cos(angle);
    node.y = center.y + radius * Math.sin(angle);
  }

  const simulation = forceSimulation(simNodes)
    .force(
      'link',
      forceLink<SimNode, SimLink>(simLinks)
        .id((node) => `${node.chapterId}/${node.sceneId}`)
        .distance(84)
        .strength(0.45),
    )
    .force('charge', forceManyBody().strength(-240))
    .force('collide', forceCollide(32))
    .force(
      'x',
      forceX<SimNode>((d) => chapterCenter(d.chapterId).x).strength(0.26),
    )
    .force(
      'y',
      forceY<SimNode>((d) => chapterCenter(d.chapterId).y).strength(0.26),
    )
    .stop();
  for (let i = 0; i < SETTLE_TICKS; i++) simulation.tick();

  const main = h('main', { class: 'home map' });
  main.append(h('h1', {}, tr(lang, 'map')), h('p', {}, tr(lang, 'mapIntro')));

  const legend = h('div', { class: 'map-legend' });
  const filterButtons: HTMLButtonElement[] = [];
  for (const [index, chapter] of catalog.entries()) {
    const button = h(
      'button',
      {
        class: 'map-legend-filter',
        type: 'button',
        'data-chapter': chapter.id,
        'aria-pressed': 'false',
      },
      h('span', { class: 'map-swatch', 'data-chapter': chapter.id }),
      `${index + 1}. ${localize(chapter.title, lang)}`,
    ) as HTMLButtonElement;
    filterButtons.push(button);
    legend.append(button);
  }
  legend.append(
    h('span', { class: 'map-legend-item' }, h('span', { class: 'map-line-sample map-line-prereq' }), tr(lang, 'mapPrereq')),
    h('span', { class: 'map-legend-item' }, h('span', { class: 'map-line-sample map-line-path' }), tr(lang, 'mapPathOrder')),
  );
  main.append(legend);

  const wrap = h('div', { class: 'map-wrap' });
  const svg = svgEl('svg', {
    class: 'map-svg',
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    role: 'img',
    'aria-label': tr(lang, 'map'),
  }) as SVGSVGElement;
  wrap.append(svg);

  const tooltip = h('div', { class: 'map-tooltip', hidden: 'true' });
  wrap.append(tooltip);

  const resetButton = h('button', { class: 'map-reset', type: 'button' }, tr(lang, 'mapResetView'));
  wrap.append(resetButton);
  main.append(wrap);

  // Arrowhead markers, one per edge kind.
  const defs = svgEl('defs');
  for (const kind of ['prereq', 'path'] as const) {
    const marker = svgEl('marker', {
      id: `map-arrow-${kind}`,
      viewBox: '0 0 10 10',
      refX: '8.5',
      refY: '5',
      markerWidth: '6.5',
      markerHeight: '6.5',
      orient: 'auto-start-reverse',
    });
    const path = svgEl('path', { d: 'M 0 1 L 9 5 L 0 9 z', class: `map-arrow map-arrow-${kind}` });
    marker.append(path);
    defs.append(marker);
  }
  svg.append(defs);

  const viewport = svgEl('g', { class: 'map-viewport' });
  svg.append(viewport);

  const linkGroup = svgEl('g', { class: 'map-edges' });
  viewport.append(linkGroup);
  const linkSel = select(linkGroup)
    .selectAll('line')
    .data(simLinks)
    .join('line')
    .attr('class', (d) => `map-edge map-edge-${d.kind}`)
    .attr('marker-end', (d) => `url(#map-arrow-${d.kind})`);

  const nodeGroup = svgEl('g', { class: 'map-nodes' });
  viewport.append(nodeGroup);
  const nodeSel = select(nodeGroup)
    .selectAll<SVGGElement, SimNode>('g')
    .data(simNodes)
    .join('g')
    .attr('class', (d) => (d.isEntry ? 'map-node map-entry' : 'map-node'))
    .attr('data-chapter', (d) => d.chapterId);
  nodeSel.append('circle').attr('r', (d) => (d.isEntry ? '11' : '7'));
  nodeSel
    .append('text')
    .attr('dy', (d) => (d.isEntry ? '2em' : '1.7em'))
    .attr('text-anchor', 'middle')
    .attr('class', (d) => (d.isEntry ? 'map-label-entry' : null))
    .text((d) => d.title);

  // Adjacency (both directions) for the hover neighborhood highlight. Built
  // after the link force resolved string ids to node objects.
  const nodeKeyOf = (node: SimNode): string => `${node.chapterId}/${node.sceneId}`;
  const neighbors = new Map<string, Set<string>>();
  for (const node of simNodes) neighbors.set(nodeKeyOf(node), new Set([nodeKeyOf(node)]));
  for (const link of simLinks) {
    const from = nodeKeyOf(link.source as SimNode);
    const to = nodeKeyOf(link.target as SimNode);
    neighbors.get(from)?.add(to);
    neighbors.get(to)?.add(from);
  }

  /**
   * Dims everything outside the hovered node's neighborhood to 15% opacity.
   * Passing null restores the full graph.
   */
  const setFocus = (focused: SimNode | null): void => {
    const keep: Set<string> | null =
      focused === null ? null : (neighbors.get(nodeKeyOf(focused)) ?? new Set<string>());
    nodeSel.style('opacity', (node) => (keep === null || keep.has(nodeKeyOf(node)) ? null : '0.15'));
    linkSel.style('opacity', (link) => {
      if (keep === null) return null;
      const from = nodeKeyOf(link.source as SimNode);
      const to = nodeKeyOf(link.target as SimNode);
      return keep.has(from) && keep.has(to) ? null : '0.15';
    });
  };

  const renderPositions = (): void => {    linkSel
      .attr('x1', (d) => (d.source as SimNode).x ?? 0)
      .attr('y1', (d) => (d.source as SimNode).y ?? 0)
      .attr('x2', (d) => (d.target as SimNode).x ?? 0)
      .attr('y2', (d) => (d.target as SimNode).y ?? 0);
    nodeSel.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
  };
  renderPositions();
  simulation.on('tick', renderPositions);

  const zoomBehavior = zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
    select(viewport).attr('transform', event.transform.toString());
  });
  select(svg).call(zoomBehavior);

  // Fit a set of nodes into the viewBox with padding. The reset button
  // restores the full-graph fit; the chapter filter fits the visible lobe.
  const fitNodes = (nodesToFit: readonly SimNode[]): void => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const node of nodesToFit) {
      minX = Math.min(minX, node.x ?? 0);
      maxX = Math.max(maxX, node.x ?? 0);
      minY = Math.min(minY, node.y ?? 0);
      maxY = Math.max(maxY, node.y ?? 0);
    }
    if (!Number.isFinite(minX)) return;
    const pad = 80;
    const fitScale = Math.min(WIDTH / (maxX - minX + pad * 2), HEIGHT / (maxY - minY + pad * 2));
    const transform = zoomIdentity
      .translate(WIDTH / 2 - fitScale * ((minX + maxX) / 2), HEIGHT / 2 - fitScale * ((minY + maxY) / 2))
      .scale(fitScale);
    select(svg).call(zoomBehavior.transform, transform);
  };
  fitNodes(simNodes);

  // Chapter filter: clicking a legend swatch isolates that chapter's subgraph
  // (other chapters hidden). Clicking again restores the full graph.
  let isolatedChapter: string | null = null;
  const applyFilter = (): void => {
    const visible = (chapterId: string): boolean => isolatedChapter === null || isolatedChapter === chapterId;
    nodeSel.style('display', (node) => (visible(node.chapterId) ? null : 'none'));
    linkSel.style('display', (link) =>
      visible((link.source as SimNode).chapterId) && visible((link.target as SimNode).chapterId) ? null : 'none',
    );
    for (const button of filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset['chapter'] === isolatedChapter));
    }
    setFocus(null);
    fitNodes(isolatedChapter === null ? simNodes : simNodes.filter((node) => node.chapterId === isolatedChapter));
  };
  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      const chapterId = button.dataset['chapter'] ?? '';
      isolatedChapter = isolatedChapter === chapterId ? null : chapterId;
      applyFilter();
    });
  }

  // Drag a node; a click (no drag) navigates to the scene page.
  let dragged = false;
  nodeSel.call(
    drag<SVGGElement, SimNode>()
      .on('start', (event, d) => {
        dragged = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        dragged = true;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }),
  );
  nodeSel.on('click', (event, d) => {
    if (dragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    location.href = sceneUrl(BASE, lang, d.chapterId, d.sceneId);
  });

  // Hover: tooltip plus neighborhood highlight (everything outside the
  // hovered node's incoming/outgoing neighborhood dims to 15%).
  nodeSel
    .on('mouseenter', (_event, d) => {
      tooltip.replaceChildren(
        h('strong', {}, d.title),
        h('span', { class: 'map-tooltip-chapter' }, d.chapterTitle),
      );
      tooltip.hidden = false;
      setFocus(d);
    })
    .on('mousemove', (event) => {
      const rect = wrap.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left + 12}px`;
      tooltip.style.top = `${event.clientY - rect.top + 12}px`;
    })
    .on('mouseleave', () => {
      tooltip.hidden = true;
      setFocus(null);
    });

  resetButton.addEventListener('click', () => {
    isolatedChapter = null;
    applyFilter();
  });

  root.replaceChildren(pageHeader(lang), main);
}
