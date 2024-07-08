import { MissingParamError } from '@/shared/errors'
import { CatalogItemData, CatalogItemEntity } from './catalog-item.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyId')
}))

describe('CatalogItemEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = CatalogItemEntity
    input = {
      productId: 'anyProductId',
      catalogId: 'AnyCatalogId'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field is not provided', async () => {
    const requiredFields: Array<keyof CatalogItemData> = ['productId', 'catalogId']

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
      productId: 'anyProductId',
      catalogId: 'AnyCatalogId',
      createdAt: new Date(),
      updatedAt: null
    })
  })
})
