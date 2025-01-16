// eslint.config.js
'use strict'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
    // Global ignore patterns
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/test/**',
            '**/*.js',
            'site',
            'examples/*',
        ],
    },
    // Configuration for TypeScript files
    {
        files: ['packages/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            prettier: prettierPlugin,
            import: importPlugin,
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            // Prettier and TypeScript rules
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
            '@typescript-eslint/no-unused-vars': 'warn',

            // Custom rules
            eqeqeq: 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-console': 'warn',
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
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.ts'],
                },
            },
        },
    },
]
