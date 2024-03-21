// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      redirectUri: process.env.redirectUri
    }
  },
})
