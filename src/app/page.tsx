import { BenefitsSection } from "@/components/marketing/benefits-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductPreview } from "@/components/marketing/product-preview";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function Home() {
  return (
    <div className="bg-canvas text-primary min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductPreview />
        <BenefitsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
