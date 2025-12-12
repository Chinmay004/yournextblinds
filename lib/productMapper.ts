import { ProductData } from './api';
import { Product } from '@/types/product';
import { 
  DEFAULT_PRODUCT_FEATURES, 
  DEFAULT_ESTIMATED_DELIVERY, 
  DEFAULT_RATING, 
  DEFAULT_REVIEW_COUNT 
} from './constants';

function parseFraction(fraction: string): number {
  if (fraction === '0' || !fraction) return 0;
  const parts = fraction.split('/');
  if (parts.length !== 2) return 0;
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return 0;
  return numerator / denominator;
}

export function mapProductDataToProduct(
  productData: ProductData,
  defaultWidth: number = 24,
  defaultWidthFraction: string = '0',
  defaultHeight: number = 24,
  defaultHeightFraction: string = '0'
): Product {
  const categoryName = productData.categories.length > 0
    ? productData.categories[0].name
    : 'Blinds';

  const basePrice = typeof productData.basePrice === 'string'
    ? parseFloat(productData.basePrice)
    : productData.basePrice;
  
  const oldPrice = typeof productData.oldPrice === 'string'
    ? parseFloat(productData.oldPrice)
    : productData.oldPrice;

  const widthMeters = (defaultWidth + parseFraction(defaultWidthFraction)) * 0.0254;
  const heightMeters = (defaultHeight + parseFraction(defaultHeightFraction)) * 0.0254;
  const areaInSquareMeters = widthMeters * heightMeters;

  const calculatedPrice = basePrice * areaInSquareMeters;
  const calculatedOriginalPrice = oldPrice * areaInSquareMeters;

  return {
    id: productData.id,
    name: productData.title,
    slug: productData.slug,
    category: categoryName,
    price: Math.round(calculatedPrice * 100) / 100,
    originalPrice: Math.round(calculatedOriginalPrice * 100) / 100,
    rating: DEFAULT_RATING,
    reviewCount: DEFAULT_REVIEW_COUNT,
    estimatedDelivery: DEFAULT_ESTIMATED_DELIVERY,
    description: productData.description || '',
    images: productData.images.length > 0 ? productData.images : [],
    features: DEFAULT_PRODUCT_FEATURES,
    reviews: [],
    relatedProducts: [],
  };
}

export function getBasePricePerSquareMeter(productData: ProductData): number {
  return typeof productData.basePrice === 'string'
    ? parseFloat(productData.basePrice)
    : productData.basePrice;
}

export function getOriginalPricePerSquareMeter(productData: ProductData): number {
  return typeof productData.oldPrice === 'string'
    ? parseFloat(productData.oldPrice)
    : productData.oldPrice;
}


