# figma2ui/brain — The Mapping Engine

> **Anima outputs `<div style="">`. We output `<Button variant="default">`.**

Figma-Context-MCP (MIT) extracts raw Figma nodes.
Our brain maps them to **your** actual shadcn/ui components.

### Demo

```ts
import { FigmaToShadcnMapper } from './src/figmaToShadcnMapper'

const mapper = new FigmaToShadcnMapper(designSystem)
mapper.map({ name: 'Primary Button', fills: [...], cornerRadius: 8 })
// -> <Button variant="default">Primary Button</Button>  // 95% confidence
```

### Why this wins

- No `style={{ background: '#3B82F6' }}` -> Only `variant`
- Reads your `components/ui/button.tsx` AST to learn your system
- Auto PR: Figma -> GitHub PR in one click

### Structure

- `src/parseShadcnRepo.ts` — parses your shadcn repo
- `src/figmaToShadcnMapper.ts` — core heuristic (soon ML)
- `src/githubPR.ts` — Octokit PR creation

### Roadmap

- [ ] Visual diff QA
- [ ] Figma Plugin wrapper
- [ ] CLI: `npx figma2ui`

Built in Seongnam, for the world.