function mapPatternToTags(pattern: string): string[] {
  const patternMap: Record<string, string[]> = {
    'animal': ['animal', 'animal-pattern'],
    'floral': ['floral', 'floral-pattern', 'flower'],
    'geometric': ['geometric', 'geometric-pattern'],
    'striped': ['striped', 'stripe', 'stripes'],
    'light-wood': ['light-wood', 'lightwood', 'light-wood-finish'],
    'medium-wood': ['medium-wood', 'mediumwood', 'medium-wood-finish'],
    'abstract': ['abstract', 'abstract-pattern'],
  };

  return patternMap[pattern] || [pattern];
}

function mapColorToTags(color: string): string[] {
  const colorMap: Record<string, string[]> = {
    'white': ['white', 'pacific-white', 'snow-white'],
    'black': ['black', 'charcoal', 'ebony'],
    'blue': ['blue', 'navy', 'sky-blue'],
    'yellow': ['yellow', 'gold', 'cream'],
    'gold': ['gold', 'golden', 'yellow'],
    'green': ['green', 'emerald', 'forest-green'],
    'grey': ['grey', 'gray', 'silver', 'charcoal'],
    'purple': ['purple', 'violet', 'lavender'],
    'orange': ['orange', 'tangerine'],
    'red': ['red', 'crimson', 'burgundy'],
    'pink': ['pink', 'rose', 'blush'],
  };

  return colorMap[color] || [color];
}

function mapWindowToTags(window: string): string[] {
  const windowMap: Record<string, string[]> = {
    'bay-window': ['bay-window', 'bay'],
    'conservatory-window': ['conservatory', 'conservatory-window'],
    'tilt-and-turn-window': ['tilt-turn', 'tilt-and-turn'],
    'bi-fold-window': ['bi-fold', 'bifold'],
    'french-door': ['french-door', 'french-door-window'],
    'sliding-door': ['sliding-door', 'sliding'],
  };

  return windowMap[window] || [window];
}

function mapRoomToTags(room: string): string[] {
  const roomMap: Record<string, string[]> = {
    'conservatory': ['conservatory', 'conservatory-room'],
    'bedroom': ['bedroom', 'bed'],
    'kitchen': ['kitchen'],
    'office': ['office', 'study'],
    'bathroom': ['bathroom', 'bath'],
    'living-room': ['living-room', 'living', 'lounge'],
    'dining-room': ['dining-room', 'dining'],
    'children': ['children', 'kids', 'kids-room', 'childrens'],
  };

  return roomMap[room] || [room];
}

function mapSolutionToTags(solution: string): string[] {
  const solutionMap: Record<string, string[]> = {
    'thermal-blinds': ['thermal', 'thermal-blinds', 'insulated'],
    'better-sleep-blinds': ['blackout', 'blackout-blinds', 'sleep', 'dark'],
    'cordless-blinds': ['cordless', 'cordless-blinds'],
    'no-drill-blinds': ['no-drill', 'no-drill-blinds', 'perfect-fit'],
    'blackout-blinds': ['blackout', 'blackout-blinds', 'complete-blackout'],
    'waterproof-blinds': ['waterproof', 'water-resistant', 'moisture-resistant'],
    'easy-wipe-blinds': ['easy-wipe', 'wipeable', 'easy-clean'],
    'taped-blinds': ['taped', 'taped-blinds', 'taped-edges'],
  };

  return solutionMap[solution] || [solution];
}

function filterValueToTagSlugs(filterValue: string): string[] {
  const directSlug = filterValue.toLowerCase().replace(/\s+/g, '-');
  const variations = [
    directSlug,
    filterValue.toLowerCase().replace(/\s+/g, '_'),
    filterValue.toLowerCase(),
  ];
  return [...new Set(variations)];
}

export function mapFilterToTagSlugs(filterType: string, filterValue: string): string[] {
  const normalizedValue = filterValue.toLowerCase().trim();

  switch (filterType) {
    case 'pattern':
      return mapPatternToTags(normalizedValue);
    case 'color':
      return mapColorToTags(normalizedValue);
    case 'window':
      return mapWindowToTags(normalizedValue);
    case 'room':
      return mapRoomToTags(normalizedValue);
    case 'solution':
      return mapSolutionToTags(normalizedValue);
    default:
      return filterValueToTagSlugs(filterValue);
  }
}

