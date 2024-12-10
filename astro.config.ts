import * as path from 'node:path'
import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
// @ts-check
// @ts-check
import { defineConfig } from 'astro/config'
import AutoImport from 'unplugin-auto-import/astro'
import { remarkReadingTime } from './src/utils/readTime.ts'

import tailwind from '@astrojs/tailwind'
import postCssOklabPolyfill from '@csstools/postcss-oklab-function'
import autoprefixer from 'autoprefixer'
import cssDiscardComments from 'postcss-discard-comments'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'

export default defineConfig({
  site: 'https://example.com',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'material-theme-palenight',
      wrap: true
    }
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          tailwindcssNesting(),
          tailwindcss({
            config: path.resolve(import.meta.dirname, 'tailwind.config.ts')
          }),
          postCssOklabPolyfill({ preserve: true }),
          autoprefixer(),
          cssDiscardComments({ removeAll: true })
        ]
      }
    },
    ssr: {
      external: ['node:buffer', 'three']
    }
  },
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'material-theme-palenight',
        wrap: true
      },
      gfm: true
    }),
    sitemap(),
    react(),
    AutoImport({
      defaultExportByFilename: false,
      include: [/\.[tj]sx?$/, /\.md$/],
      packagePresets: ['detect-browser-es'],
      imports: ['react', 'react-router', 'react-i18next'],
      viteOptimizeDeps: true,
      injectAtEnd: true,
      dirs: ['./src/utils/*.ts', './src/hooks'],
      dts: '.astro/auto-imports.d.ts'
    }),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    }),
    tailwind({
      nesting: true,
      applyBaseStyles: false
    })
  ],
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  })
})
