import { AuthenticationMiddlewareInterface } from '@/domain/interfaces/middlewares/auth-middleware.interface'
import { HttpRequest, HttpResponse } from '@/shared/types'
import { Request, Response, NextFunction } from 'express'

export const expressAdapterMiddleware = (middleware: AuthenticationMiddlewareInterface) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input: HttpRequest = {
      headers: req.headers
    }

    const { statusCode, body }: HttpResponse = await middleware.execute(input)
    if (statusCode >= 200 && statusCode < 400) {
      req.body.ownerId = body
      return next()
    }
    res.status(statusCode).json({ error: body.message })
  }
}
