import { describe, expect, it } from 'vitest'
import { Middleware } from '../utils/middleware'
import { label } from './utils/test.label'

describe(label.unit('middleware'), () => {
    it(label.case('should add middleware'), () => {
        const middleware = new Middleware<{ counter: number }, { b: string }>()

        let counter = 0
        middleware.use([
            ({ next }) => {
                counter++

                next({
                    req: { counter },
                })
            },
            ({ next }) => {
                counter++

                next({
                    req: { counter },
                    res: {
                        b: 'love',
                    },
                })
            },
            ({ next }) => {
                counter++

                next({
                    req: { counter },
                })
            },
        ])

        middleware.execute({ counter }, { b: '2' })

        expect(counter).toBe(3)
    })
})
