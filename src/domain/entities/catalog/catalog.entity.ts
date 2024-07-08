import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type CatalogData = {
  ownerId: string
  categoryId: string
  items: string []
}

export class CatalogEntity {
  constructor (
    public readonly id: string,
    public readonly ownerId: string,
    public readonly categoryId: string,
    public readonly items: string [],
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}

  public static build (input: CatalogData): CatalogEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: CatalogData): void {
    const requiredFields: Array<keyof CatalogData> = ['ownerId', 'categoryId']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }

    if (input?.items.length < 1) {
      throw new MissingParamError('items')
    }
  }

  private static create (input: CatalogData): CatalogEntity {
    return new CatalogEntity(randomUUID(), input.ownerId, input.categoryId, input.items, new Date(), null)
  }
}
