"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  sendEmailMessage: async (ctx) => {
    let { reciever, bike, message } = ctx.request.body;
    let sender = ctx.state.user;
    const frontMessageUrl = `${process.env.FRONT_URL}/my-account#inbox`;

    try {
      if (!message) return ctx.badRequest("Message required");
      if (!sender) return ctx.badRequest("Sender invalid");
      reciever = await strapi.plugins["users-permissions"].services.user.fetch({
        id: reciever,
      });
      if (!reciever) return ctx.badRequest("Reciever invalid");
      bike = await strapi.query("bikes").findOne({ id: bike });

      if (!bike) return ctx.badRequest("Bike invalid");

      const pluginStore = await strapi.store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
      });
      const settings = await pluginStore
        .get({ key: "email" })
        .then((storeEmail) => {
          try {
            return storeEmail["reset_password"].options;
          } catch (error) {
            return {};
          }
        });

      const sentEmail = await strapi.plugins["email"].services.email.send({
        to: reciever.email, // email recipient
        from:
          settings.from.email || settings.from.name
            ? `${settings.from.name} <${settings.from.email}>`
            : undefined,
        subject: "Mensagem da CICLA",
        text: `
            Olá!,<br>
            Recebeste uma mensagem sobre a bicicleta ${bike?.model}.
            <br>
            <br>
            <b>Podes ler aqui</b>: ${frontMessageUrl}
            <br>
            <br>
            Obrigado.
        `,
      });
      if (!sentEmail?.messageId) return ctx.badRequest("Unable to send email");

      return {
        success: true,
        message: "Mensagem enviada com sucesso",
      };
    } catch (e) {
      strapi.log.debug(e);
      return ctx.badImplementation("Something went wrong!");
    }
  },
};
