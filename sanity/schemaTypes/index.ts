import { type SchemaTypeDefinition } from 'sanity'
import { heroType } from './hero'
import { aboutType } from './about'
import { teamType } from './team'
import { categoryType } from './category'
import { galleryType } from './gallery'
import { seoType } from './seo'
import { projectType } from './project'
import { blockContentType } from './blockContent'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroType, aboutType, teamType, categoryType, galleryType, seoType, projectType, blockContentType],
}
