import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { mock } from 'jest-mock-extended'
import { CreateCatalogUseCaseInterface } from '@/domain/interfaces/usecases/catalog/create-catalog-usecase.interface'
import { CreateCatalogController } from './create-catalog.controller'

const usecase = mock<CreateCatalogUseCaseInterface>()

describe('CreateCatalogController', () => {
  let sut: CreateCatalogController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateCatalogController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId',
        categoryId: 'anyCategoryId',
        items: ['Product1Id', 'Product2Id']
      }
    }
    usecase.execute.mockResolvedValue({ id: 'anyCatalogId', bucketUrl: 'anyBucketUrl' })
  })

  test('should call CreateCatalogUseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 201, body: { id: 'anyCatalogId', bucketUrl: 'anyBucketUrl' } })
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
