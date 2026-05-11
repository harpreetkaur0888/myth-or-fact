---
name: generate-cards
description: Generate a batch of myth-or-fact cards for a category. Outputs draft cards to content/drafts/ for fact-checking and editor review.
---

# Generate Cards

1. Ask which category and how many cards (default: 15).
2. Check content/cards/<category>.yaml if it exists to avoid duplicates.
3. Aim per batch of 15:
   - Verdicts: 7-8 myths, 7-8 facts (binary)
   - Difficulty: 6 easy, 6 medium, 3 hard
4. For nuanced claims, pick the DOMINANT verdict; address the wrinkle in
   the explanation. Do not avoid these — they make the best cards.
5. For health, nutrition, or recent-history claims, search the web to verify
   before writing the verdict.
6. Use the schema in content/card-schema.json. Each card needs:
   id, claim (under 15 words), verdict, explanation (50-400 chars),
   source (name + year + optional url), category, difficulty, tags (3-5),
   optional nuance (low/medium/high).
7. Write the batch to content/drafts/<category>-<YYYY-MM-DD>.yaml.
8. Print summary: verdict count, difficulty count, any close-call cards.

Then remind the user to run /fact-check and /editor-pass.

Use $ARGUMENTS for category name if provided, otherwise ask.
