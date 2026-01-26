/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { findError, formatName, formatDate, initialiseName, toFixed } from './utils'
import config from '../config'
import logger from '../../logger'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Prisoner Pay'
  app.locals.environmentName = config.environmentName
  app.locals.activitiesUiUrl = config.activitiesUiUrl
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
      noCache: process.env.NODE_ENV !== 'production',
    },
  )

  njkEnv.addFilter('formatName', (name, nameStyle, bold) => {
    const inputName = formatName(name.firstName, name.middleNames, name.lastName, nameStyle, bold)
    return inputName ? njkEnv.getFilter('safe')(inputName) : null
  })
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('findError', findError)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('toFixed', toFixed)

  njkEnv.addGlobal('activitiesUiUrl', config.activitiesUiUrl)
}
