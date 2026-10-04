import { Request } from "express"

export interface authUserPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: authUserPayload
    }
  }
}

export {}