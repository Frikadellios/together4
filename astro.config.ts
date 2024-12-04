// @ts-check
// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import AutoImport from "unplugin-auto-import/astro";
import cloudflare from "@astrojs/cloudflare";
import * as path from "node:path";
import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

import tailwind from "@astrojs/tailwind";
import postCssOklabPolyfill from "@csstools/postcss-oklab-function";
import autoprefixer from "autoprefixer";
import cssDiscardComments from "postcss-discard-comments";
import tailwindcss from "tailwindcss";
import tailwindcssNesting from "tailwindcss/nesting";


export default defineConfig({
	site: "https://example.com",
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	vite: {
		css: {
			postcss: {
				plugins: [
					tailwindcssNesting(),
					tailwindcss({
						config: path.resolve(import.meta.dirname, "tailwind.config.ts"),
					}),
					postCssOklabPolyfill({ preserve: true }),
					autoprefixer(),
					cssDiscardComments({ removeAll: true }),
				],
			},
		},
		ssr: {
			external: ["node:buffer", "three"],
		},
	},
	integrations: [
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: {
				theme: "github-dark-dimmed",
			},
			gfm: true,
		}),
		sitemap(),
		react(),
		AutoImport({
			defaultExportByFilename: false,
			include: [/\.[tj]sx?$/, /\.md$/],
			packagePresets: ["detect-browser-es"],
			imports: ["react", "react-router", "react-i18next"],
			viteOptimizeDeps: true,
			injectAtEnd: true,
			dirs: ["./src/utils/*.ts", "./src/hooks"],
			dts: ".astro/auto-imports.d.ts",
		}),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		tailwind({
			nesting: true,
			applyBaseStyles: false,
		}),
	],
	adapter: cloudflare({
		imageService: "cloudflare",
		platformProxy: {
			enabled: true,
		},
	}),
});
