import { defineCliConfig } from 'sanity/cli';
import { ENVIRONMENTS } from './utils/constants/environments';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  graphql: ENVIRONMENTS.map(({ dataset }) => ({
    playground: true,
    workspace: `${dataset}-workspace`,
  })),
});
