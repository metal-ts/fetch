export type Procedure<I> = (arg: I) => void
export interface ProcedureRegistration<I> {
    $: Procedure<I>
    once: boolean
}
export class ProcedureSet<I> {
    private readonly registeredProcedure: Set<ProcedureRegistration<I>> =
        new Set()

    private procedureList: Array<ProcedureRegistration<I>> = []
    public constructor() {}

    public get executor(): Procedure<I> {
        return (arg: I): void => {
            const executionList = this.procedureList
            for (const procedure of executionList) {
                procedure.$(arg)
                if (procedure.once) {
                    this.remove(procedure)
                }
            }
        }
    }

    public use(procedure: Procedure<I>, once: boolean = false): void {
        this.registeredProcedure.add({
            $: procedure,
            once,
        })
        this.procedureList = Array.from(this.registeredProcedure)
    }

    private remove(removeProcedure: ProcedureRegistration<I>): void {
        this.registeredProcedure.delete(removeProcedure)
        this.procedureList = Array.from(this.registeredProcedure)
    }
}
