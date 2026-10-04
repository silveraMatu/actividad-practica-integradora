export interface FieldError {
  field: string
  message: string
}

export class AppError extends Error{
  readonly statusCode: number
  readonly errors?: FieldError[]
  constructor(message: string, statusCode: number, errors?: FieldError[]){
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class BadRequestError extends AppError{
  constructor(message: string, errors?: FieldError[]){
    super(message, 400, errors)
  }
}

export class UnauthorizedError extends AppError{
  constructor(message: string){
    super(message, 401)
  }
}

export class NotFoundError extends AppError{
  constructor(message: string){
    super(message, 404)
  }
}

export class ConflictError extends AppError{
  constructor(message: string){
    super(message, 409)
  }
}

export class ForbiddenError extends AppError{
  constructor(message: string){
    super(message, 403)
  }
}