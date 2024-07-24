import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { UpdateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/update-product-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class UpdateProductController implements ControllerInterface {
  constructor (private readonly usecase: UpdateProductUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const data = {
        id: input?.params?.id,
        ...input?.body
      }
      await this.usecase.execute(data)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
