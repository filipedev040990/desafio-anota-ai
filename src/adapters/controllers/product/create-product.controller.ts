import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { CreateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/create-product-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class CreateProductController implements ControllerInterface {
  constructor (private readonly usecase: CreateProductUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body)
      return success(201, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
