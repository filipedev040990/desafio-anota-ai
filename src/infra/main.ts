import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import { logger } from '@/shared/helpers/logger.helper'
import { router } from './routes'
import { consumeQueueEmitCatalog } from './tasks/consume-queue-emit-catalog'
import { createQueueFIFO } from './tasks/create-queues'

const start = async (): Promise<void> => {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/v1', router)

  await createQueueFIFO()
  await consumeQueueEmitCatalog()

  const port = process.env.PORT ?? 3000
  app.listen(port, () => logger.info(`Server running at port ${port}`))
}

void start()
