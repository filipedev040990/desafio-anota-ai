import { MissingParamError } from '@/shared/errors'
import { CatalogData, CatalogEntity } from './catalog.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyId')
}))

describe('CatalogEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = CatalogEntity
    input = {
      ownerId: 'anyOwnerId',
      categoryId: 'AnyTitle'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field is not provided', async () => {
    const requiredFields: Array<keyof CatalogData> = ['ownerId', 'categoryId']

    for (const field of requiredFields) {
      input[field] = undefined

      expect(() => {
        sut.build(input)
      }).toThrowError(new MissingParamError(field))

      input[field] = field
    }
  })

  test('should make a correct Category', async () => {
    const category = sut.build(input)
    expect(category).toEqual({
      id: 'anyId',
      ownerId: 'anyOwnerId',
      categoryId: 'AnyTitle',
      createdAt: new Date(),
      updatedAt: null
    })
  })
})
