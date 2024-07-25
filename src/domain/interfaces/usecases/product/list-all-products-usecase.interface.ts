import { ProductRepositoryData } from '../../repositories/product-repository.interface'

export interface ListAllProductsUseCaseInterface {
  execute: (ownerId: string) => Promise<ProductRepositoryData [] | null>
}
