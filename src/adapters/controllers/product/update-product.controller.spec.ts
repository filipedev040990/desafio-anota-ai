import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { UpdateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/update-product-usecase.interface'
import { UpdateProductController } from './update-product.controller'
import { mock } from 'jest-mock-extended'

const usecase = mock<UpdateProductUseCaseInterface>()

describe('UpdateProductController', () => {
  let sut: UpdateProductController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateProductController(usecase)
    input = {
      params: {
        id: 'anyProductId'
      },
      body: {
        ownerId: 'anyOwnerId',
        title: 'anyTitle',
        description: 'anyDescription',
        price: 5000
      }
    }
  })

  test('should call UpdateCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith({
      id: 'anyProductId',
      ownerId: 'anyOwnerId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 5000
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })

  test('should return a correct error if UpdateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
