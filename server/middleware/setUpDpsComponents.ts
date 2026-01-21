import { Router, type Response, type NextFunction, type Request } from 'express'
import { getFrontendComponents } from '@ministryofjustice/hmpps-connect-dps-components'
import logger from '../../logger'
import config from '../config'

export function getCachedDpsComponents() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.feComponents = {
      header: '',
      footer: '',
      cssIncludes: [],
      jsIncludes: [],
    }

    if (req.method !== 'GET' && req.session?.feComponents?.header && req.session?.feComponents?.footer) {
      res.locals.feComponents = req.session.feComponents
      return next()
    }

    return next()
  }
}

export function dpsComponentsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && res.locals.feComponents?.header && res.locals.feComponents?.footer) {
      return next()
    }

    const frontendComponents = getFrontendComponents({
      componentApiConfig: config.apis.componentApi,
      requestOptions: { includeSharedData: true },
      dpsUrl: config.digitalPrisonServiceUrl,
      logger,
    })

    return frontendComponents(req, res, () => {
      if (res.locals.feComponents?.header && req.session) {
        req.session.feComponents = res.locals.feComponents
        req.session.save(err => {
          if (err) {
            logger.error('Failed to save feComponents to session:', err)
          }
        })
      }

      return next()
    })
  }
}

export default function setUpDpsComponents() {
  const router = Router()

  // To reduce the load on components API, cache dps components in session to use for non-GET requests
  router.use(getCachedDpsComponents())

  // Call API on GET or if components are not stored in session
  router.all('*dpsComponents', dpsComponentsMiddleware())

  return router
}
