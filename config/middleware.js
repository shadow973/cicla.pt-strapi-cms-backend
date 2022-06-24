module.exports = ({ env }) => ({
    load: {
        before: ["responseTime", "logger", "cors", "responses", "gzip"],
        order: ["requestAuth"],
        after: ["parser", "router"],
    },
    settings: {
        requestAuth: {
            enabled: false,
        },
        parser: {
            enabled: true,
            multipart: true,
            formidable: {
                maxFileSize: 1000000000
            }
        },
        cors: {
            enabled: true,
            origin: '*',
        },
        requestAuth: {
            enabled: false,
        },
    },
});