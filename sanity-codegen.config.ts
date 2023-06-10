import {SanityCodegenConfig} from 'sanity-codegen'

const config: SanityCodegenConfig = {
  schemaPath: './schemas/index',
  // Uncomment below to change output path
  outputPath: './utils//generated-schema-types.ts',
  babelOptions: {
    // Plugins are copy pasted from https://github.com/ricokahler/sanity-codegen/blob/main/src/cli.ts
    // Only the `babel-plugin-transform-vite-meta-env` plugin is added
    plugins: [
      // used to resolve and no-op sanity's part system
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            'part:@sanity/base/schema-creator': 'sanity-codegen/schema-creator-shim',
            'all:part:@sanity/base/schema-type': 'sanity-codegen/schema-type-shim',
            'part:@sanity/base/schema-type': 'sanity-codegen/schema-type-shim',
            '^part:.*': 'sanity-codegen/no-op',
            '^config:.*': 'sanity-codegen/no-op',
            '^all:part:.*': 'sanity-codegen/no-op',
          },
        },
      ],
      // used to resolve css module imports that are allowed in sanity projects
      'css-modules-transform',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      'babel-plugin-transform-vite-meta-env', // ADDED
    ],
  },
}

export default config
