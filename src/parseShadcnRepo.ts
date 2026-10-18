import fs from 'fs';
import path from 'path';

/**
 * figma2ui/brain - parseShadcnRepo
 * Parses components/ui/*.tsx in a shadcn/ui repo to extract design system tokens
 * e.g. Button variants, sizes
 */
export type ShadcnComponent = {
  name: string;
  variants: string[];
  filePath: string;
};

export function parseShadcnRepo(repoPath: string): ShadcnComponent[] {
  const uiPath = path.join(repoPath, 'components', 'ui');
  if (!fs.existsSync(uiPath)) {
    console.warn(`[figma2ui] ${uiPath} not found, using mock`);
    return [
      { name: 'Button', variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], filePath: 'components/ui/button.tsx' },
      { name: 'Card', variants: ['default'], filePath: 'components/ui/card.tsx' },
      { name: 'Input', variants: ['default'], filePath: 'components/ui/input.tsx' },
    ];
  }

  const files = fs.readdirSync(uiPath);
  return files.filter(f => f.endsWith('.tsx')).map(f => {
    const content = fs.readFileSync(path.join(uiPath, f), 'utf-8');
    // super simple AST-like parse: variant = cva({ variants: { variant: { ... } } })
    const variantMatches = [...content.matchAll(/variant:\s*\{([^}]+)\}/g)];
    const variants = variantMatches.length ? 
      [...content.matchAll(/"(default|destructive|outline|secondary|ghost|link)"/g)].map(m => m[1]) 
      : ['default'];
    return {
      name: f.replace('.tsx','').replace(/^[a-z]/, c => c.toUpperCase()),
      variants: [...new Set(variants)],
      filePath: `components/ui/${f}`
    }
  });
}