'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Product, ProductConfiguration } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductGallery from './ProductGallery';
import StarRating from './StarRating';
import { calculatePrice, formatPrice, formatPriceWithCurrency } from '@/lib/api';
import {
  SizeSelector,
  HeadrailSelector,
  HeadrailColourSelector,
  InstallationMethodSelector,
  ControlOptionSelector,
  StackingSelector,
  ControlSideSelector,
  BottomChainSelector,
  BracketTypeSelector,
  ChainColorSelector,
  WrappedCassetteSelector,
  CassetteMatchingBarSelector,
} from './customization';
import {
  HEADRAIL_OPTIONS,
  HEADRAIL_COLOUR_OPTIONS,
  INSTALLATION_METHOD_OPTIONS,
  ROLLER_INSTALLATION_OPTIONS,
  CONTROL_OPTIONS,
  ROLLER_CONTROL_OPTIONS,
  STACKING_OPTIONS,
  CONTROL_SIDE_OPTIONS,
  BOTTOM_CHAIN_OPTIONS,
  BRACKET_TYPE_OPTIONS,
  CHAIN_COLOR_OPTIONS,
  WRAPPED_CASSETTE_OPTIONS,
  CASSETTE_MATCHING_BAR_OPTIONS,
} from '@/data/customizations';

interface CustomizationModalProps {
  product: Product;
  config: ProductConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<ProductConfiguration>>;
  onClose: () => void;
  basePricePerSquareMeter?: number; // Price per m² from backend
  originalPricePerSquareMeter?: number; // Original price per m² from backend
}

