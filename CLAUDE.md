# CLAUDE.md — figma2ui Project Instruction for Muse Code

> This file is the single source of truth for Claude Code. Read this first.

## 1. Project: figma2ui

**One-liner:** Figma to shadcn/ui, perfectly. No div soup.

**Problem:** Existing tools (Anima, Locofy) output `<div style="background: #3B82F6">` hell.
**Solution:** We parse user's own `components/ui/button.tsx` AST and map Figma fills to `variant="default|destructive|..."`

**Org:** https://github.com/figma2ui
- `.github` repo: org profile README (public, already deployed)
- `brain` repo: core mapping engine (this repo)
- `plugin` folder (in /mnt/data/figma2ui-plugin.zip): Figma plugin MVP wrapper

Built in Seongnam, South Korea. Solo founder + AI.

## 2. Tech Stack

- Language: TypeScript (ESM)
- Runtime: Node 20+, Figma Plugin API 1.0
- Key Libs: `octokit` for GitHub PR, Figma Plugin Typings
- No heavy ML yet — heuristic mapping first, then cva parser.

## 3. Current File Structure (in `brain` repo)

```
brain/
├── src/
│   ├── parseShadcnRepo.ts   # parses components/ui/*.tsx -> { name, variants }
│   ├── figmaToShadcnMapper.ts # CORE: FigmaNode -> { code, confidence }
│   └── githubPR.ts          # Octokit: create branch + PR with mapped code
├── package.json
└── README.md
```

## 4. Core Logic (IMPORTANT)

In `figmaToShadcnMapper.ts`:

```ts
class FigmaToShadcnMapper {
  map(node: FigmaNode): MappedCode
  inferVariant(node): 'default' | 'destructive' | 'ghost' ...
}
```

- Input: FigmaNode { id, type, name, fills[{color:{r,g,b}, opacity}], cornerRadius, characters }
- Output: { component: 'Button', code: '<Button variant="...">', confidence: 0.95 }

Heuristics:
- name includes 'button' OR cornerRadius > 4 -> Button
- fills[0] color red-ish -> destructive, opacity <0.2 -> ghost
- FRAME + name includes 'card' -> Card
- name includes 'input' -> Input
- Fallback -> <div className="...">

`parseShadcnRepo.ts` is placeholder. Real version should parse cva() calls via ts-morph or simple regex to extract variants.

## 5. What is DONE

- [x] GitHub org figma2ui created
- [x] Logo (figma2ui_logo_400.png) uploaded to org
- [x] .github/profile/README.md deployed -> shows on github.com/figma2ui
- [x] brain repo deployed with 4 files
- [x] Figma plugin MVP (manifest.json + code.ts + ui.html) zipped

## 6. What to DO NEXT (Priority Order for Claude Code)

You are in `brain` repo. Work on this order:

### TASK 1: Make parseShadcnRepo real
Current is mock. Make it real:
- Use `ts-morph` or regex to parse `components/ui/button.tsx` which uses `cva({ variants: { variant: { default, destructive, ... } } })`
- Input: path to user's repo (clone or local)
- Output: accurate variants list
- Add test: __tests__/parseShadcnRepo.test.ts with sample button.tsx

### TASK 2: Improve FigmaToShadcnMapper
- Add support for: Card, Dialog, Badge, Input, Textarea, Avatar
- Add Tailwind class inference: padding, gap, borderRadius from Figma layout
- Add confidence scoring better than fixed 0.95
- Add __tests__/mapper.test.ts

### TASK 3: Connect Figma Plugin to Brain
- Create `plugin/` folder in brain repo, copy manifest + code.ts + ui.html from plugin zip
- Build step: `npm run build:plugin` -> compiles code.ts -> code.js
- ui.html should import brain as npm package (@figma2ui/brain) instead of duplicated logic

### TASK 4: GitHub PR Full Flow
- `githubPR.ts` currently creates file via createOrUpdateFileContents. Change to proper Git tree API (create tree, commit, ref)
- Add support for multiple files, visual diff comment
- Add CLI: `npx figma2ui --figma-url <url> --repo <owner/repo>`

### TASK 5: Landing Page (optional)
- `www/` Next.js app with shadcn, hero "Figma to shadcn/ui, perfectly", interactive demo from /mnt/data/perfect_sh_mapping_engine_agentic_artifact_1_d8e829e027d7.html

## 7. Coding Rules for Claude Code

- Keep it simple. No over-engineering. Heuristic > ML for now.
- All code in TypeScript, ESM, no CommonJS.
- Write small, testable functions.
- When you edit, run `npm run build` to check types.
- Commit messages: `feat: ...`, `fix: ...`, `chore: ...`
- English only: code, comments, docs, and commit messages. No Korean anywhere in the repo.
- Don't touch .github repo unless asked.

## 8. How to Run

```bash
npm install
npm run dev # runs figmaToShadcnMapper demo
```

For Figma plugin:
1. Open Figma Desktop
2. Plugins > Development > Import plugin from manifest
3. Select plugin/manifest.json

## 9. Founder Note

Founder is Korean (Seongnam), uses Korean primarily. Everything committed to the repo must be in English (see Coding Rules).

He wants to go fast, ship Figma plugin first to get 100 users, then landing page for investors.

Don't give rosy talk. Give brutal feedback + working code.

---

END OF CLAUDE.md — Start working from TASK 1.