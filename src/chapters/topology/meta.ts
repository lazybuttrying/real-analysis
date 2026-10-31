import type { ChapterMeta } from '../../contracts.ts';
import { baireCategoryProblems } from '../limits/problems/baire-category';
import { baireOneProblems } from '../limits/problems/baire-1';
import { clopenProblems } from '../limits/problems/clopen';
import { connectedProblems } from '../limits/problems/connected';
import { fatCantorProblems } from '../limits/problems/fat-cantor';
import { peanoCurveProblems } from '../limits/problems/peano-curve';
import { topologistSineProblems } from '../limits/problems/topologist-sine';
import { problems as cantorFunctionProblems } from '../limits/problems/cantor-function';
import { problems as cantorProblems } from '../limits/problems/cantor';
import { problems as closureProblems } from '../limits/problems/closure';
import { problems as compactProblems } from '../limits/problems/compact';
import { problems as contractionProblems } from '../limits/problems/contraction';
import { problems as metricSpacesProblems } from '../limits/problems/metric-spaces';
import { problems as opensetsProblems } from '../limits/problems/opensets';

/**
 * Pure data. Imports types plus per-scene problems data modules
 * (../{limits,series,calculus}/problems/* — data only, no code, models, views, or shell). Node build scripts and every chapter's navigation read
 * this file. Every text is stored per language; the shell picks one via the
 * URL language segment. Summaries embed math as inline TeX between \( and \)
 * (see splitInlineMath in contracts.ts).
 *
 * NOTE (10-chapter split): this is a LOGICAL chapter. The scene files
 * (models/, scenes/, problems/) live in the legacy scene stores
 * src/chapters/{limits,series,calculus}/ and are referenced here via
 * relative paths. See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
export const topology: ChapterMeta = {
  id: 'topology',
  title: { ko: '위상', en: 'Topology' },
  summary: {
    ko: '열린집합·콤팩트·완비성 — 실직선의 위상적 구조와 베어 범주 정리, 칸토어 집합을 다룹니다.',
    en: 'Open sets, compactness, completeness — the topology of the real line, the Baire category theorem, Cantor sets.',
  },
  sections: [
    { id: 'open-connected', title: { ko: '열린집합과 연결성', en: 'Open Sets and Connectedness' }, sceneIds: ['opensets', 'clopen', 'connected', 'closure'] },
    { id: 'compact-metric', title: { ko: '컴팩트와 거리공간', en: 'Compactness and Metric Spaces' }, sceneIds: ['compact', 'topologist-sine', 'peano-curve', 'metric-spaces', 'contraction'] },
    { id: 'baire-cantor', title: { ko: '베어와 칸토어', en: 'Baire and Cantor' }, sceneIds: ['baire-category', 'baire-1', 'cantor', 'fat-cantor', 'cantor-function'] },
  ],
  scenes: [
    {
      id: 'opensets',
      title: { ko: '열린집합과 닫힌집합', en: 'Open and Closed Sets' },
      order: 1,
      summary: {
        ko: String.raw`열린집합이 무엇인지 확인하는 씬입니다. 점과 반지름을 움직이며, 작은 공이 집합 안에 쏙 들어가는지 봅니다.

열려 있다는 것은 경계에 붙은 점이 없다는 뜻입니다. 어느 점을 골라도, 그 점 둘레에 집합 안에 들어가는 작은 구간이 있습니다. 경계에 붙은 점에서는 아무리 작은 구간도 밖으로 삐져나갑니다.

예를 들면, 마당 한가운데서 ⚽ 공을 차 보세요. 조금 세게 차도 공은 아직 마당 안입니다. 담장 바로 앞에서 차면, 한 번에 밖으로 나갑니다. 가운데 점과 경계 점의 차이가 그렇습니다.`,
        en: String.raw`This scene shows what an open set is. Move the point and the radius, and check whether the small ball fits inside.

Open means no point clings to the boundary. Around every point there is a small interval lying inside the set. At a boundary point, every interval, however small, pokes outside.

For example, kick a ⚽ ball in the middle of a yard. A gentle kick keeps it inside. Kick from right at the fence, and it flies out at once. That is the difference between an interior point and a boundary point.`,
      },
      tex: [
        String.raw`U \text{ open } \iff \forall x \in U\ \exists \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \subseteq U`,
        String.raw`F \text{ closed } \iff F^c \text{ open}`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'select', key: 'set', label: { ko: '집합 S', en: 'Set S' }, options: ['open', 'closed', 'half', 'singleton'], init: 'open' },
        { kind: 'slider', key: 'x', label: { ko: '점 x', en: 'Point x' }, min: -0.3, max: 1.3, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'eps', label: { ko: '반지름 ε', en: 'Radius ε' }, min: 0.05, max: 0.6, step: 0.05, init: 0.2 },
      ],
problems: opensetsProblems,
    },
    {
      id: 'clopen',
      title: { ko: 'Clopen 집합', en: 'Clopen Sets' },
      order: 2,
      summary: {
        ko: String.raw`열려 있으면서 닫혀 있는 집합, clopen을 보는 씬입니다. 같은 집합도 어떤 공간 안에 있느냐에 따라 운명이 달라집니다.

실수 전체에서는 빈 집합과 전체뿐입니다. 어딘가에 경계가 생기기 때문입니다. 그런데 공간이 두 조각으로 갈라져 있으면, 한 조각은 경계에 닿지 않습니다. 그 조각은 열려 있으면서 닫혀 있습니다.

예를 들면, 멀리 떨어진 🏠 집 두 채 중 한 채만 보세요. 그 집만으로 이루어진 세상에서는, 그 집이 독립된 구역이 됩니다. 열려 있기도 하고 닫혀 있기도 한 것입니다.`,
        en: String.raw`This scene is about sets both open and closed: clopen sets. The same set changes its fate with the space it lives in.

On the whole real line, only the empty set and the line itself qualify. A boundary always appears somewhere. But if the space splits into two separate pieces, one piece touches no boundary. That piece is both open and closed.

For example, take one of two far-apart 🏠 houses. In a world made of that house alone, it forms its own separate region. It is open, and it is closed.`,
      },
      tex: [
        String.raw`A \text{ clopen in } X \iff A \text{ open in } X \text{ and closed in } X`,
        String.raw`[0,1] = \bigl([0,1]\cup[2,3]\bigr) \cap (-0.5, 1.5) = \bigl([0,1]\cup[2,3]\bigr) \cap [-0.5, 1.5]`,
      ],
      prerequisites: ['opensets'],
      controls: [
        { kind: 'select', key: 'case', label: { ko: '경우', en: 'Case' }, options: ['open-interval', 'closed-interval', 'clopen-pieces', 'clopen-gap'], init: 'clopen-pieces' },
        { kind: 'slider', key: 'x', label: { ko: '탐침 x', en: 'Probe x' }, min: -0.6, max: 3.6, step: 0.01, init: 0.5 },
        { kind: 'slider', key: 'eps', label: { ko: '반지름 ε', en: 'Radius ε' }, min: 0.01, max: 2, step: 0.01, init: 0.2 },
      ],
      problems: clopenProblems,
    },
    {
      id: 'connected',
      title: { ko: '연결집합', en: 'Connected Sets' },
      order: 3,
      summary: {
        ko: String.raw`연결집합을 보는 씬입니다. 집합을 서로 닿지 않는 두 열린 조각으로 가를 수 있는지, 절단점을 움직이며 확인합니다.

갈라지지 않는 집합이 연결집합입니다. 구간은 어디를 잘라도 잘린 점이 어느 쪽에도 붙지 않아 갈라지지 않습니다. 멀리 떨어진 두 조각이나, 유리수처럼 틈이 촘촘한 집합은 그 틈에 절단을 넣으면 깔끔하게 갈라집니다.

예를 들면, 🧩 퍼즐 한 판을 보세요. 조각들이 서로 맞물려 있으면 한 판 그대로입니다. 두 무더기로 완전히 떨어져 있으면, 이미 갈라진 것입니다.`,
        en: String.raw`This scene is about connected sets. Move the cut point and check whether the set splits into two open pieces that never touch.

A set that cannot be split is connected. An interval never splits: wherever you cut, the cut point itself belongs to neither side. Two far-apart pieces, or the rationals with their dense gaps, split cleanly when the cut lands in a gap.

For example, look at one 🧩 jigsaw puzzle. While the pieces interlock, it is a single board. Lying in two completely separate piles, it is already split apart.`,
      },
      tex: [
        String.raw`X = U \cup V,\ U \cap V = \emptyset,\ U, V \text{ open in } X,\ U, V \neq \emptyset \implies X \text{ disconnected}`,
        String.raw`\mathbb{Q} \cap [0,1] = \{q \in \mathbb{Q} : q < \sqrt{2}/2\} \cup \{q \in \mathbb{Q} : q > \sqrt{2}/2\}`,
      ],
      prerequisites: ['clopen'],
      controls: [
        { kind: 'select', key: 'case', label: { ko: '경우', en: 'Case' }, options: ['interval', 'two-pieces', 'rationals'], init: 'interval' },
        { kind: 'slider', key: 't', label: { ko: '절단점 t', en: 'Cut point t' }, min: -0.2, max: 3.2, step: 0.01, init: 1.5 },
      ],
      problems: connectedProblems,
    },
    {
      id: 'closure',
      title: { ko: '폐포와 유계', en: 'Closure and Boundedness' },
      order: 4,
      summary: {
        ko: String.raw`집합의 폐포를 보는 씬입니다. 빠져나간 극한점을 모두 붙이면 어떻게 닫히는지 확인합니다.

폐포는 집합이 닿으려던 점까지 품은 것입니다. 아무리 가까이 가도 닿지 않던 점이 있으면, 그 점을 붙여야 닫힙니다. 이미 모든 극한점을 품은 집합은 자기 폐포와 같습니다. 여기에 유계까지 더해지면 컴팩트와 이어집니다.

예를 들면, 📦 상자에 물건을 넣고 뚜껑을 닫아 보세요. 뚜껑까지 닫아야 상자가 완성됩니다. 폐포는 집합에 그 뚜껑에 해당하는 경계점을 붙이는 일입니다.`,
        en: String.raw`This scene builds the closure of a set. Watch what happens when every escaped limit point is pulled back in.

The closure contains every point the set was reaching for. If some point is approached but never touched, closing means adding it. A set already holding all its limit points equals its closure. Add boundedness, and compactness is near.

For example, fill a 📦 box and put the lid on. Only with the lid is the box complete. Closure is like that lid: it adds the boundary points to the set.`,
      },
      tex: [
        String.raw`x \in \overline{A} \iff \forall \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \cap A \neq \varnothing`,
        String.raw`A \text{ closed } \iff \overline{A} = A, \qquad A \text{ bounded } \iff \exists M : \lvert x\rvert \leq M\ \forall x \in A`,
      ],
      prerequisites: ['opensets'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '집합 A', en: 'Set A' }, options: ['open', 'halfclosed', 'reciprocal'], init: 'open' },
        { kind: 'slider', key: 'm', label: { ko: '경계 M', en: 'Bound M' }, min: 0.5, max: 2.5, step: 0.1, init: 1.5 },
      ],
problems: closureProblems,
    },
    {
      id: 'compact',
      title: { ko: '컴팩트 집합', en: 'Compact Sets' },
      order: 5,
      summary: {
        ko: String.raw`컴팩트 집합을 열린 커버로 확인하는 씬입니다. 구간을 덮는 조각들 중 유한 개만으로 충분한지 봅니다.

컴팩트는 닫힘과 유계의 짝입니다. 끝이 열려 있으면 그 틈 근처에서 조각이 끝없이 필요합니다. 끝없이 뻗어 있어도 마찬가지입니다. 두 조건이 갖춰지면, 어떤 덮개든 유한 개로 줄일 수 있습니다.

예를 들면, 📚 책으로 책상 위를 빈틈없이 덮어 보세요. 책상이 유한한 크기라 책 몇 권이면 충분합니다. 끝없이 긴 책상이라면, 책이 아무리 많아도 모자랍니다.`,
        en: String.raw`This scene tests compactness with open covers. See whether finitely many covering pieces always suffice.

Compact means closed and bounded together. An open end needs endless pieces near the gap. An endless stretch fails the same way. With both conditions, any cover shrinks to finitely many pieces.

For example, cover a desk completely with 📚 books. A finite desk needs only a few books. An endless desk would defeat any pile, however large.`,
      },
      tex: [
        String.raw`K \text{ compact } \iff K \text{ closed and bounded}`,
        String.raw`\forall\, \mathcal{U} \text{ open cover of } K\; \exists\, U_1,\dots,U_n \in \mathcal{U} : K \subseteq \bigcup_{k=1}^{n} U_k`,
        String.raw`(a_n) \subset K \Rightarrow \exists\, (a_{n_k}) \to x \in K`,
      ],
      prerequisites: ['closure'],
      controls: [
        { kind: 'select', key: 'set', label: { ko: '집합 K', en: 'Set K' }, options: ['closed', 'halfopen', 'unbounded'], init: 'closed' },
        { kind: 'slider', key: 'step', label: { ko: '유한 부분커버: 앞 k개', en: 'Finite subcover: first k' }, min: 0, max: 8, step: 1, init: 6 },
      ],
      problems: compactProblems,
    },
    {
      id: 'topologist-sine',
      title: { ko: '위상수학자의 사인 곡선', en: "Topologist's Sine Curve" },
      order: 6,
      summary: {
        ko: String.raw`위상수학자의 사인 곡선을 보는 씬입니다. 0 근처에서 끝없이 진동하는 곡선과, 거기에 붙는 극한 선분을 확인합니다.

곡선은 0에 다가갈수록 더 빠르게 흔들립니다. 그래서 반대쪽 축 위의 선분 전체가 곡선에 붙습니다. 붙은 도형은 하나로 이어져 있습니다. 하지만 선분에서 곡선으로 걸어가는 길은 없습니다. 이어져 있는 것과 길이 있는 것은 다릅니다.

예를 들면, 🧵 줄 한쪽 끝을 점점 빠르게 흔들어 보세요. 흔들리는 끝은 흐릿한 띠처럼 보입니다. 띠는 눈에 보여도, 띠의 한 점에서 줄의 특정 부분으로 걸어갈 수는 없습니다.`,
        en: String.raw`This scene draws the topologist's sine curve. Watch it oscillate endlessly near zero, and the limit segment it sticks to.

The closer to zero, the faster the curve wiggles. So a whole segment on the axis sticks to the curve. The combined figure is in one piece. Yet no path walks from the segment into the curve. Being in one piece and having a path are different things.

For example, shake one end of a 🧵 string faster and faster. The shaking end blurs into a band. The band is visible, but you cannot walk from one point of it onto a chosen part of the string.`,
      },
      tex: [
        String.raw`S = \{(x, \sin(1/x)) : x > 0\}, \quad \overline{S} = S \cup \bigl(\{0\} \times [-1,1]\bigr)`,
        String.raw`\overline{S} \text{ connected},\quad \overline{S} \text{ not path-connected}`,
      ],
      prerequisites: ['compact', 'closure'],
      controls: [
        { kind: 'slider', key: 'xMin', label: { ko: '왼쪽 끝 x', en: 'Left end x' }, min: 0.005, max: 1, step: 0.005, init: 0.05 },
        { kind: 'toggle', key: 'showSegment', label: { ko: '극한 선분 표시', en: 'Show limit segment' }, init: true },
        { kind: 'toggle', key: 'showSeq', label: { ko: '수열 표시', en: 'Show sequences' }, init: true },
      ],
      problems: topologistSineProblems,
    },
    {
      id: 'peano-curve',
      title: { ko: '페아노 곡선', en: 'Peano Curve' },
      order: 7,
      summary: {
        ko: String.raw`선 하나로 정사각형을 채우는 페아노 곡선을 보는 씬입니다. 근사 곡선이 단계마다 더 촘촘해지는 모습을 확인합니다.

곡선은 뱀처럼 접히며 빈틈을 메웁니다. 접는 횟수가 늘수록 곡선이 닿는 곳이 늘어납니다. 극한에서는 정사각형의 모든 점을 지납니다. 다만 같은 점을 두 번 지날 수밖에 없습니다. 그래서 단사인 채움은 불가능합니다.

예를 들면, ✏️ 연필을 떼지 않고 도화지 전체를 칠해 보세요. 지그재그로 촘촘히 오가면, 결국 모든 점에 연필이 닿습니다. 선 하나로 면 전체를 채우는 셈입니다.`,
        en: String.raw`This scene builds the Peano curve, one line filling a square. Watch the approximations grow denser at every stage.

The curve folds like a snake, filling the gaps. More folds mean more points touched. In the limit it passes through every point of the square. But it must visit some points twice. So no injective filling exists.

For example, color a whole sheet with a ✏️ pencil, never lifting it. Zigzag densely back and forth, and eventually every point is touched. One line fills an entire surface.`,
      },
      tex: [
        String.raw`\gamma_n \to \gamma \text{ uniformly},\quad \gamma : [0,1] \to [0,1]^2 \text{ continuous and onto}`,
        String.raw`\text{No continuous bijection } [0,1] \to [0,1]^2 \text{ exists}`,
      ],
      prerequisites: ['topologist-sine', 'uniform'],
      controls: [
        { kind: 'slider', key: 'order', label: { ko: '차수 n', en: 'Order n' }, min: 1, max: 4, step: 1, init: 2 },
        { kind: 'slider', key: 't', label: { ko: '매개변수 t', en: 'Parameter t' }, min: 0, max: 1, step: 0.001, init: 0.5 },
        { kind: 'toggle', key: 'showGrid', label: { ko: '격자 표시', en: 'Show grid' }, init: true },
      ],
      problems: peanoCurveProblems,
    },
    {
      id: 'metric-spaces',
      title: { ko: '거리공간', en: 'Metric Spaces' },
      order: 8,
      summary: {
        ko: String.raw`거리공간의 씬입니다. 거리를 공리로 세우면 공의 모양이 거리에 따라 어떻게 달라지는지 비교합니다.

거리는 세 가지 규칙만 지키면 됩니다. 거리는 음수가 되지 않습니다. 양방향 거리는 같습니다. 돌아가는 길은 지름길보다 짧지 않습니다. 규칙은 같아도 재는 법이 다르면, 같은 반지름의 공도 모양이 달라집니다.

예를 들면, 📏 자로 두 점 사이를 재는 법을 바꿔 보세요. 곧바로 재면 원이 됩니다. 가로세로로만 재면 마름모가 됩니다. 반지름이 같아도 닿는 범위의 모양은 달라집니다.`,
        en: String.raw`This scene axiomatizes distance. Compare how the shape of a ball changes when the metric changes.

A metric obeys only three rules. Distances are never negative. The distance is the same both ways. A detour is never shorter than the direct way. Same rules, different measurement: balls of equal radius take different shapes.

For example, change how a 📏 ruler measures between two points. Measure straight, and you get a disk. Measure along grid lines only, and you get a diamond. Same radius, different reach.`,
      },
      tex: [
        String.raw`d(x,y) \geq 0, \quad d(x,y) = 0 \iff x = y`,
        String.raw`d(x,y) = d(y,x), \quad d(x,z) \leq d(x,y) + d(y,z)`,
        String.raw`B(c, r) = \{x : d(x, c) < r\}`,
      ],
      prerequisites: ['closure'],
      controls: [
        { kind: 'select', key: 'metric', label: { ko: '거리', en: 'Metric' }, options: ['euclid', 'discrete', 'maxnorm'], init: 'euclid' },
        { kind: 'slider', key: 'r', label: { ko: '반지름 r', en: 'Radius r' }, min: 0.2, max: 2, step: 0.1, init: 1 },
      ],
      problems: metricSpacesProblems,
    },
    {
      id: 'contraction',
      title: { ko: '축소사상 원리', en: 'Contraction Mapping Principle' },
      order: 9,
      summary: {
        ko: String.raw`축소사상 원리를 확인하는 씬입니다. 반복할수록 점들이 하나의 고정점으로 조여드는 모습을 봅니다.

축소사상은 모든 거리를 일정 비율로 줄입니다. 반복하면 점들이 서로에게 끌려갑니다. 시작점이 어디든 도착지는 하나입니다. 그런데 공간에 구멍이 있으면, 도착지가 그 구멍으로 빠질 수 있습니다.

예를 들면, 🗺️ 지도를 반으로 접고, 또 반으로 접어 보세요. 접을 때마다 종이는 작아지고 모든 점은 한 점으로 모입니다. 그 점이 고정점입니다. 종이 한가운데가 찢겨 있으면, 모여야 할 점이 사라집니다.`,
        en: String.raw`This scene runs the contraction mapping principle. Iterate and watch the points tighten onto one fixed point.

A contraction shrinks every distance by one fixed ratio. Iterating pulls all points toward each other. Every start leads to the same destination. But if the space has a hole, the destination can fall into it.

For example, fold a 🗺️ map in half, then in half again. Each fold shrinks the paper, and all points gather toward one. That point is the fixed point. Tear a hole in the middle, and the gathering point is gone.`,
      },
      tex: [
        String.raw`d(Tx,Ty) \le q\,d(x,y), \quad 0 \le q < 1`,
        String.raw`d(x_n,x_m) \le \frac{q^n}{1-q}\,d(x_0,x_1), \qquad d(x_n,x^*) \le \frac{q^n}{1-q}\,d(x_1,x_0)`,
        String.raw`T(x) = x/2 \text{ on } (0,1]: \text{ contraction, no fixed point}`,
      ],
      prerequisites: ['metric-spaces', 'monotone-cauchy'],
      controls: [
        { kind: 'select', key: 'map', label: { ko: '사상 T', en: 'Map T' }, options: ['affine', 'half'], init: 'affine' },
        { kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 12, step: 1, init: 5 },
        { kind: 'slider', key: 'x0', label: { ko: '시작점 x₀', en: 'Start x₀' }, min: 0.1, max: 3, step: 0.1, init: 1 },
      ],
      problems: contractionProblems,
    },
    {
      id: 'baire-category',
      title: { ko: '베어 카테고리 정리', en: 'Baire Category Theorem' },
      order: 10,
      summary: {
        ko: String.raw`베어 범주 정리를 중첩 구간으로 따라가는 씬입니다. 유리수를 하나씩 피해 가면서도 남는 점이 있음을 확인합니다.

구멍 많은 집합은 전체를 덮지 못합니다. 닫힌 구간을 점점 작게 골라도, 피할 점을 피해 갈 수 있습니다. 구간이 한 점으로 조여들면, 그 점은 어떤 구멍 집합에도 속하지 않습니다. 완비한 공간에는 늘 그런 점이 남습니다.

예를 들면, 📦 상자 안에 작은 상자를 넣고, 그 안에 더 작은 상자를 넣어 보세요. 아무리 작아져도 맨 안쪽에는 공간이 남습니다. 유리수를 피해 가며 상자를 골라도, 끝까지 남는 점이 있습니다.`,
        en: String.raw`This scene follows the Baire category theorem through nested intervals. Dodge the rationals one by one, and a point still remains.

Sets full of holes cannot cover everything. Choose smaller and smaller closed intervals, each dodging the next bad point. The intervals tighten onto one point belonging to no hole set. A complete space always keeps such a point.

For example, put a 📦 box inside a box, then a smaller one inside that. However small it gets, room remains at the center. Choosing the boxes to dodge rationals still leaves one point standing.`,
      },
      tex: [
        String.raw`X = \bigcup_{n=1}^{\infty} E_n,\ \operatorname{int}(\overline{E_n}) = \varnothing \ \text{impossible if } X \text{ complete}`,
        String.raw`\overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k) \setminus \overline{E_{k+1}},\ r_{k+1} < r_k/2 \ \Longrightarrow\ x \in \bigcap_k \overline{B}(x_k, r_k),\ x \notin E_k\ \forall k`,
      ],
      prerequisites: ['metric-spaces', 'contraction'],
      controls: [
        { kind: 'slider', key: 'stage', label: { ko: '단계', en: 'Stage' }, min: 1, max: 14, step: 1, init: 6 },
      ],
problems: baireCategoryProblems,
    },
    {
      id: 'baire-1',
      title: { ko: '베어 1급 함수', en: 'Baire Class 1 Functions' },
      order: 11,
      summary: {
        ko: String.raw`베어 1급 함수를 보는 씬입니다. 연속함수들의 점별 극한으로 토매 함수를 쌓아 올립니다.

연속함수만 쌓아도 끊기는 함수가 나올 수 있습니다. 그래도 아무 데서나 끊기지는 않습니다. 연속인 점이 반드시 촘촘히 있습니다. 극한으로 만든 함수도 나름의 규칙을 지키는 셈입니다.

예를 들면, 🧵 줄을 구부려 점점 뾰족한 산 모양을 만들어 보세요. 매 단계의 줄은 끊기지 않았습니다. 그런데 다 구부린 끝에는, 가시처럼 뾰족한 점들이 줄줄이 남습니다.`,
        en: String.raw`This scene builds a Baire class 1 function. Thomae's function rises as a pointwise limit of continuous tent sums.

Stacking only continuous functions can still produce breaks. But the breaks cannot be everywhere. Points of continuity are always dense. Even a limit-made function keeps this much order.

For example, bend a 🧵 string into ever sharper mountain shapes. At every stage the string is unbroken. In the end, a row of thorn-like spikes remains.`,
      },
      tex: [
        String.raw`f_n(x) = \sum_{\substack{1 \le q \le n \\ \gcd(p,q)=1}} \frac{1}{q}\,\mathrm{tri}\!\left(n^3\left(x - \tfrac{p}{q}\right)\right) \to T(x)`,
        String.raw`\text{Baire-1 } f \ \Longrightarrow\ \text{continuity points} \supseteq \text{dense } G_\delta`,
      ],
      prerequisites: ['baire-category', 'continuity'],
      controls: [
        { kind: 'slider', key: 'N', label: { ko: '근사 단계 N', en: 'Approximation stage N' }, min: 2, max: 12, step: 1, init: 5 },
      ],
      problems: baireOneProblems,
    },
    {
      id: 'cantor',
      title: { ko: '칸토어 집합', en: 'Length Zero, Points Uncountable' },
      order: 12,
      summary: {
        ko: String.raw`칸토어 집합을 만드는 씬입니다. 가운데 3분의 1을 계속 지우면, 길이는 0이 되지만 점은 셀 수 없이 많이 남습니다.

지울 때마다 전체 길이는 3분의 2로 줄어듭니다. 끝없이 지우면 길이는 0이 됩니다. 그런데 한 번도 잘리지 않는 점이 있습니다. 그런 점이 실수만큼이나 많습니다.

예를 들면, 🍰 케이크의 가운데 3분의 1을 덜어 내 보세요. 남은 조각마다 또 가운데를 덜어 냅니다. 케이크는 거의 사라집니다. 그래도 한 번도 잘리지 않은 자리는 셀 수 없이 많이 남습니다.`,
        en: String.raw`This scene builds the Cantor set. Keep deleting middle thirds: the length dies to zero, yet uncountably many points survive.

Each deletion shrinks the total length to two-thirds. After infinitely many rounds, the length is zero. But some points are never cut away. There are as many of them as there are real numbers.

For example, cut the middle third out of a 🍰 cake. Then cut the middle of each remaining piece, again and again. The cake almost vanishes. Still, uncountably many spots were never touched by the knife.`,
      },
      tex: [String.raw`|C_n|=\left(\frac{2}{3}\right)^n\to 0`, String.raw`|C|=|\mathbb{R}|`],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: cantorProblems,
    },
    {
      id: 'fat-cantor',
      title: { ko: '팻 칸토어 집합', en: 'The Fat Cantor Set' },
      order: 13,
      summary: {
        ko: String.raw`팻 칸토어 집합을 보는 씬입니다. 가운데를 조금씩만 파내면, 길이가 절반이나 남는 집합이 됩니다.

파내는 양을 줄이면 사정은 달라집니다. 남는 집합은 여전히 구멍이 촘촘하고 내부가 비어 있습니다. 그런데 길이는 절반으로 수렴합니다. 길이라는 크기와 위상적인 크기는 서로 독립입니다.

예를 들면, 🍰 케이크를 파내되 이번에는 조금씩만 파 보세요. 구멍은 곳곳에 나지만, 먹을 부분은 절반이나 남습니다. 텅 빈 듯 보여도 양은 남아 있는 셈입니다.`,
        en: String.raw`This scene builds the fat Cantor set. Dig out only a little at each stage, and half the length survives.

Digging less changes the outcome. The remaining set is still full of holes, with empty interior. Yet its length converges to one half. Size by length and size by topology are independent.

For example, scoop a 🍰 cake again, but take only small bites. Holes appear everywhere, yet half the cake remains to eat. It looks empty, but the amount is real.`,
      },
      tex: [
        String.raw`\sum_{n\ge 1} 2^{n-1} 4^{-n} = \frac12`,
        String.raw`m(C) = \frac12,\quad \mathrm{int}\,C = \varnothing`,
      ],
      prerequisites: ['cantor'],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 7, step: 1, init: 4 }],
problems: fatCantorProblems,
    },
    {
      id: 'cantor-function',
      title: { ko: '칸토어 함수', en: 'The Cantor Function' },
      order: 14,
      summary: {
        ko: String.raw`칸토어 함수, 악마의 계단을 보는 씬입니다. 연속이고 계속 오르는데, 거의 모든 구간에서 평평합니다.

이 함수는 칸토어 집합의 틈마다 멈춰 섭니다. 그래서 거의 모든 점에서 기울기가 0입니다. 그런데도 전체로는 0에서 1까지 오릅니다. 오른 양과 기울기의 합이 어긋나는, 이상한 함수입니다.

예를 들면, 🪜 계단을 오르는데 평평한 계단참이 끝없이 긴 계단입니다. 거의 모든 시간을 쉬면서 가지만, 그래도 꼭대기에는 닿습니다. 칸토어 함수가 딱 그렇습니다.`,
        en: String.raw`This scene climbs the Cantor function, the Devil's staircase. It is continuous and always rising, yet flat on almost every interval.

The function pauses on every gap of the Cantor set. So its slope is zero at almost every point. And still it climbs from 0 to 1 overall. The total climb disagrees with the sum of slopes.

For example, climb a 🪜 staircase whose landings are endlessly long. You rest almost the whole way, yet you still reach the top. The Cantor function does exactly that.`,
      },
      tex: [
        String.raw`f(x) = \sum b_k 2^{-k},\quad b_k \in \{0,1\}\ \text{from the ternary expansion}`,
        String.raw`f(1) - f(0) = 1 \neq 0 = \int_0^1 f'`,
      ],
      prerequisites: ['cantor'],
      controls: [
        { kind: 'slider', key: 'stage', label: { ko: '칸토어 집합 단계 n', en: 'Cantor set stage n' }, min: 0, max: 7, step: 1, init: 4 },
      ],
      problems: cantorFunctionProblems,
    },
  ],
};
