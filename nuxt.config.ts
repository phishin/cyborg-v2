// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-20',
  ssr: false,
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/',               // you probably already have this
        '/create-my-logo'  // ← add this line
      ],
      crawlLinks: true,    // still follow any <a> you have
      failOnError: false
    }
  },

  // all your head/meta tags
  app: {
    baseURL: '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        // favicons
        { rel: 'icon', type: 'image/png', href: '/assets/img/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/img/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/assets/img/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/assets/img/favicon/apple-touch-icon.png' },

        // google fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
        }
      ]
    },
    router: {
      base: '/'   // Pages is your root—no repo‑slug here
    }
  },

  // your client‑only plugins
  plugins: [
    { src: '~/plugins/firebase.client.js', mode: 'client' },
    { src: '~/plugins/gsap.client.js',     mode: 'client' },
    { src: '~/plugins/global-dom-events.client.js', mode: 'client' },
    { src: '~/plugins/lazyload.client.js',  mode: 'client' }
  ],

  // Tailwind + your CSS
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind-output.css'],


  // devtools if you like
  devtools: { enabled: true }
})
