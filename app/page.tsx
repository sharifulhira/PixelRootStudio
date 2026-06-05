import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSlider } from "@/components/home/categories-slider";
import { GallerySection } from "@/components/home/gallery-section";
import { client } from "@/sanity/lib/client";
import { heroQuery, categoriesQuery, galleryQuery } from "@/sanity/lib/queries";
import defaultHeroData from "@/data/hero.json";
import defaultCategoriesData from "@/data/categories.json";
import defaultGalleryData from "@/data/gallery.json";

export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

export default async function Home() {
  const sanityHeroData = await client.fetch(heroQuery).catch(() => null);
  const sanityCategoriesData = await client.fetch(categoriesQuery).catch(() => null);
  const sanityGalleryData = await client.fetch(galleryQuery).catch(() => null);

  const heroData = (sanityHeroData && sanityHeroData.headline) ? sanityHeroData : defaultHeroData;
  const categoriesData = (sanityCategoriesData && sanityCategoriesData.length > 0) ? sanityCategoriesData : defaultCategoriesData;
  const galleryData = (sanityGalleryData && sanityGalleryData.length > 0) ? sanityGalleryData : defaultGalleryData;
  const homeJsonLd = await getHomeJsonLd();

  return (
    <>
      <HeroSection heroData={heroData} />
      <CategoriesSlider categoriesData={categoriesData} />
      <GallerySection galleryData={galleryData} />
      <JsonLd data={homeJsonLd} />
    </>
  );
}
