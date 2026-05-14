import { JsonLd } from "@/seo/json-ld";
import { getHomeJsonLd } from "@/seo/site-seo";

export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

export default function Home() {
  return (
    <>
      <h1>Hello world</h1>
      <JsonLd data={getHomeJsonLd()} />
    </>
  );
}
