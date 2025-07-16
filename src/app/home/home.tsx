'use client';

import Header from './home-components/Header';
import HeroSection from './home-components/HeroSection';
import CompatibilitySection from './home-components/CompatibilitySection';
import UndetectabilitySection from './home-components/UndetectabilitySection';
import HowToUseSection from './home-components/HowToUseSection';
import CommandsSection from './home-components/CommandsSection';
import PricingSection from './home-components/PricingSection';
import FAQSection from './home-components/FAQSection';
import CTASection from './home-components/CTASection';
import Footer from './home-components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#E0E0E0] font-roboto overflow-x-hidden">
            {/* Header is fixed and outside of container */}
            <Header />
            
            {/* Main content with proper spacing for fixed header */}
            <div className="pt-16 sm:pt-20">
                {/* Container sections */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <main>
                        <HeroSection />
                        <CompatibilitySection />
                        <UndetectabilitySection />
                        <HowToUseSection />
                    </main>
                </div>
                
                {/* Full width sections */}
                <CommandsSection />
                <PricingSection />
                
                {/* Container sections */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <FAQSection />
                    <CTASection />
                </div>
                
                {/* Full width footer */}
                <Footer />
            </div>
        </div>
    );
}