import { CategoryData, CategoryEntity } from '@/domain/entities/category/category.entity'
import { CreateCategoryUseCase } from './create-category.usecase'
import { mock } from 'jest-mock-extended'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'

const categoryRepository = mock<CategoryRepositoryInterface>()
const ownerRepository = mock<OwnerRepositoryInterface>()
const fakeOwner = {
  id: 'anyOwnerId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: null
}
const fakeCategoryEntity = {
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'AnyTitle',
  description: 'anyDescription',
  createdAt: new Date(),
  updatedAt: null
}

describe('CreateCategoryUseCase', () => {
  let sut: CreateCategoryUseCase
  let input: CategoryData

  beforeAll(() => {
    sut = new CreateCategoryUseCase(ownerRepository, categoryRepository)
    input = {
      ownerId: 'anyOwnerId',
      description: 'anyDescription',
      title: 'anyTitle'
    }
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    jest.spyOn(CategoryEntity, 'build').mockReturnValue(fakeCategoryEntity)
  })

  test('should call Category once and with correct values', async () => {
    const spy = jest.spyOn(CategoryEntity, 'build')
    await sut.execute(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(input)
  })

  test('shold call OwnerRepository.getById once and with correct values', async () => {
    await sut.execute(input)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('shold throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('shold call CategoryRepository.save once and with correct values', async () => {
    await sut.execute(input)
    expect(categoryRepository.save).toHaveBeenCalledTimes(1)
    expect(categoryRepository.save).toHaveBeenCalledWith(fakeCategoryEntity)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ id: 'anyCategoryId' })
  })
})
