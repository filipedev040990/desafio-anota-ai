import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { DeleteCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/delete-category-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class DeleteCategoryController implements ControllerInterface {
  constructor (private readonly usecase: DeleteCategoryUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.usecase.execute(input?.params?.id, input?.body?.ownerId)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
