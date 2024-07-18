import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { ListCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/list-category-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class ListCategoryController implements ControllerInterface {
  constructor (private readonly usecase: ListCategoryUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body?.ownerId)
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
