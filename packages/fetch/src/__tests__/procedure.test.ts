import { describe, expect, it } from 'vitest'
import { Procedure, ProcedureSet } from '../utils/procedure'
import { label } from './utils/test.label'

describe(label.unit('Procedure'), () => {
    const procedure = new ProcedureSet<Array<number>>()
    let counter = 0

    it(label.case('should register procedure unit'), () => {
        const summation: Procedure<Array<number>> = (res) => {
            counter += res.reduce((acc, curr) => acc + curr, 0)
            // console.log("EXECUTION", res)
        }
        const logger: Procedure<Array<number>> = () => {
            // console.log("COUNTER:", counter)
        }
        procedure.use(summation, true)
        procedure.use(logger)
    })

    it(label.case('should execute procedures'), () => {
        procedure.executor([1, 2, 3])
        expect(counter).toBe(6)
        procedure.executor([1, 2, 3])
        expect(counter).toBe(6)
        procedure.executor([1, 2, 3])
        expect(counter).toBe(6)
    })
})
