import { startChapter } from '../../shell/app';
import { loaders } from './loaders';

/** The exercises data loads lazily: the dynamic import keeps the exercise text out of the chapter entry bundle until the exercises page is visited. */
startChapter('power-series', loaders, () => import('./exercises').then((module) => module.exercises));
