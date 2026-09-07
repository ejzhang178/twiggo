# Twiggo — Design Spec

**Status**: Approved for implementation planning
**Date**: 2026-09-07
**Working name**: Twiggo (informal search found no direct conflicts as of
2026-09-07; a proper USPTO/legal clearance and domain check are still
recommended before public launch)

## Vision

A website that teaches machine learning concepts through one continuous,
scalable progression that a learner grows into across their entire life,
from age 6 through adult. There are no separate products per age group —
one world/mascot/story continues throughout — but the *shape* of the
progression changes as the learner grows up:

- **Ages 6-9**: a single linear trail (a world map with the mascot
  walking it), one level at a time, no branching. This is what v1 builds.
- **Beyond age 9**: the trail opens into a Duolingo-style **skill tree**
  — content organized into branching units, each unit made of several
  short, bite-sized, repeatable lessons, rather than one single line.
  This is a content-organization shift, not a retention-mechanics one:
  no streaks, hearts, or daily-goal systems are part of this vision —
  those require persistent accounts and are a separate concern (see
  below).

This spec covers **v1**: the first three levels of the ages 6-9 trail,
covering the core ML concepts of classification, training data, and
prediction. Everything beyond that (the post-9 skill tree, accounts,
backend persistence) is explicitly out of scope for v1, but the
architecture is built so it can be added without rework.

## Audience & Scope

- **v1 audience**: kids ages 6-9. Public site — anyone can access it.
- **Reading level**: assume some users are non-readers or early readers.
  Minimize text; rely on icons, color, and sound effects instead of
  narration or instructions the child must read.
- **Future scope (explicitly not v1)**: the post-9 skill tree (units of
  short lessons for tweens, teens, and adults); persistent accounts; a
  Supabase backend.

## Why no accounts / no backend in v1

Public + accounts + users under 13 triggers COPPA (US children's online
privacy law): verifiable parental consent, a privacy policy, no
behavioral ads/trackers, data minimization, and parent tooling to review
or delete a child's data. This is real, necessary scope — but it's
separable from whether the games themselves are fun and educational.

Decision: ship v1 with **no accounts and no backend**. Progress
(which level you're on) lives only in in-page state for the current
visit — nothing is saved between visits. Accounts, persistent
progress, and COPPA-compliant consent flows are a deliberate, clearly
separate future sub-project, designed once the games are validated.

## Architecture

A single static website — plain HTML/CSS/JavaScript, no build step, no
framework, no backend. Three drag-and-drop mini-games don't need a
framework or game engine; a framework becomes worth reconsidering only
once the path has grown to many more levels and/or accounts are added.

The site has two screens:

1. **World map** — a visual trail with the mascot standing on it. Level
   nodes appear along the trail. Completed nodes show a checkmark;
   the next available node is clickable/highlighted; nodes beyond what's
   been built don't render.
2. **Level screen** — one per level, a focused mini-game teaching a
   single concept, ending in a short celebration and returning to the
   map with the next node unlocked.

### Scalability: levels as data, not pages

The map is generated from a level registry rather than hand-built. This
is the key mechanism that makes "many more levels later" cheap:

```js
// levels.js
const levels = [
  { id: 1, title: "Sort the Fruit",   concept: "classification",   module: "level-1-classification" },
  { id: 2, title: "Teach the Guide",  concept: "training-data",    module: "level-2-training" },
  { id: 3, title: "Guess What's Next", concept: "prediction",      module: "level-3-prediction" },
  // future levels append here — map/nav code never changes
];
```

The world map renders itself from this array. Adding level 4 means
adding one registry entry plus one new self-contained level module —
never touching map or navigation code. Each level's game logic is
isolated in its own file so levels don't entangle each other as the
path grows.

A flat array is the ages 6-9 trail's shape (one line, no branching) —
it's also the simplest case of a tree. When the path later opens into
the post-9 skill tree, each entry gains a `unit` and `prerequisites`
field so levels can group into units and units can branch/gate on each
other, without changing how any individual level module works or how
levels 1-3 are defined today.

### Path to a future backend

Progress is currently just "index into the levels array," held in page
memory. A future backend (once accounts/COPPA work is built) persists
exactly that same shape per-user — `{ userId, currentLevelId,
completedLevelIds }` — so v1's data model doesn't need to change, only
where it's stored (memory now, database later). The backend is an
addition underneath the existing static frontend, not a rewrite of it.

**Planned backend: Supabase.** Chosen for when accounts/persistence
are built — Postgres database, built-in auth, and a client SDK that
drops into a static frontend without needing a custom server. This is
a decision for the future sub-project, not something v1 sets up.

## The Mascot

One custom illustrated character (AI-generated art) who lives on the map
and appears in every level — the visual constant across the whole
progression, from the ages 6-9 trail through the skill tree it later
opens into for older learners. v1 needs four poses:

- **Idle** — standing on the map
- **Thinking/learning** — during the training level
- **Happy/correct** — celebration reactions
- **Oops/wrong** — funny-not-discouraging wrong-guess reactions

Everything else in the games (fruit, bins, buttons, UI chrome) uses
simple shapes and emoji rather than custom art — only the mascot is
bespoke, keeping the site feeling branded without an art budget.

## v1 Levels

### Level 1 — Classification ("Sort the Fruit")
The child drags fruit icons into bins by a shared rule (color or
shape). Teaches: things can be grouped by shared features.

### Level 2 — Training Data ("Teach the Guide")
The child sorts a handful of example fruit into bins themselves,
providing "training examples" the mascot visibly learns from. Teaches:
a machine learns from the examples you give it — more/better examples
teach it better.

### Level 3 — Prediction ("Guess What's Next")
New, unseen fruit appears; the mascot guesses the bin based on what it
learned in level 2, and the child sees whether it's right — including
occasional funny mistakes. Teaches: a trained model predicts on new
things it hasn't seen, and it can be wrong.

Each level ends with a short celebration (animation + sound) and
unlocks the next map node.

## Audio & Accessibility

Sound effects (dings, pops) and icon-driven cues carry instructions
instead of text or narration, so non-readers can play unassisted.
Drag-and-drop must work with both mouse and touch input (tablet use is
expected for this age group).

## File Structure

```
/
  index.html          # world map screen
  styles.css
  main.js              # renders map from levels.js, handles navigation
  levels.js            # level registry
  /levels
    level-1-classification.{html,js}
    level-2-training.{html,js}
    level-3-prediction.{html,js}
  /assets
    mascot-idle.png, mascot-thinking.png, mascot-happy.png, mascot-oops.png
    sounds/ (ding.mp3, pop.mp3, ...)
```

## Testing

No automated test suite for a project this size. Verification is
manual, in-browser: play each level end-to-end, confirm drag-and-drop
works with both mouse and touch, confirm level unlock/completion state
updates correctly on the map, confirm audio/animations fire as
expected.

## Hosting

GitHub Pages — free, simple `git push`-based deploys, well suited to a
static site with no backend.

## Explicitly Out of Scope for v1

- Levels beyond the first 3
- The post-9 skill tree (units, branching, lessons for tweens/teens/adults)
- Accounts, login, or any persistent save
- Backend/database of any kind
- COPPA consent flow, privacy policy, parental controls
- Streaks, hearts, XP, or other retention/gamification mechanics
- Automated tests
