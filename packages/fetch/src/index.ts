import { FetchBuilder, type FetchUnitShape, builder } from './core/fetcher'
import { GetRouterConfig, router } from './core/router'
import { Middleware } from './utils/middleware'

/**
 * @description Metal Fetch Root
 */
export const f = {
    builder,
    router,
    Middleware,
}

export type { GetRouterConfig, FetchUnitShape, FetchBuilder }
