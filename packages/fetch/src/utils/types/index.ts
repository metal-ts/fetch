/* eslint-disable @typescript-eslint/ban-types */

export type IncludeString = string & {}

export type JSON_Supported = string | number | boolean | null
export type JSON =
    | Record<string, JSON_Supported>
    | Array<JSON_Supported>
    | string
    | number
    | boolean
    | null

export type ConcreteBoolean = true | false

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type OmitUnknown<T> = Prettify<{
    [K in keyof T as T[K] extends infer U
        ? unknown extends U
            ? never
            : K
        : never]: T[K]
}>

export type ToRequiredField<
    TargetRecord,
    Keys extends keyof TargetRecord,
> = Prettify<Omit<TargetRecord, Keys> & Required<Pick<TargetRecord, Keys>>>

export type ToOptionalField<
    TargetRecord,
    Keys extends keyof TargetRecord,
> = Prettify<Omit<TargetRecord, Keys> & Partial<Pick<TargetRecord, Keys>>>

type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N
export type OptionalAndNeverAtUnknown<RecordT> = Prettify<
    {
        [Key in keyof RecordT as IfUnknown<
            RecordT[Key],
            never,
            Key
        >]: RecordT[Key]
    } & Partial<{
        [Key in keyof RecordT as IfUnknown<RecordT[Key], Key, never>]: never
    }>
>