const CustomizationModal = ({
  product,
  config,
  setConfig,
  onClose,
  basePricePerSquareMeter,
  originalPricePerSquareMeter,
}: CustomizationModalProps) => {
  const { addToCart } = useCart();

  // Calculate base price based on size if basePricePerSquareMeter is provided
  const basePrice = useMemo(() => {
    if (basePricePerSquareMeter) {
      // If no size is selected, return base price per square meter
      if (config.width === 0 || config.height === 0) {
        return basePricePerSquareMeter;
      }
      // Otherwise calculate price based on area
      return calculatePrice(
        basePricePerSquareMeter,
        config.width,
        config.widthFraction,
        config.height,
        config.heightFraction
      );
    }
    return product.price;
  }, [basePricePerSquareMeter, config.width, config.widthFraction, config.height, config.heightFraction, product.price]);

  // Determine which options to use based on product category
  const isRollerOrDayNight = useMemo(() => {
    const category = product.category.toLowerCase();
    return category.includes('roller') || category.includes('day') || category.includes('night');
  }, [product.category]);

  const installationOptions = isRollerOrDayNight ? ROLLER_INSTALLATION_OPTIONS : INSTALLATION_METHOD_OPTIONS;
  const controlOptions = isRollerOrDayNight ? ROLLER_CONTROL_OPTIONS : CONTROL_OPTIONS;

  // Determine which options should be visible based on product type and selected headrail
  const visibleOptions = useMemo(() => {
    const headrail = config.headrail;

    // For roller blinds and day/night blinds (no headrail)
    if (isRollerOrDayNight) {
      return {
        showSize: true,
        showHeadrail: false,
        showHeadrailColour: false,
        showInstallationMethod: true, // Always show for roller/day-night
        showControlOption: true, // Always show for roller/day-night
        showStacking: false,
        showControlSide: false,
        showBottomChain: false,
        showBracketType: false,
      };
    }

    // For vertical blinds (with headrail)
    return {
      // Size and Headrail are always visible
      showSize: true,
      showHeadrail: true,

      // Headrail Colour only for Platinum
      showHeadrailColour: headrail === 'platinum',

      // Installation Method for Classic and Platinum
      showInstallationMethod: headrail === 'classic' || headrail === 'platinum',

      // Control Option for Classic and Platinum
      showControlOption: headrail === 'classic' || headrail === 'platinum',

      // Stacking for Classic and Platinum
      showStacking: headrail === 'classic' || headrail === 'platinum',

      // Control Side for Classic and Platinum
      showControlSide: headrail === 'classic' || headrail === 'platinum',

      // Bottom Chain for all headrail types (Louvres, Classic, Platinum)
      showBottomChain: headrail === 'louvres-only' || headrail === 'classic' || headrail === 'platinum',

      // Bracket Type for Classic and Platinum
      showBracketType: headrail === 'classic' || headrail === 'platinum',
    };
  }, [config.headrail, isRollerOrDayNight]);

  // Calculate additional cost based on selected options
  const additionalCost = useMemo(() => {
    let cost = 0;

    if (config.headrail && product.features.hasHeadrail) {
      const option = HEADRAIL_OPTIONS.find((o) => o.id === config.headrail);
      cost += option?.price || 0;
    }

    if (config.headrailColour && product.features.hasHeadrailColour && visibleOptions.showHeadrailColour) {
      const option = HEADRAIL_COLOUR_OPTIONS.find((o) => o.id === config.headrailColour);
      cost += option?.price || 0;
    }

    if (config.installationMethod && product.features.hasInstallationMethod && visibleOptions.showInstallationMethod) {
      const option = installationOptions.find((o) => o.id === config.installationMethod);
      cost += option?.price || 0;
    }

    if (config.controlOption && product.features.hasControlOption && visibleOptions.showControlOption) {
      const option = controlOptions.find((o) => o.id === config.controlOption);
      cost += option?.price || 0;
    }

    if (config.stacking && product.features.hasStacking && visibleOptions.showStacking) {
      const option = STACKING_OPTIONS.find((o) => o.id === config.stacking);
      cost += option?.price || 0;
    }

    if (config.controlSide && product.features.hasControlSide && visibleOptions.showControlSide) {
      const option = CONTROL_SIDE_OPTIONS.find((o) => o.id === config.controlSide);
      cost += option?.price || 0;
    }

    if (config.bottomChain && product.features.hasBottomChain && visibleOptions.showBottomChain) {
      const option = BOTTOM_CHAIN_OPTIONS.find((o) => o.id === config.bottomChain);
      cost += option?.price || 0;
    }

    if (config.bracketType && product.features.hasBracketType && visibleOptions.showBracketType) {
      const option = BRACKET_TYPE_OPTIONS.find((o) => o.id === config.bracketType);
      cost += option?.price || 0;
    }

    if (config.chainColor && product.features.hasChainColor) {
      const option = CHAIN_COLOR_OPTIONS.find((o) => o.id === config.chainColor);
      cost += option?.price || 0;
    }

    if (config.wrappedCassette && product.features.hasWrappedCassette) {
      const option = WRAPPED_CASSETTE_OPTIONS.find((o) => o.id === config.wrappedCassette);
      cost += option?.price || 0;
    }

    if (config.cassetteMatchingBar && product.features.hasCassetteMatchingBar) {
      const option = CASSETTE_MATCHING_BAR_OPTIONS.find((o) => o.id === config.cassetteMatchingBar);
      cost += option?.price || 0;
    }

    return cost;
  }, [config, product.features, visibleOptions, installationOptions, controlOptions]);

  const totalPrice = basePrice + additionalCost;

  const handleAddToCart = () => {
    // Create a modified product with the updated price including customizations
    const productWithPrice = {
      ...product,
      price: totalPrice,
    };
    addToCart(productWithPrice, config);
  };

  return (
    <div className="bg-white min-h-screen relative z-20">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-20 py-3 md:py-4 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00473c]">{product.category}</Link>
            <span>&gt;</span>
            <button onClick={onClose} className="hover:text-[#00473c] truncate max-w-[120px] md:max-w-none">{product.name}</button>
            <span>&gt;</span>
            <span className="text-gray-900">Customize</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-20 py-6 md:py-8 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
            {/* Left - Gallery (Sticky on desktop) */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-4 lg:self-start">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right - Configuration */}
            <div className="w-full lg:w-[55%]">
              {/* Product Title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#3a3a3a] mb-2">{product.name}</h1>
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                Estimated Shipping Date: <span className="text-[#00473c] font-medium">{product.estimatedDelivery}</span>
              </p>
              <div className="flex items-center gap-1 mb-4 md:mb-6">
                <StarRating rating={product.rating} />
              </div>

              {/* Configuration Title */}
              <h2 className="text-lg md:text-xl font-medium text-[#3a3a3a] mb-4 md:mb-6 mt-6 md:mt-8">Configure Your Window Treatment</h2>

              <div className="space-y-8 divide-y divide-gray-100">
                {/* Size Selector */}
                {product.features.hasSize && (
                  <div className="pt-6 first:pt-0">
                    <SizeSelector
                      width={config.width}
                      widthFraction={config.widthFraction}
                      height={config.height}
                      heightFraction={config.heightFraction}
                      onWidthChange={(value) => setConfig({ ...config, width: value })}
                      onWidthFractionChange={(value) => setConfig({ ...config, widthFraction: value })}
                      onHeightChange={(value) => setConfig({ ...config, height: value })}
                      onHeightFractionChange={(value) => setConfig({ ...config, heightFraction: value })}
                    />
                  </div>
                )}

                {/* Headrail Selector */}
                {product.features.hasHeadrail && (
                  <div className="pt-6 relative z-[60]">
                    <HeadrailSelector
                      options={HEADRAIL_OPTIONS}
                      selectedHeadrail={config.headrail}
                      onHeadrailChange={(headrailId) => setConfig({ ...config, headrail: headrailId })}
                    />
                  </div>
                )}

                {/* Headrail Colour Selector */}
                {product.features.hasHeadrailColour && visibleOptions.showHeadrailColour && (
                  <div className="pt-6 relative z-50">
                    <HeadrailColourSelector
                      options={HEADRAIL_COLOUR_OPTIONS}
                      selectedColour={config.headrailColour}
                      onColourChange={(colourId) => setConfig({ ...config, headrailColour: colourId })}
                    />
                  </div>
                )}

                {/* Installation Method Selector */}
                {product.features.hasInstallationMethod && visibleOptions.showInstallationMethod && (
                  <div className="pt-6 relative z-[45]">
                    <InstallationMethodSelector
                      options={installationOptions}
                      selectedMethod={config.installationMethod}
                      onMethodChange={(methodId) => setConfig({ ...config, installationMethod: methodId })}
                    />
                  </div>
                )}

                {/* Control Option Selector */}
                {product.features.hasControlOption && visibleOptions.showControlOption && (
                  <div className="pt-6 relative z-[40]">
                    <ControlOptionSelector
                      options={controlOptions}
                      selectedOption={config.controlOption}
                      onOptionChange={(optionId) => setConfig({ ...config, controlOption: optionId })}
                    />
                  </div>
                )}

                {/* Stacking Selector */}
                {product.features.hasStacking && visibleOptions.showStacking && (
                  <div className="pt-6 relative z-[35]">
                    <StackingSelector
                      options={STACKING_OPTIONS}
                      selectedStacking={config.stacking}
                      onStackingChange={(stackingId) => setConfig({ ...config, stacking: stackingId })}
                    />
                  </div>
                )}

                {/* Control Side Selector */}
                {product.features.hasControlSide && visibleOptions.showControlSide && (
                  <div className="pt-6 relative z-[32]">
                    <ControlSideSelector
                      options={CONTROL_SIDE_OPTIONS}
                      selectedSide={config.controlSide}
                      onSideChange={(sideId) => setConfig({ ...config, controlSide: sideId })}
                    />
                  </div>
                )}

                {/* Bottom Chain Selector */}
                {product.features.hasBottomChain && visibleOptions.showBottomChain && (
                  <div className="pt-6 relative z-30">
                    <BottomChainSelector
                      options={BOTTOM_CHAIN_OPTIONS}
                      selectedChain={config.bottomChain}
                      onChainChange={(chainId) => setConfig({ ...config, bottomChain: chainId })}
                    />
                  </div>
                )}

                {/* Bracket Type Selector */}
                {product.features.hasBracketType && visibleOptions.showBracketType && (
                  <div className="pt-6 relative z-20">
                    <BracketTypeSelector
                      options={BRACKET_TYPE_OPTIONS}
                      selectedBracket={config.bracketType}
                      onBracketChange={(bracketId) => setConfig({ ...config, bracketType: bracketId })}
                    />
                  </div>
                )}

                {/* Chain Color Selector */}
                {product.features.hasChainColor && (
                  <div className="pt-6 relative z-10">
                    <ChainColorSelector
                      options={CHAIN_COLOR_OPTIONS}
                      selectedColor={config.chainColor}
                      onColorChange={(colorId) => setConfig({ ...config, chainColor: colorId })}
                    />
                  </div>
                )}

                {/* Wrapped Cassette Selector */}
                {product.features.hasWrappedCassette && (
                  <div className="pt-6 relative z-[5]">
                    <WrappedCassetteSelector
                      options={WRAPPED_CASSETTE_OPTIONS}
                      selectedOption={config.wrappedCassette}
                      onOptionChange={(optionId) => setConfig({ ...config, wrappedCassette: optionId })}
                    />
                  </div>
                )}

                {/* Cassette Matching Bar Selector */}
                {product.features.hasCassetteMatchingBar && (
                  <div className="pt-6 relative z-[3]">
                    <CassetteMatchingBarSelector
                      options={CASSETTE_MATCHING_BAR_OPTIONS}
                      selectedBar={config.cassetteMatchingBar}
                      onBarChange={(barId) => setConfig({ ...config, cassetteMatchingBar: barId })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-20 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs md:text-sm text-gray-500">Price</span>
              <div className="text-xl md:text-2xl font-bold text-[#3a3a3a]">
                {formatPriceWithCurrency(formatPrice(totalPrice), product.currency)}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#00473c] text-white py-2.5 md:py-3 px-6 md:px-8 rounded text-sm md:text-base font-medium hover:bg-[#003830] transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
