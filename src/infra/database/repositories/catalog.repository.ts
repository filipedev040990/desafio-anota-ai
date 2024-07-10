import { CatalogItemRepositoryData, CatalogRepositoryData, CatalogRepositoryInterface, FullCatalog, FullCatalogRepositoryData } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { prismaClient } from '../prisma-client'

export class CatalogRepository implements CatalogRepositoryInterface {
  async save (data: CatalogRepositoryData): Promise<CatalogRepositoryData> {
    return await prismaClient.catalog.create({ data })
  }

  async saveItems (data: CatalogItemRepositoryData): Promise<void> {
    await prismaClient.catalogItem.create({ data })
  }

  async deleteItems (catalogId: string): Promise<void> {
    await prismaClient.catalogItem.deleteMany({ where: { catalogId } })
  }

  async getByOwnerIdAndCategoryId (ownerId: string, categoryId: string): Promise<CatalogRepositoryData | null> {
    return await prismaClient.catalog.findFirst({ where: { ownerId, categoryId } })
  }

  async getFullCatalog (ownerId: string): Promise<FullCatalogRepositoryData | null> {
    const fullCatalog = await prismaClient.owner.findFirst({
      select: {
        name: true,
        Category: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        Product: {
          select: {
            title: true,
            description: true,
            price: true,
            categoryId: true,
            ownerId: true
          }
        },
        Catalog: {
          select: {
            ownerId: true,
            categoryId: true
          }
        }
      },
      where: {
        id: ownerId
      }
    })

    const catalog: FullCatalog [] = []

    fullCatalog?.Category.map((category) => {
      const filteredProducts = fullCatalog.Product.filter((product) => product.categoryId === category.id && product.ownerId === ownerId)

      const mappedProducts = filteredProducts.map((product) => ({
        title: product.title,
        description: product.description,
        price: product.price
      }))

      catalog.push({
        categoryTitle: category.title,
        categoryDescription: category.description,
        items: mappedProducts
      })
      return catalog
    })

    const output = {
      owner: fullCatalog?.name,
      catalog
    }

    return output as any
  }
}
