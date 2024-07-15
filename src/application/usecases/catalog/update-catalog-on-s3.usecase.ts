import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { bucketInterface } from '@/domain/interfaces/tools/bucket.interface'
import { UpdateCatalogOnS3Interface } from '@/domain/interfaces/usecases/catalog/update-catalog-on-s3-usecase.interface'
import constants from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

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

    const bucketName = constants.CATALOG_BUCKET_NAME

    await this.bucketService.createOrUpdateObject({
      Bucket: bucketName,
      Key: `${bucketName}/${ownerId}.json`,
      Body: JSON.stringify(catalogs),
      ContentType: 'application/json'
    })
  }
}
