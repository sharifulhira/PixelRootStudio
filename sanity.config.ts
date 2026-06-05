import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './sanity/schemaTypes';
import { projectId, dataset } from './sanity/env';

export default defineConfig({
  name: 'default',
  title: 'PixelRoot Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schema.types,
  },
});
