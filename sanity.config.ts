import {PluginOptions, defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {RobotIcon, RocketIcon} from '@sanity/icons'
import {visionTool} from '@sanity/vision'
import {schemaTypes, translatedSchemaTypes} from './schemas'
import {documentInternationalization} from '@sanity/document-internationalization'

const plugins: PluginOptions[] = [
  deskTool(),
  visionTool(),
  documentInternationalization({
    supportedLanguages: [
      {id: 'en', title: 'English'},
      {id: 'pt-br', title: 'Português'},
    ],
    schemaTypes: translatedSchemaTypes,
  }),
]
export default defineConfig([
  {
    name: 'production-workspace',
    title: 'Default Leonardo Rick Workspace',
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: 'production',
    basePath: '/production',
    icon: RocketIcon,
    plugins,
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: 'development-workspace',
    title: 'Development Leonardo Rick Workspace',
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: 'development',
    basePath: '/development',
    icon: RobotIcon,
    plugins,
    schema: {
      types: schemaTypes,
    },
  },
])
