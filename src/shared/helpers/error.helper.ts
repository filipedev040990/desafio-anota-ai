import { InvalidParamError, MissingParamError } from '../errors'
import { HttpResponse } from '../types'
import { badRequest, serverError } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError) {
    return badRequest(error)
  }
  return serverError(error)
}
