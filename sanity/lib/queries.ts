import { groq } from 'next-sanity';

// ── Homepage ──

export const heroQuery = groq`*[_type == "hero"][0] {
  badge,
  headline,
  subheadline,
  cta,
  stats,
  services,
  "image": {
    "src": image.asset->url,
    "alt": image.alt
  }
}`;

export const categoriesQuery = groq`*[_type == "category"] | order(name asc) {
  "id": _id,
  name,
  description,
  "slug": slug.current,
  "image": image.asset->url
}`;

// Homepage gallery: pull from featured projects' gallery images
export const galleryQuery = groq`*[_type == "project" && featured == true] | order(date desc) {
  "items": gallery[] {
    "id": _key,
    "src": asset->url,
    "alt": alt,
    "category": ^.category->name,
    "aspect": "portrait"
  }
}.items[]`;

// ── About ──

export const aboutQuery = groq`*[_type == "about"][0] {
  name,
  shortName,
  title,
  tagline,
  bio,
  vision,
  stats,
  skills,
  experience,
  "photo": photo.asset->url,
  "bannerImage": bannerImage.asset->url,
  contact
}`;

export const teamQuery = groq`*[_type == "team"] | order(isFounder desc, name asc) {
  "id": _id,
  name,
  role,
  bio,
  "photo": photo.asset->url,
  isFounder
}`;

// ── SEO ──

export const seoQuery = groq`*[_type == "seo"][0] {
  siteName,
  siteUrl,
  title,
  description,
  locale,
  twitterHandle,
  keywords,
  organization
}`;

// ── Portfolio ──

export const projectsListQuery = groq`*[_type == "project"] | order(date desc) {
  "id": _id,
  title,
  "slug": slug.current,
  summary,
  date,
  client,
  featured,
  "coverImage": {
    "src": coverImage.asset->url,
    "alt": coverImage.alt
  },
  "category": category-> {
    "id": _id,
    name,
    "slug": slug.current
  }
}`;

export const projectDetailQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  summary,
  body,
  date,
  client,
  featured,
  seo,
  "coverImage": {
    "src": coverImage.asset->url,
    "alt": coverImage.alt,
    "width": coverImage.asset->metadata.dimensions.width,
    "height": coverImage.asset->metadata.dimensions.height
  },
  "category": category-> {
    "id": _id,
    name,
    "slug": slug.current
  },
  "gallery": gallery[] {
    "id": _key,
    "src": asset->url,
    alt,
    caption,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  "team": team[]-> {
    "id": _id,
    name,
    role,
    "photo": photo.asset->url
  }
}`;

export const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)] {
  "slug": slug.current
}`;

export const portfolioCategoriesQuery = groq`*[_type == "category"] | order(name asc) {
  "id": _id,
  name,
  "slug": slug.current
}`;
