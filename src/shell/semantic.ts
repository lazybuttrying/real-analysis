import type { Lang } from '../contracts.ts';
import { decodeSearchVectors, type SearchVectorsData } from '../search-vectors.ts';

/**
 * Lazy semantic-search engine. Two costs are paid only when a visitor
 * actually searches, never on page load:
 * - the per-language document vectors (about 190 KB, static file), and
 * - the multilingual-e5-small model (about 113 MB quantized), loaded
 *   from public CDNs into the browser cache on first use.
 * If either fails (offline, blocked CDN), search stays keyword-only.
 */

const TRANSFORMERS_CDN = 'https://esm.run/@xenova/transformers@2.17.2';
const MODEL_ID = 'Xenova/multilingual-e5-small';

interface Extractor {
  (texts: string[], options: { pooling: 'mean'; normalize: boolean }): Promise<{ tolist(): number[][] }>;
}

interface TransformersModule {
  env: { allowLocalModels: boolean };
  pipeline(task: string, model: string, options: { quantized: boolean }): Promise<Extractor>;
}

let extractorPromise: Promise<Extractor> | null = null;
const vectorsCache = new Map<Lang, Promise<Float32Array[] | null>>();

function loadExtractor(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const mod = (await import(/* @vite-ignore */ TRANSFORMERS_CDN)) as unknown as TransformersModule;
      mod.env.allowLocalModels = false;
      return mod.pipeline('feature-extraction', MODEL_ID, { quantized: true });
    })();
  }
  return extractorPromise;
}

/** Document vectors for one language, decoded and normalized; null on failure. */
export function loadSearchVectors(base: string, lang: Lang): Promise<Float32Array[] | null> {
  let pending = vectorsCache.get(lang);
  if (!pending) {
    pending = (async () => {
      try {
        const response = await fetch(`${base}search-vectors.${lang}.json`);
        if (!response.ok) throw new Error(`search vectors: ${response.status}`);
        const data = (await response.json()) as SearchVectorsData;
        return decodeSearchVectors(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    })();
    vectorsCache.set(lang, pending);
  }
  return pending;
}

/** Embeds one query with the e5 'query: ' prefix; null on failure. */
export async function embedQuery(query: string): Promise<Float32Array | null> {
  try {
    const extractor = await loadExtractor();
    const out = await extractor([`query: ${query}`], { pooling: 'mean', normalize: true });
    const rows = out.tolist();
    const row = rows[0];
    if (!row) return null;
    return Float32Array.from(row);
  } catch (error) {
    console.error(error);
    return null;
  }
}
