import { CreateCatalogUseCase } from '@/application/usecases/catalog/create-catalog.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'
import { AwsSqsAdapter } from '@/infra/queue/aws/sqs.adapter'

export const makeCreateCatalogUsecaseFactory = (): CreateCatalogUseCase => {
  const ownerRepository = new OwnerRepository()
  const categoryRepository = new CategoryRepository()
  const productRepository = new ProductRepository()
  const catalogRepository = new CatalogRepository()
  const queueService = new AwsSqsAdapter()
  return new CreateCatalogUseCase(ownerRepository, categoryRepository, productRepository, catalogRepository, queueService)
}
