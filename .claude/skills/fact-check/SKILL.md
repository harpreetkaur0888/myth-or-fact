---
name: fact-check
description: Verify claims and sources in a draft card file. Searches the web for current evidence and flags weak or wrong verdicts.
---

# Fact Check

1. Take the file path from $ARGUMENTS, or ask which draft to check.
2. For each card: read claim/verdict/source, search the web for current
   evidence, verify the source supports the claim.
3. Flag cards where:
   - Source is older than 5 years on a fast-moving topic
   - Dominant-answer call goes the wrong way
   - Source doesn't support the claim
   - Counter-evidence has emerged since the source was published
   - Claim is genuinely 50/50 — recommend rejection (don't ship coin-flips)
4. Output per-card status: OK / NEEDS REVISION / REJECT, with proposed fix.
5. Do not modify the file. Produce the report only.
