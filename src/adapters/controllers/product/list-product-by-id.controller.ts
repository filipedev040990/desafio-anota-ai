import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { ListProductByIdUseCaseInterface } from '@/domain/interfaces/usecases/product/list-product-by-id-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class ListProductByIdController implements ControllerInterface {
  constructor (private readonly usecase: ListProductByIdUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body?.ownerId, input?.params?.id)
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
