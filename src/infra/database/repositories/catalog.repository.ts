import { CatalogItemRepositoryData, CatalogRepositoryData, CatalogRepositoryInterface, FullCatalogRepositoryData } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { prismaClient } from '../prisma-client'
import constants from '@/shared/constants'

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
    const fullCatalog = await prismaClient.catalog.findMany({
      select: {
        id: true,
        categoryId: true,
        ownerId: true,
        CatalogItem: {
          select: {
            catalogId: true,
            productId: true,
            product: {
              select: {
                title: true,
                description: true,
                price: true,
                Category: {
                  select: {
                    title: true,
                    description: true
                  }
                }
              }
            }
          }
        },
        owner: {
          select: {
            name: true
          }
        }
      },
      where: { ownerId }
    })

    if (!fullCatalog) {
      return null
    }

    return {
      owner: fullCatalog[0].owner.name,
      catalogs: fullCatalog.map(catalog => ({
        categoryTitle: catalog.CatalogItem[0].product.Category.title,
        categoryDescription: catalog.CatalogItem[0].product.Category.description,
        items: catalog.CatalogItem.map(item => ({
          title: item.product.title,
          description: item.product.description,
          price: item.product.price
        }))
      }))
    }
  }

  async getCatalogS3 (ownerId: string): Promise<string> {
    const bucketName = constants.CATALOG_BUCKET_NAME
    const region = process.env.AWS_REGION
    const key = `${ownerId}.json`
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
  }
}
