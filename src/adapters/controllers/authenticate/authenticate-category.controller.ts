import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { AuthenticateUseCaseInterface } from '@/domain/interfaces/usecases/authenticate/authenticate-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class AuthenticateController implements ControllerInterface {
  constructor (private readonly usecase: AuthenticateUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body?.document, input?.body?.password)
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
