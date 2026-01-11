import React, { useEffect } from 'react';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopHero from '@/components/shop/ShopHero';
import ProductGrid from '@/components/shop/ProductGrid';
import HowItWorks from '@/components/shop/HowItWorks';
import ShopFooter from '@/components/shop/ShopFooter';

const Shop = () => {
  // Add noindex meta tag
  useEffect(() => {
    // Create meta tag for noindex
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Update page title
    document.title = 'Dentaxy Shop | Insumos Odontológicos';

    return () => {
      // Cleanup on unmount
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main>
        <ShopHero />
        <ProductGrid />
        <HowItWorks />
      </main>
      <ShopFooter />
    </div>
  );
};

export default Shop;
