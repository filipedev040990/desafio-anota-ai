import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { ListProductByIdController } from './list-product-by-id.controller'
import { ListProductByIdUseCaseInterface } from '@/domain/interfaces/usecases/product/list-product-by-id-usecase.interface'
import { mock } from 'jest-mock-extended'
import { ProductRepositoryData } from '@/domain/interfaces/repositories/product-repository.interface'

const usecase = mock<ListProductByIdUseCaseInterface>()
const fakeProduct: ProductRepositoryData | null = {
  id: 'anyProductId',
  ownerId: 'anyOwnerId',
  categoryId: 'anyCategoryId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}
describe('ListProductByIdController', () => {
  let sut: ListProductByIdController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListProductByIdController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId'
      },
      params: {
        id: 'anyProductId'
      }
    }
    usecase.execute.mockResolvedValue(fakeProduct)
  })

  test('should call ListProductByIdUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith('anyOwnerId', 'anyProductId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: fakeProduct })
  })

  test('should return a correct error if ListProductByIdUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
