import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSlider } from "@/components/home/categories-slider";
import { GallerySection } from "@/components/home/gallery-section";
import heroData from "@/data/hero.json";
import categoriesData from "@/data/categories.json";
import galleryData from "@/data/gallery.json";

export const dynamic = "force-static";

export default function Home() {
  const homeJsonLd = getHomeJsonLd();

  return (
    <>
      <HeroSection heroData={heroData} />
      <CategoriesSlider categoriesData={categoriesData} />
      <GallerySection galleryData={galleryData} />
      <JsonLd data={homeJsonLd} />
    </>
  );
}
