# Problem types

Every scene problem (`ProblemMeta`) and chapter exercise (`ExerciseMeta`) is
authored in one of four templates, selected by the optional `kind` field.
The renderers (scene page, exercises page, and the prerender) all read the
same fields, so a tagged item looks consistent everywhere. Absent `kind`
means `proof`, and every pre-existing item keeps rendering exactly as
before.

| kind | When to use it | Extra fields |
| --- | --- | --- |
| `proof` | The default: prove a statement. | — |
| `compute` | The solution is a calculation with one definite final value. | `answer` |
| `counterexample` | "True or false?" items whose claim is false: give the verdict and a counterexample. | `verdict` |
| `concept` | A definition/concept check answered by picking one of 3-4 options. | `choices`, `correctIndex`, `explanation` |

All text fields are `LocalizedText` (`{ ko, en }`) and may embed `\(...\)`
inline TeX, like the statement itself.

## Rendering contract

- **proof** — statement, mini visualization, proof/solution folded in a
  `<details>` toggle. No badge.
- **compute** — the proof rendering, plus a highlighted **answer box**
  after the folded solution showing `answer` (the final value only; the
  derivation stays in the proof steps).
- **counterexample** — a kind badge, a prominent **verdict box** under the
  statement (`verdict`, e.g. "The claim is false."), and the proof steps
  framed as the counterexample construction and its verification.
- **concept** — a kind badge and an interactive check instead of the folded
  proof: the reader picks one of `choices`; the UI immediately marks the
  correct option (and the picked one, when wrong) and reveals `explanation`.
  The state is ephemeral DOM state only — nothing is stored. On the
  prerendered page (no JS) the choices appear as a plain list and the
  explanation, led by the correct option, sits in a `<details>`.
  The `proof`/`solution` field is still required by the type: keep the
  rigorous justification there; it backs the explanation and the catalog
  invariants, even though the concept rendering does not fold it out.

Non-proof kinds also get a small type badge chip on the card.

## Skeletons

Scene problem (`ProblemMeta`):

```ts
// proof (the default — no kind field)
{
  id: 'my-problem',
  statement: { ko: String.raw`...`, en: String.raw`...` },
  preset: { /* control values */ },
  presetCaption: { ko: String.raw`...`, en: String.raw`...` },
  proof: [
    { text: { ko: String.raw`...`, en: String.raw`...` } },
  ],
}

// compute
{
  id: 'my-computation',
  kind: 'compute',
  statement: { ko: String.raw`...`, en: String.raw`...` },
  preset: { /* control values */ },
  presetCaption: { ko: String.raw`...`, en: String.raw`...` },
  proof: [
    { text: { ko: String.raw`...`, en: String.raw`...` } },
  ],
  answer: { ko: String.raw`\(...\)`, en: String.raw`\(...\)` },
}

// counterexample
{
  id: 'my-counterexample',
  kind: 'counterexample',
  statement: { ko: String.raw`참인가, 거짓인가: ...`, en: String.raw`True or false: ...` },
  preset: { /* control values */ },
  presetCaption: { ko: String.raw`...`, en: String.raw`...` },
  verdict: {
    ko: String.raw`이 명제는 거짓이다 — 아래 반례가 성립하지 않음을 보인다.`,
    en: String.raw`The claim is false — the counterexample below breaks it.`,
  },
  proof: [
    // Step 1: present the counterexample. Step 2+: verify it breaks the claim.
    { text: { ko: String.raw`...`, en: String.raw`...` } },
  ],
}

// concept
{
  id: 'my-concept-check',
  kind: 'concept',
  statement: { ko: String.raw`...`, en: String.raw`...` },
  preset: { /* control values */ },
  presetCaption: { ko: String.raw`...`, en: String.raw`...` },
  choices: [
    { ko: String.raw`...`, en: String.raw`...` },
    { ko: String.raw`...`, en: String.raw`...` },
    { ko: String.raw`...`, en: String.raw`...` },
  ],
  correctIndex: 0,
  explanation: {
    ko: String.raw`... (왜 정답인지, 왜 나머지는 틀렸는지)`,
    en: String.raw`... (why the answer is right and the others are wrong)`,
  },
  proof: [
    { text: { ko: String.raw`...`, en: String.raw`...` } },
  ],
}
```

Chapter exercise (`ExerciseMeta`): same `kind` fields; replace
`preset`/`presetCaption`/`proof` with the exercise shape
(`difficulty`, `topics`, optional `viz`, `solution`).

## Authoring rules

- `compute`: `answer` must be the value the solution actually derives —
  copy it from the last step, and re-verify the arithmetic.
- `counterexample`: the statement must pose a claim that is actually
  false, `verdict` says so in one line, and the proof steps must first
  present the counterexample concretely, then verify it violates the
  claim. Do not tag a true claim as a counterexample.
- `concept`: 3-4 choices, exactly one correct. Each distractor must be
  wrong for a reason the `explanation` states. Keep the wording
  unambiguous — if two options could be defended, rewrite them.
