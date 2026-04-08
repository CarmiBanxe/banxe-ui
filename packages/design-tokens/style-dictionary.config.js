/** @type {import('style-dictionary').Config} */
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'banxe',
      buildPath: 'build/css/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
}
