import { PluginOptions, defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes, translatedSchemaTypes } from './schemas';
import { documentInternationalization } from '@sanity/document-internationalization';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { ENVIRONMENTS } from './utils/constants/environments';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const languages = [
  { id: 'en', title: 'English' },
  { id: 'pt-BR', title: 'Português' },
];

const plugins: PluginOptions[] = [
  deskTool(),
  visionTool(),
  documentInternationalization({
    supportedLanguages: languages,
    schemaTypes: translatedSchemaTypes,
  }),
  internationalizedArray({
    languages,
    fieldTypes: ['string', 'blockContent'], // internationalizedArray<type>
  }),
];
export default defineConfig(
  ENVIRONMENTS.map(({ dataset, icon }) => ({
    name: `${dataset}-workspace`,
    title: `${dataset.charAt(0).toUpperCase()}${dataset.slice(1)} Leonardo Rick Workspace`,
    projectId,
    dataset,
    basePath: `/${dataset}`,
    icon: icon,
    plugins,
    schema: {
      types: schemaTypes,
    },
  }))
);
