import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSlider } from "@/components/home/categories-slider";
import { VideoHighlight } from "@/components/home/video-highlight";
import { GallerySection } from "@/components/home/gallery-section";
import { GearShowcase } from "@/components/home/gear-showcase";
import { SocialSection } from "@/components/home/social-section";
import { getHero, getFeaturedCategories, getFeaturedGalleryItems, getGearSettings, getGearItems, getSocialSection } from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  const heroData = getHero();
  const categoriesData = getFeaturedCategories();
  const galleryData = getFeaturedGalleryItems();
  const gearSettings = getGearSettings();
  const gearItems = getGearItems();
  const socialData = getSocialSection();
  const homeJsonLd = getHomeJsonLd();

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection heroData={heroData} />
      <CategoriesSlider categoriesData={categoriesData} />
      <VideoHighlight 
        videoUrl={heroData.videoUrl} 
        title={heroData.videoTitle}
        subtitle={heroData.videoSubtitle}
      />
      <GallerySection galleryData={galleryData} />
      <GearShowcase 
        title={gearSettings.title}
        subtitle={gearSettings.subtitle}
        gear={gearItems}
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
