export default defineNuxtConfig({
  compatibilityDate: "2025-08-01",
  runtimeConfig: {
    adminUser: process.env.NUXT_ADMIN_USER || "admin",
    adminPass: process.env.NUXT_ADMIN_PASS || "",
  },
  app: {
    head: {
      title: "ペラっと | Peratto",
      htmlAttrs: { lang: "ja" },
      link: [
        { rel: "icon", href: "/sozai/nanosuke.png", type: "image/png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap",
        },
      ],
    },
  },
  css: ["~/assets/css/stage.css"],
})
