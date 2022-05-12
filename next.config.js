// module.exports = {
//   i18n: {
//     locales: ['en', 'es'],
//     defaultLocale: 'en',
//   },
// }

const withPWA = require("next-pwa")

module.exports = withPWA({
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
})
