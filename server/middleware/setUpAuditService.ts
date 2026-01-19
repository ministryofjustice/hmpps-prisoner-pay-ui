import { Request, Response, NextFunction } from 'express'
import AuditService from '../services/auditService'

export default function setUpAuditService(auditService: AuditService) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.auditService = auditService
    next()
  }
}
