import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// IMPORTANT: Set these environment variables before running the script
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9d4cnqzs';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || 'your_write_token';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

async function uploadImage(imagePath: string) {
  // Wait, local json files point to Unsplash URLs.
  // We can either upload them as Sanity image assets or just store the URL if schema allowed string.
  // Since schema expects 'image', we have to upload from URL.
  console.log('Uploading image from URL:', imagePath);
  try {
    const response = await fetch(imagePath);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imagePath.split('/').pop() || 'image.jpg',
    });
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error('Failed to upload image:', imagePath, error);
    return null;
  }
}

async function migrate() {
  console.log('Starting migration...');

  // 1. SEO
  const seoData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/seo.json'), 'utf8'));
  console.log('Migrating SEO...');
  await client.create({
    _type: 'seo',
    ...seoData
  });

  // 2. Hero
  const heroData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/hero.json'), 'utf8'));
  console.log('Migrating Hero...');
  const heroImage = await uploadImage(heroData.image.src);
  await client.create({
    _type: 'hero',
    badge: heroData.badge,
    headline: heroData.headline,
    subheadline: heroData.subheadline,
    cta: heroData.cta,
    stats: heroData.stats,
    services: heroData.services,
    image: {
      ...heroImage,
      alt: heroData.image.alt
    }
  });

  // 3. About
  const aboutData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/about.json'), 'utf8'));
  console.log('Migrating About...');
  const aboutPhoto = await uploadImage(aboutData.photo);
  const aboutBanner = await uploadImage(aboutData.bannerImage);
  await client.create({
    _type: 'about',
    name: aboutData.name,
    shortName: aboutData.shortName,
    title: aboutData.title,
    tagline: aboutData.tagline,
    bio: aboutData.bio,
    vision: aboutData.vision,
    stats: aboutData.stats,
    skills: aboutData.skills,
    experience: aboutData.experience,
    photo: aboutPhoto,
    bannerImage: aboutBanner,
    contact: aboutData.contact
  });

  // 4. Team
  const teamData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/team.json'), 'utf8'));
  console.log('Migrating Team...');
  for (const member of teamData) {
    const photo = await uploadImage(member.photo);
    await client.create({
      _type: 'team',
      name: member.name,
      role: member.role,
      bio: member.bio,
      isFounder: member.isFounder,
      photo: photo
    });
  }

  // 5. Categories
  const categoriesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8'));
  console.log('Migrating Categories...');
  for (const category of categoriesData) {
    const image = await uploadImage(category.image);
    await client.create({
      _type: 'category',
      name: category.name,
      description: category.description,
      href: category.href,
      image: image
    });
  }

  // 6. Gallery
  const galleryData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/gallery.json'), 'utf8'));
  console.log('Migrating Gallery...');
  for (const item of galleryData) {
    const src = await uploadImage(item.src);
    await client.create({
      _type: 'gallery',
      category: item.category,
      alt: item.alt,
      aspect: item.aspect,
      src: src
    });
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
