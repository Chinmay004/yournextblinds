import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Product } from '@/types/product';
import { ProductPage } from '@/components/product';
import { TopBar, Header, FlashSale, FAQ, Footer, NavBar } from '@/components';
import { fetchProductBySlug, fetchAllProducts } from '@/lib/api';
import { mapProductDataToProduct, getBasePricePerSquareMeter, getOriginalPricePerSquareMeter } from '@/lib/productMapper';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all products from backend
export async function generateStaticParams() {
  try {
    const response = await fetchAllProducts({ limit: 1000 });
    return response.data.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const response = await fetchProductBySlug(slug);
    const product = mapProductDataToProduct(response.data);
    
    return {
      title: `${product.name} | Your Next Blinds`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Product Not Found | Your Next Blinds',
    };
  }
}

export default async function ProductPageRoute({ params }: ProductPageProps) {
  const { slug } = await params;
  
  let productData;
  try {
    const response = await fetchProductBySlug(slug);
    productData = response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
  
  const product = mapProductDataToProduct(productData);
  
  let relatedProducts: Product[] = [];
  try {
    const categorySlug = productData.categories.length > 0 
      ? productData.categories[0].slug 
      : null;
    
    const allProductsResponse = await fetchAllProducts({ limit: 100 });
    
    const sameCategoryProducts = allProductsResponse.data
      .filter((data) => {
        if (data.slug === product.slug) return false;
        if (categorySlug) {
          return data.categories.some((cat) => cat.slug === categorySlug);
        }
        return true;
      })
      .map((data) => mapProductDataToProduct(data))
      .slice(0, 4);
    
    relatedProducts = sameCategoryProducts;
    
    if (relatedProducts.length < 4) {
      const otherProducts = allProductsResponse.data
        .filter((data) => {
          if (data.slug === product.slug) return false;
          if (categorySlug) {
            return !data.categories.some((cat) => cat.slug === categorySlug);
          }
          return true;
        })
        .map((data) => mapProductDataToProduct(data))
        .filter((p) => !relatedProducts.some((rp) => rp.slug === p.slug))
        .slice(0, 4 - relatedProducts.length);
      
      relatedProducts.push(...otherProducts);
    }
  } catch (error) {
    console.error('Error fetching related products:', error);
  }
  
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <ProductPage
            product={product}
            relatedProducts={relatedProducts}
            basePricePerSquareMeter={getBasePricePerSquareMeter(productData)}
            originalPricePerSquareMeter={getOriginalPricePerSquareMeter(productData)}
          />
        </Suspense>
        <FlashSale />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
