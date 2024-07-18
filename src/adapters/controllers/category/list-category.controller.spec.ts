import { HttpRequest } from '@/shared/types'
import { ListCategoryController } from './list-category.controller'
import { mock } from 'jest-mock-extended'
import { ListCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/list-category-usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { CategoryRepositoryData } from '@/domain/interfaces/repositories/category-repository.interface'

const usecase = mock<ListCategoryUseCaseInterface>()
const fakeCategories: CategoryRepositoryData [] = [{
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Any Category',
  description: 'Any Description',
  createdAt: new Date(),
  updatedAt: null
}, {
  id: 'anotherCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Another Category',
  description: 'Another Description',
  createdAt: new Date(),
  updatedAt: null
}]

describe('ListCategoryController', () => {
  let sut: ListCategoryController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListCategoryController(usecase)
    input = {
      body: {
        ownerId: 'anyId'
      }
    }
    usecase.execute.mockResolvedValue(fakeCategories)
  })

  test('should call ListCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body.ownerId)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: fakeCategories })
  })

  test('should return a correct error if ListOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
