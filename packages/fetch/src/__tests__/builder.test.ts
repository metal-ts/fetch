import { describe, expect, it } from 'vitest'
import { FetchBuilder } from '../core/fetcher/builder'
import { label } from './utils/test.label'

describe(label.unit('FetchBuilder'), () => {
    const builder = new FetchBuilder()

    it(label.case('should set method'), () => {
        const method = 'GET'
        const result = builder.setMethod(method)

        expect(builder.method).toBe(method)
        expect(result).toBe(builder)
    })

    it(label.case('should set url'), () => {
        const url = 'https://example.com'
        const result = builder.setUrl(url)

        expect(builder.url).toBe(url)
        expect(result).toBe(builder)
    })

    it(label.case('should set cache'), () => {
        const cache = 'no-cache'
        const result = builder.setCache(cache)

        expect(builder.cache).toBe(cache)
        expect(result).toBe(builder)
    })

    it(label.case('should set body'), () => {
        const body = { count: 1 }
        const result = builder.setBody(JSON.stringify(body))

        expect(builder.body).toBe(JSON.stringify(body))
        expect(result).toBe(builder)
    })

    it(label.case('should set headers'), () => {
        const headers = {
            'Content-Type': 'application/json',
        }
        const result = builder.setHeaders(headers)

        expect(builder.headers).toEqual(headers)
        expect(result).toBe(builder)
    })

    it(label.case('should set credentials'), () => {
        const credentials = 'same-origin'
        const result = builder.setCredentials(credentials)

        expect(builder.credentials).toBe(credentials)
        expect(result).toBe(builder)
    })

    it(label.case('should set redirect'), () => {
        const redirect = 'follow'
        const result = builder.setRedirect(redirect)

        expect(builder.redirect).toBe(redirect)
        expect(result).toBe(builder)
    })

    it(label.case('should set referrer'), () => {
        const referrer = 'client'
        const result = builder.setReferrer(referrer)

        expect(builder.referrer).toBe(referrer)
        expect(result).toBe(builder)
    })

    it(label.case('should set referrer policy'), () => {
        const referrerPolicy = 'no-referrer'
        const result = builder.setReferrerPolicy(referrerPolicy)

        expect(builder.referrerPolicy).toBe(referrerPolicy)
        expect(result).toBe(builder)
    })

    it(label.case('should set integrity'), () => {
        const integrity = 'sha256-abc'
        const result = builder.setIntegrity(integrity)

        expect(builder.integrity).toBe(integrity)
        expect(result).toBe(builder)
    })

    it(label.case('should set keepalive'), () => {
        const keepalive = false
        const result = builder.setKeepalive(keepalive)

        expect(builder.keepalive).toBe(keepalive)
        expect(result).toBe(builder)
    })

    const abortController: AbortController = new AbortController()
    it(label.case('should set signal'), () => {
        const result = builder.setSignal(abortController.signal)

        expect(builder.signal).toBe(abortController.signal)
        expect(result).toBe(builder)
    })

    it(label.case('should set window'), () => {
        const window = null
        const result = builder.setWindow(window)

        expect(builder.window).toBe(window)
        expect(result).toBe(builder)
    })

    it(label.case('should set mode'), () => {
        const mode = 'cors'
        const result = builder.setMode(mode)

        expect(builder.mode).toBe(mode)
        expect(result).toBe(builder)
    })

    it(label.case('should return default fetch option'), () => {
        const defaultOption = builder.defaultFetchOption

        expect(defaultOption).toEqual({
            headers: {
                'Content-Type': 'application/json',
            },
            referrerPolicy: 'no-referrer',
            credentials: 'same-origin',
            integrity: 'sha256-abc',
            keepalive: false,
            referrer: 'client',
            redirect: 'follow',
            method: 'GET',
            signal: abortController.signal,
            window: null,
            cache: 'no-cache',
            mode: 'cors',
            priority: 'auto',
            body: JSON.stringify({
                count: 1,
            }),
        })
    })
})
