import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { bucketInterface } from '@/domain/interfaces/tools/bucket.interface'
import { UpdateCatalogOnS3Interface } from '@/domain/interfaces/usecases/catalog/update-catalog-on-s3-usecase.interface'
import constants from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { logger } from '@/shared/helpers/logger.helper'

export class UpdateCatalogOnS3 implements UpdateCatalogOnS3Interface {
  constructor (
    private readonly catalogRepository: CatalogRepositoryInterface,
    private readonly bucketService: bucketInterface
  ) {}

  async execute (ownerId: string): Promise<void> {
    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    const catalogs = await this.catalogRepository.getFullCatalog(ownerId)
    if (!catalogs) {
      throw new InvalidParamError('ownerId')
    }

    await this.bucketService.createOrUpdateObject({
      Bucket: constants.CATALOG_BUCKET_NAME,
      Key: `${ownerId}.json`,
      Body: JSON.stringify(catalogs),
      ContentType: 'application/json'
    })

    logger.info(`Updating catalog: ${ownerId}`)
  }
}
