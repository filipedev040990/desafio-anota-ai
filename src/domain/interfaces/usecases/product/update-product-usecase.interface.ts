export type UpdateProductInput = {
  id: string
  ownerId: string
  categoryId?: string
  title?: string
  description?: string
  price?: number
}

export interface UpdateProductUseCaseInterface {
  execute: (input: UpdateProductInput) => Promise<void>
}
