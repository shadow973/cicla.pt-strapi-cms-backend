module.exports = ({ env }) => ({
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    url: env('API_URL', 'https://api.cicla.pt'),
    admin: {
        auth: {
            secret: env("ADMIN_JWT_SECRET", "9e21a60049a8a2362d6131276c0451fc"),
        },
    },
});