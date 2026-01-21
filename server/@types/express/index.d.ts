import { PrisonUser } from '../../interfaces/hmppsUser'
import AuditService from '../../services/auditService'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    feComponents?: {
      header: string
      footer: string
      cssIncludes: string[]
      jsIncludes: string[]
    }
    returnTo: string
    selectedPrisoner: {
      prisonerNumber: string
      firstName: string
      lastName: string
      cellLocation?: string
      status?: string
    }
    selectedDate: string
    passport: {
      user: {
        username: string
      }
    }
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      auditService?: AuditService
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: PrisonUser
    }
  }
}
