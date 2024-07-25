import { ProductRepositoryData } from '../../repositories/product-repository.interface'

export interface ListProductByIdUseCaseInterface {
  execute: (ownerId: string, productId: string) => Promise<ProductRepositoryData | null>
}
