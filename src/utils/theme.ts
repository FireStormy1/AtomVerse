import { ElementCategory } from '../types/element';

export const getCategoryColor = (category: ElementCategory) => {
  switch (category) {
    case 'Alkali Metal': return 'hsl(var(--color-alkali))';
    case 'Alkaline Earth Metal': return 'hsl(var(--color-alkaline))';
    case 'Transition Metal': return 'hsl(var(--color-transition))';
    case 'Halogen': return 'hsl(var(--color-halogen))';
    case 'Noble Gas': return 'hsl(var(--color-noble))';
    case 'Lanthanide': return 'hsl(var(--color-lanthanide))';
    case 'Actinide': return 'hsl(var(--color-actinide))';
    case 'Post-Transition Metal': return 'hsl(var(--color-post-transition))';
    case 'Metalloid': return 'hsl(var(--color-metalloid))';
    case 'Nonmetal': return 'hsl(var(--color-nonmetal))';
    default: return 'hsl(var(--muted-foreground))';
  }
};

export const getCategoryClass = (category: ElementCategory) => {
  return `cat-${category.toLowerCase().replace(/ /g, '-')}`;
};
