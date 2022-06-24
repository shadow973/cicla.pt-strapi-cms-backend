module.exports = ({ env }) => ({
  email: {
    provider: "smtp",
    providerOptions: {
      host: "smtp.cicla.pt",
      port: 465,
      secure: true,
      username: "cicla@cicla.pt",
      password: "vcA]B9e2f?z0",
      rejectUnauthorized: false,
      requireTLS: true,
      connectionTimeout: 1,
    },
    settings: {
      from: "info@cicla.pt",
      replyTo: "info@cicla.pt",
    },
  },
});

// module.exports = ({ env }) => ({
//   email: {
//     provider: "smtp",
//     providerOptions: {
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       username: "softraw6261@gmail.com",
//       password: "ABC@123456789",
//       rejectUnauthorized: true,
//       requireTLS: true,
//       connectionTimeout: 1,
//     },
//     settings: {
//       from: "softraw6261@gmail.com",
//       replyTo: "softraw6261@gmail.com",
//     },
//   },
// });

