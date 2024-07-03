import { ProductData } from '@/domain/entities/product/product.entity'

export interface CreateProductUseCaseInterface {
  execute: (input: ProductData) => Promise<{ id: string }>
}
