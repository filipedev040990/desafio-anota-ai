export type CreateProductInput = {
  ownerId: string
  products: Product []
}

export type Product = {
  categoryId: string
  items: Item []
}

export type Item = {
  title: string
  description: string
  price: number
}

export interface CreateProductUseCaseInterface {
  execute: (input: CreateProductInput) => Promise<void>
}
