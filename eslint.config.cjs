module.exports = {
    env: {
        browser: true,
        'shared-node-browser': true,
        node: true,
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
    ],
    plugins: ['prettier', 'import', '@typescript-eslint'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    rules: {
        eqeqeq: 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'no-console': 'warn',
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        'import/order': [
            'error',
            {
                alphabetize: { order: 'asc', caseInsensitive: true },
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                ],
                'newlines-between': 'never',
                pathGroupsExcludedImportTypes: ['builtin'],
            },
        ],
        'sort-imports': [
            'error',
            {
                ignoreDeclarationSort: true,
            },
        ],
    },
    ignores: ['site', 'examples/*'],
}
