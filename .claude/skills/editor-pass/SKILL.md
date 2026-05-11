---
name: editor-pass
description: Editorial review of a draft card file for tone, reading level, and content principle violations.
---

# Editor Pass

1. Take the file path from $ARGUMENTS, or ask which draft.
2. Read CLAUDE.md for tone and content principles.
3. For each card:
   - Tighten claim to under 15 words, confident statement
   - Check explanation reads at grade 7-8 level
   - For close-call verdicts, verify the wrinkle is acknowledged in one
     clean sentence (not buried, not absent)
   - Flag preachy, smug, shaming tone
   - Flag fear-based health framing or good/bad food language
   - Flag cultural insensitivity
   - Suggest sharper opening if dry
4. Produce a per-card diff. After user approval, apply changes.
5. Print final pass/fail per card.
