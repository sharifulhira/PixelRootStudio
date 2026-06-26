import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSlider } from "@/components/home/categories-slider";
import { VideoHighlight } from "@/components/home/video-highlight";
import { GallerySection } from "@/components/home/gallery-section";
import { GearShowcase } from "@/components/home/gear-showcase";
import { SocialSection } from "@/components/home/social-section";
import { PackagesPreview } from "@/components/home/packages-preview";
import { CtaBanner } from "@/components/home/cta-banner";
import { getHero, getFeaturedCategories, getFeaturedGalleryItems, getGearSettings, getGearItems, getSocialSection, getPopularPackages, getPackageSettings, getCorporateClientsSettings, getPublishedCorporateClients } from "@/lib/db/queries";
import { ClientsMarquee } from "@/components/home/clients-marquee";

export const revalidate = 3600;

export default function Home() {
  const heroData = getHero();
  const categoriesData = getFeaturedCategories();
  const galleryData = getFeaturedGalleryItems();
  const gearSettings = getGearSettings();
  const gearItems = getGearItems();
  const socialData = getSocialSection();
  const popularPackages = getPopularPackages();
  const packageSettings = getPackageSettings();
  const clientsSettings = getCorporateClientsSettings();
  const corporateClients = getPublishedCorporateClients();
  const homeJsonLd = getHomeJsonLd();

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection heroData={heroData} />
      <ClientsMarquee
        title={clientsSettings.title}
        subtitle={clientsSettings.subtitle}
        clients={corporateClients}
      />
      <CategoriesSlider categoriesData={categoriesData} />
      <VideoHighlight 
        videoUrl={heroData.videoUrl} 
        title={heroData.videoTitle}
        subtitle={heroData.videoSubtitle}
      />
      <GallerySection galleryData={galleryData} />

      <CtaBanner
        headline="Like What You See?"
        subtext="Let's create stunning visuals for your next project. Every frame tells a story."
        ctaLabel="View Packages"
        ctaHref="/packages"
        variant="dark"
      />

      <PackagesPreview
        title={packageSettings.title}
        subtitle={packageSettings.subtitle}
        ctaLabel={packageSettings.ctaLabel}
        ctaHref={packageSettings.ctaHref}
        packages={popularPackages}
      />

      <GearShowcase 
        title={gearSettings.title}
        subtitle={gearSettings.subtitle}
        gear={gearItems}
      />

      <CtaBanner
        headline="Ready to Book Your Session?"
        subtext="Premium equipment, cinematic expertise, and a dedicated team — all at your service."
        ctaLabel="Book Your Session"
        ctaHref="/packages"
        variant="light"
      />

      {socialData && (
        <SocialSection
          title={socialData.title}
          subtitle={socialData.subtitle}
          links={socialData.links}
        />
      )}
      <JsonLd data={homeJsonLd} />
    </>
  );
}
