import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type ProductData = {
  categoryId: string
  ownerId: string
  title: string
  description: string
  price: number
}

export class ProductEntity {
  constructor (
    public readonly id: string,
    public readonly categoryId: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}

  public static build (input: ProductData): ProductEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: ProductData): void {
    const requiredFields: Array<keyof ProductData> = ['categoryId', 'ownerId', 'title', 'description', 'price']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static create (input: ProductData): ProductEntity {
    return new ProductEntity(randomUUID(), input.categoryId, input.ownerId, input.title, input.description, input.price, new Date(), null)
  }
}
