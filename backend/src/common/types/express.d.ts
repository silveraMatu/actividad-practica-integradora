import { Request } from "express"

export interface authUserPayload {
  userId: string
  rol: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: authUserPayload
    }
  }
}

export {}