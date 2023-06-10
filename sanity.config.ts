import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {RobotIcon, RocketIcon} from '@sanity/icons'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig([
  {
    name: 'production-workspace',
    title: 'Default Leonardo Rick Workspace',
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: 'production',
    basePath: '/production',
    icon: RocketIcon,
    plugins: [deskTool(), visionTool()],
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
    plugins: [deskTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
])
