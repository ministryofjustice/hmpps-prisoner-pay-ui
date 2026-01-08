import { HmppsUser, PrisonUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedPrisoner: any
    selectedDate: string
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
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: PrisonUser
    }
  }
}

export type ServiceUser = Express.User & {
  activeCaseLoadId?: string
}
