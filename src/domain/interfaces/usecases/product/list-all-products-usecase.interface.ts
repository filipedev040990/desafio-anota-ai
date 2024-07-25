export type ListProductOutput = {
  category: string
  title: string
  description: string
  price: number
  createdAt: Date
  updatedAt: Date | null
}

export interface ListAllProductsUseCaseInterface {
  execute: (ownerId: string) => Promise<ListProductOutput [] | null>
}
