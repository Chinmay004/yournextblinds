function fractionToDecimal(fraction: string): number {
  if (fraction === '0' || !fraction) return 0;
  const parts = fraction.split('/');
  if (parts.length !== 2) return 0;
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return 0;
  return numerator / denominator;
}

function inchesToMeters(inches: number, fraction: string = '0'): number {
  const totalInches = inches + fractionToDecimal(fraction);
  return totalInches * 0.0254;
}

function calculateAreaInSquareMeters(
  width: number,
  widthFraction: string,
  height: number,
  heightFraction: string
): number {
  const widthMeters = inchesToMeters(width, widthFraction);
  const heightMeters = inchesToMeters(height, heightFraction);
  return widthMeters * heightMeters;
}

export function calculatePrice(
  basePricePerSquareMeter: number | string,
  width: number,
  widthFraction: string,
  height: number,
  heightFraction: string
): number {
  const pricePerM2 = typeof basePricePerSquareMeter === 'string' 
    ? parseFloat(basePricePerSquareMeter) 
    : basePricePerSquareMeter;
  
  const areaInSquareMeters = calculateAreaInSquareMeters(
    width,
    widthFraction,
    height,
    heightFraction
  );
  
  return pricePerM2 * areaInSquareMeters;
}

export function formatPrice(price: number): number {
  return Math.round(price * 100) / 100;
}


