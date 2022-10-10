const settings = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  }
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})


// module.exports = withPWA({})
module.exports = process.env.NODE_ENV === 'development' ? settings : withPWA({ settings })
