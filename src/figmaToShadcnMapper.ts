import { ShadcnComponent } from './parseShadcnRepo.js';

export type FigmaNode = {
  id: string;
  type: 'FRAME' | 'COMPONENT' | 'RECTANGLE' | 'TEXT' | 'INSTANCE';
  name: string;
  fills?: { color: { r:number,g:number,b:number }, opacity?: number }[];
  cornerRadius?: number;
  characters?: string;
};

export type MappedCode = {
  component: string;
  code: string;
  confidence: number;
};

/**
 * CORE BRAIN: Figma Node -> shadcn/ui code
 * Why Anima produces div soup: it hardcodes Figma fills as inline styles
 * We map them to shadcn tokens instead
 */
export class FigmaToShadcnMapper {
  constructor(private designSystem: ShadcnComponent[]) {}

  map(node: FigmaNode): MappedCode {
    const lowerName = node.name.toLowerCase();

    // 1. Button heuristic
    if (lowerName.includes('button') || lowerName.includes('btn') || node.cornerRadius && node.cornerRadius > 4) {
      const buttonDef = this.designSystem.find(c => c.name === 'Button');
      const variant = this.inferVariant(node);
      return {
        component: 'Button',
        code: `<Button variant="${variant}">${node.characters || node.name}</Button>`,
        confidence: 0.95
      };
    }

    // 2. Card
    if (node.type === 'FRAME' && lowerName.includes('card')) {
      return {
        component: 'Card',
        code: `<Card><CardContent>${node.name}</CardContent></Card>`,
        confidence: 0.9
      };
    }

    // 3. Input
    if (lowerName.includes('input') || node.type === 'TEXT') {
      if (lowerName.includes('input')) {
        return {
          component: 'Input',
          code: `<Input placeholder="${node.name}" />`,
          confidence: 0.85
        };
      }
    }

    // fallback: div -> but with Tailwind, not style={}
    return {
      component: 'div',
      code: `<div className="rounded-lg p-4">${node.name}</div>`,
      confidence: 0.5
    };
  }

  private inferVariant(node: FigmaNode): string {
    // Figma fill color -> shadcn variant
    const fill = node.fills?.[0];
    if (!fill) return 'default';
    const { r, g, b } = fill.color;
    // Rough heuristic: blue-ish = default, red = destructive, transparent = ghost/outline
    if (r > 0.8 && g < 0.3 && b < 0.3) return 'destructive';
    if (fill.opacity && fill.opacity < 0.2) return 'ghost';
    if (r > 0.2 && r < 0.4 && g > 0.5 && b > 0.8) return 'default'; // blue
    return 'secondary';
  }
}

// Demo run
if (import.meta.url === `file://${process.argv[1]}`) {
  const mapper = new FigmaToShadcnMapper([
    { name: 'Button', variants: ['default','destructive','outline','secondary','ghost','link'], filePath: '' }
  ]);
  console.log(mapper.map({ id: '1', type: 'RECTANGLE', name: 'Primary Button', fills: [{ color: { r: 0.3, g: 0.6, b: 0.9 }}], cornerRadius: 8, characters: 'Get Started' }));
}