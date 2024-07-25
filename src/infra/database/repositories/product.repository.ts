import { ProductRepositoryData, ProductRepositoryInterface, UpdateProductRepositoryData } from '@/domain/interfaces/repositories/product-repository.interface'
import { prismaClient } from '../prisma-client'
import { ListProductOutput } from '@/domain/interfaces/usecases/product/list-all-products-usecase.interface'

export class ProductRepository implements ProductRepositoryInterface {
  async save (input: ProductRepositoryData): Promise<ProductRepositoryData> {
    return await prismaClient.product.create({
      data: {
        id: input.id,
        categoryId: input.categoryId,
        ownerId: input.ownerId,
        title: input.title,
        description: input.description,
        price: input.price,
        createdAt: input.createdAt
      }
    })
  }

  async getById (id: string): Promise<ProductRepositoryData | null> {
    return await prismaClient.product.findFirst({ where: { id } })
  }

  async getByIdAndCategoryId (id: string, categoryId: string): Promise<ProductRepositoryData | null> {
    return await prismaClient.product.findFirst({ where: { id, categoryId } })
  }

  async getByAllFields (categoryId: string, ownerId: string, title: string, description: string, price: number): Promise<ProductRepositoryData | null> {
    return await prismaClient.product.findFirst({ where: { ownerId, categoryId, title, description, price } })
  }

  async getByCategoryId (categoryId: string): Promise<ProductRepositoryData [] | null> {
    return await prismaClient.product.findMany({ where: { categoryId } })
  }

  async update (input: UpdateProductRepositoryData): Promise<void> {
    const { id, ownerId, ...data } = input
    await prismaClient.product.update({ where: { id }, data })
  }

  async getAll (ownerId: string): Promise<ListProductOutput [] | null> {
    const products = await prismaClient.product.findMany({
      select: {
        title: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        Category: {
          select: {
            title: true
          }
        }
      },
      where: { ownerId }
    })

    if (!products || !products.length) {
      return null
    }

    const output: ListProductOutput [] = products.map((product) => ({
      category: product.Category.title,
      title: product.title,
      description: product.description,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))

    return output
  }

  async getByIdAndOwnerId (productId: string, ownerId: string): Promise<ProductRepositoryData | null> {
    return await prismaClient.product.findFirst({ where: { id: productId, ownerId } })
  }
}
