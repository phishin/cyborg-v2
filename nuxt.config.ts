// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  components: true,
  pages: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      link: [
          // favicon
        { rel: 'icon', type: "image/png", href: "/assets/img/favicon/favicon-96x96.png", sizes:"96x96"},
        { rel: 'icon', type: "image/svg+xml", href: "/assets/img/favicon/favicon.svg" },
        { rel: 'icon', type: "shortcut icon", href: "/assets/img/favicon/favicon.ico" },
        { rel: 'icon', type: "apple-touch-icon", href: "/assets/img/favicon/apple-touch-icon.png" },
        { rel: 'icon', type: 'image/x-icon', href: '/assets/img/favicon/favicon.ico' },

          // google fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
        }
      ]
    },
  },
  compatibilityDate: '2024-11-01',
  plugins: [
    { src: '~/plugins/gsap.client.js', mode: 'client' },
    { src: '~/plugins/firebase.client.js', mode: 'client' },
    { src: '~/plugins/global-dom-events.client.js', mode: 'client' },
    { src: '~/plugins/lazyload.client.js', mode: 'client' },
  ],
  devtools: {
    enabled: true
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  tailwindcss: {
    configPath: 'tailwind.config.js'
  }
})
