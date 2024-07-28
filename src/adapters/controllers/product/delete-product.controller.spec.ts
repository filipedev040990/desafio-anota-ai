import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { ProductRepositoryData } from '@/domain/interfaces/repositories/product-repository.interface'
import { DeleteProductController } from './delete-product.controller'
import { DeleteProductUseCaseInterface } from '@/domain/interfaces/usecases/product/delete-product-usecase.interface'
import { mock } from 'jest-mock-extended'

const usecase = mock<DeleteProductUseCaseInterface>()

describe('DeleteProductController', () => {
  let sut: DeleteProductController
  let input: HttpRequest

  beforeEach(() => {
    sut = new DeleteProductController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId'
      },
      params: {
        id: 'anyProductId'
      }
    }
  })

  test('should call DeleteProductUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith('anyProductId', 'anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })

  test('should return a correct error if DeleteProductUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
