import { HttpRequest } from '@/shared/types'
import { CreateProductController } from './create-product.controller'
import { mock } from 'jest-mock-extended'
import { CreateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/create-category-usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'

const usecase = mock<CreateCategoryUseCaseInterface>()

describe('CreateProductController', () => {
  let sut: CreateProductController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateProductController(usecase)
    input = {
      body: {
        categoryId: 'anyCategoryId',
        ownerId: 'anyOwnerId',
        title: 'anyTitle',
        description: 'anyDescription',
        price: 5000
      }
    }
    usecase.execute.mockResolvedValue({ id: 'anyId' })
  })

  test('should call CreateCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 201, body: { id: 'anyId' } })
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
