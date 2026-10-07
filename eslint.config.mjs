import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: [
    'assets/**/*.js',
    'server/@types/payOrchestratorAPI/**/*.ts',
    'server/@types/prisonerPayAPI/**/*.ts',
  ],
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs'],
})
