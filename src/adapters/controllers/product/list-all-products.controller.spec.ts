import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { ListAllProductsUseCaseInterface, ListProductOutput } from '@/domain/interfaces/usecases/product/list-all-products-usecase.interface'
import { ListAllProductsController } from './list-all-products.controller'
import { mock } from 'jest-mock-extended'

const usecase = mock<ListAllProductsUseCaseInterface>()
const fakeProducts: ListProductOutput [] | null = [{
  category: 'anyCategoryId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}, {
  category: 'anotherCategoryId',
  title: 'anotherTitle',
  description: 'anotherDescription',
  price: 1500,
  createdAt: new Date(),
  updatedAt: null
}]
describe('ListAllProductsController', () => {
  let sut: ListAllProductsController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListAllProductsController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId'
      }
    }
    usecase.execute.mockResolvedValue(fakeProducts)
  })

  test('should call ListAllProductsUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: fakeProducts })
  })

  test('should return a correct error if ListAllProductsUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
