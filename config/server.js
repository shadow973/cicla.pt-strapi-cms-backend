module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1339),
  // url: env("API_URL", "https://api.cicla.pt"),
  // url: env('API_URL', 'https://2c36-182-68-227-216.ngrok.io'),
  url: env("API_URL", "http://localhost:1339"),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "160656dfcc2fa382556592bdcad483a5"),
    },
  },
});
