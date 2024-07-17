import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { UpdateOwnerUseCaseInterface } from '@/domain/interfaces/usecases/owner/update-owner-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class UpdateOwnerController implements ControllerInterface {
  constructor (private readonly usecase: UpdateOwnerUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.usecase.execute(input?.body)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
