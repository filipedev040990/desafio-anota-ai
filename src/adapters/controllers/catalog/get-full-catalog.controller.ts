import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { GetCatalogByOwnerIdUseCaseInterface } from '@/domain/interfaces/usecases/catalog/get-catalog-by-ownerId.usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class GetCatalogByOwnerIdController implements ControllerInterface {
  constructor (private readonly usecase: GetCatalogByOwnerIdUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body?.ownerId)
      return success(201, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
