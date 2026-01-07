import { Router } from 'express'
import { retrieveCaseLoadData } from '@ministryofjustice/hmpps-connect-dps-components'
import logger from '../../logger'
import config from '../config'

export default function setUpCaseLoadData() {
  const router = Router()

  router.use(
    retrieveCaseLoadData({
      logger,
      prisonApiConfig: config.apis.prisonApi,
    }),
  )

  return router
}
