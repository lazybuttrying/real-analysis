/**
 * Semantic search vectors, generated offline from the search index
 * (see the embedding tool): one int8-quantized embedding per search
 * document — every scene (title and summary) followed by every
 * glossary term (term and definition), in the search index's order.
 * Pure data and math: no DOM, no model runtime. The query embedding is
 * produced by the shell's semantic engine and scored here.
 */

export interface SearchVectorsData {
  model: string;
  dim: number;
  sceneCount: number;
  termCount: number;
  /** Per-vector int8 quantization scale. */
  scales: number[];
  /** Base64 of (sceneCount + termCount) * dim signed bytes. */
  data: string;
}

/** Decodes and L2-normalizes every stored vector. */
export function decodeSearchVectors(data: SearchVectorsData): Float32Array[] {
  const binary = atob(data.data);
  const bytes = new Int8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i) << 24 >> 24;
  const { dim, scales } = data;
  const count = data.sceneCount + data.termCount;
  const vectors: Float32Array[] = [];
  for (let v = 0; v < count; v++) {
    const vec = new Float32Array(dim);
    const scale = scales[v] ?? 1;
    let norm = 0;
    for (let d = 0; d < dim; d++) {
      const value = (bytes[v * dim + d] ?? 0) * scale;
      vec[d] = value;
      norm += value * value;
    }
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dim; d++) vec[d] = (vec[d] ?? 0) / norm;
    vectors.push(vec);
  }
  return vectors;
}

export interface SemanticScore {
  /** Position in the decoded vector array: scenes first, then terms. */
  index: number;
  score: number;
}

/**
 * Ranks every document vector against a normalized query vector by
 * cosine similarity, best first, keeping scores at or above
 * `minScore`, at most `limit` entries.
 */
export function rankSemantic(
  vectors: readonly Float32Array[],
  queryVector: ArrayLike<number>,
  minScore: number,
  limit: number,
): SemanticScore[] {
  const scored: SemanticScore[] = [];
  for (let i = 0; i < vectors.length; i++) {
    const vec = vectors[i];
    if (!vec || vec.length !== queryVector.length) continue;
    let dot = 0;
    for (let d = 0; d < vec.length; d++) dot += (vec[d] ?? 0) * (queryVector[d] ?? 0);
    if (dot >= minScore) scored.push({ index: i, score: dot });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
