import type { SceneModel } from '../../../contracts';

/**
 * The Cantor set stages: start from [0,1], delete the open middle third of
 * every interval, repeat. Total length at stage n is (2/3)^n → 0, while the
 * surviving points are uncountable. Pure computation: no DOM, d3, or three.
 */

export const MAX_STAGE = 8;

export interface CantorInterval {
  l: number;
  r: number;
}

export interface CantorData {
  stage: number;
  /** Every stage from 0 up to the current one, for the stacked figure. */
  stages: CantorInterval[][];
  /** Total length at the current stage: (2/3)^stage. */
  totalLength: number;
}

export function cantorStages(upto: number): CantorInterval[][] {
  const stages: CantorInterval[][] = [[{ l: 0, r: 1 }]];
  for (let s = 1; s <= upto; s++) {
    const prev = stages[s - 1];
    if (prev === undefined) break;
    const next: CantorInterval[] = [];
    for (const { l, r } of prev) {
      const third = (r - l) / 3;
      next.push({ l, r: l + third }, { l: r - third, r });
    }
    stages.push(next);
  }
  return stages;
}

export const cantorModel: SceneModel<CantorData> = {
  compute(state) {
    const raw = Number(state['stage']);
    const stage = Number.isFinite(raw) ? Math.min(MAX_STAGE, Math.max(0, Math.floor(raw))) : 4;
    const stages = cantorStages(stage);
    const current = stages[stage] ?? [];
    return { stage, stages, totalLength: current.length * (1 / 3) ** stage };
  },
};
