import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSlider } from "@/components/home/categories-slider";
import { GallerySection } from "@/components/home/gallery-section";

export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSlider />
      <GallerySection />
      <JsonLd data={getHomeJsonLd()} />
    </>
  );
}
