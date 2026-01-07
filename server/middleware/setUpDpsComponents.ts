import { Router } from 'express'
import { getFrontendComponents } from '@ministryofjustice/hmpps-connect-dps-components'
import logger from '../../logger'
import config from '../config'

export default function setUpDpsComponents() {
  const router = Router()

  router.get(
    '*dpsComponents',
    getFrontendComponents({
      componentApiConfig: config.apis.componentApi,
      requestOptions: { includeSharedData: true },
      dpsUrl: config.digitalPrisonServiceUrl,
      logger,
    }),
  )

  return router
}
