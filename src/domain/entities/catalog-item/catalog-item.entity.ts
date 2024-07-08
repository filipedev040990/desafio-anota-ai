import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type CatalogItemData = {
  productId: string
  catalogId: string
}

export class CatalogItemEntity {
  constructor (
    public readonly id: string,
    public readonly productId: string,
    public readonly catalogId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}

  public static build (input: CatalogItemData): CatalogItemEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: CatalogItemData): void {
    const requiredFields: Array<keyof CatalogItemData> = ['productId', 'catalogId']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static create (input: CatalogItemData): CatalogItemEntity {
    return new CatalogItemEntity(randomUUID(), input.productId, input.catalogId, new Date(), null)
  }
}
