import { startChapter } from '../../shell/app';
import { loaders } from './loaders';

/** The exercises data loads lazily: the dynamic import keeps the exercise text out of the chapter entry bundle until the exercises page is visited. The problems data loads lazily the same way, on the first scene view. */
startChapter('proofs', loaders, () => import('./exercises').then((module) => module.exercises), () => import('./problems').then((module) => module.problemsByScene));
