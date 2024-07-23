import { HttpRequest } from '@/shared/types'
import { CreateProductController } from './create-product.controller'
import { mock } from 'jest-mock-extended'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { CreateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/create-product-usecase.interface'

const usecase = mock<CreateProductUseCaseInterface>()

describe('CreateProductController', () => {
  let sut: CreateProductController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateProductController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId',
        products: [{
          categoryId: 'anyCategoryId',
          items: [{
            title: 'anyTitle',
            description: 'anyDescription',
            price: 5000
          }]
        }]
      }
    }
  })

  test('should call CreateCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })

  test('should return a correct error if CreateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
