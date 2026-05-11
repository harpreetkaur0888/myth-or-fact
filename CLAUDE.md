# Myth or Fact

A swipe-based PWA game for ages 12+ where players sort claims into MYTH or
FACT, then see a verdict with a short evidence-based explanation. Inspired
by Masala Lab's myth-busting style.

## Stack
- Vite + React + TypeScript (strict mode)
- Tailwind v4 for styling (via @tailwindcss/vite plugin; no tailwind.config.js, no postcss.config.js)
- Framer Motion for swipe gestures
- Zustand for session state
- vite-plugin-pwa for installable PWA
- Deployed to Vercel; every push auto-deploys
- Cards: YAML in /content/cards, validated by /content/card-schema.json

## Architecture rules
- Cards are static, loaded at build time via Vite's import.meta.glob
- One file per category in /content/cards
- All card edits go through scripts/validate-cards.ts before commit
- Components stay presentational; loading lives in src/data/
- Mobile-first: design for 380px viewport

## Verdict system: BINARY
- Cards are MYTH or FACT. No third option, no IT_DEPENDS.
- For nuanced claims: pick the DOMINANT answer, address the wrinkle in the
  explanation. Example: "Carrots improve your eyesight" -> MYTH, with
  explanation noting vitamin A really does matter for vision in deficient
  populations.
- The swipe is for commitment. Nuance lives in the reveal panel.

## Content principles (apply to every card)
- Reading level: grade 7-8. Short sentences, plain language.
- Tone: curious and warm, never smug or shaming. No "actually..." energy.
- Every verdict cites a credible source — peer-reviewed paper, government
  health body (WHO, FDA, FSSAI, USDA), established encyclopedia, or
  recognized expert publication (Cochrane, BMJ, Nature, Smithsonian,
  McGill OSS, BBC Future).
- Search the web to verify any health, nutrition, or recent-history claim
  before writing the verdict.
- No fear-based health framing. No good food / bad food. No diet talk.
- No specific brand names or living public figures.
- Cultural respect: debunk the science, never the tradition. Many food
  myths come from real practices — the practice may have value even if
  the stated mechanism is wrong.
- Surprise quotient: prefer claims where the answer flips intuition.

## Style samples (the voice we're aiming for)
- MYTH: "MSG causes headaches in most people." Decades of double-blind
  trials have failed to link MSG to headaches in the general population.
  The "Chinese Restaurant Syndrome" panic was based on a single 1968
  anecdotal letter, not a study. A small minority report sensitivity, but
  the effect disappears in blinded tests.
- MYTH: "Vikings wore horned helmets in battle." No archaeological dig has
  ever produced one. The image was popularized by 19th-century opera
  costumes and stuck. Real Viking helmets were simple iron caps.
- MYTH: "Carrots improve your eyesight." (nuance: high) The story was
  British WWII propaganda to hide radar technology, and it stuck. Carrots
  have vitamin A, which your eyes do need — but if you already get enough,
  more won't sharpen your vision.

## Workflows
- New cards: /generate-cards -> /fact-check -> /editor-pass -> promote
- Before any commit touching /content: run `npm run validate:cards`
- Deploy: git push to main auto-deploys to Vercel

## Don't
- Don't invent sources or paraphrase from memory on contested topics
- Don't write cards directly into content/cards/ — always go through drafts/
- Don't reintroduce IT_DEPENDS — nuance belongs in explanations
- Don't bypass the schema validator
