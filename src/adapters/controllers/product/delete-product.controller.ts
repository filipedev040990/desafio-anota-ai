import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { DeleteProductUseCaseInterface } from '@/domain/interfaces/usecases/product/delete-product-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class DeleteProductController implements ControllerInterface {
  constructor (private readonly usecase: DeleteProductUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.usecase.execute(input?.params?.id, input?.body?.ownerId)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
