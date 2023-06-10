import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  graphql: [
    {
      playground: true,
      workspace: 'production-workspace',
    },
    {
      playground: true,
      workspace: 'development-workspace',
    },
  ],
})
