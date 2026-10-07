import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['assets/**/*.js', 'server/@types/**/*.ts'],
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs'],
})
