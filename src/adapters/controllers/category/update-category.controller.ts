import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { UpdateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class UpdateCategoryController implements ControllerInterface {
  constructor (private readonly usecase: UpdateCategoryUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const data = {
        id: input?.params.id,
        ...input?.body
      }
      await this.usecase.execute(data)
      return success(201, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
