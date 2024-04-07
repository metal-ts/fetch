# Generator

1. script that generates api router via `JSON schema`
    1. Schema builder script: https://github.com/StefanTerdell/json-schema-to-zod?tab=readme-ov-file#readme
2. API Structure query script
    1. Input: `query url`
    2. Returns:
        1. api endpoint structure
            1. type: `GET` | `POST` | `PUT` | `DELETE`
            2. path: `string`
            3. query_schema: `JSON schema`
            4. response_schema: `JSON schema`
            5. status_code: `number`
3. Build router automatically
    1. Input: `api endpoint structure`
    2. Output: `router`
