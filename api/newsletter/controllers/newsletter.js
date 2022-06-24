"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { nanoid } = require("nanoid");

module.exports = {
  createAndSendNewsletterConfirmation: async (ctx) => {
    const { email } = ctx.request.body;
    try {
      const emailExists = await strapi.services.newsletter.findOne({ email });
      if (emailExists && emailExists.confirmed) {
        return ctx.badRequest(null, [
          { messages: [{ id: "Newsletter.error.email.alreadyExists" }] },
        ]);
      } else if (emailExists && !emailExists.confirmed) {
        return ctx.badRequest(null, [
          { messages: [{ id: "Newsletter.error.email.notConfirmed" }] },
        ]);
      }
      const token = nanoid();
      try {
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
          to: email, // email recipient
          from:
            settings.from.email || settings.from.name
              ? `${settings.from.name} <${settings.from.email}>`
              : undefined,
          subject: "Newsletter Confirmation",
          text: `
                Hello, To confirm your subscription to our newsletter, please follow this link:
                <br>
                <a href="${strapi.config.server.url}/newsletters/confirm/${token}">${strapi.config.server.url}/newsletters/confirm/${token}</a> 
                <br>
                <br>
                Thank You.
            `,
        });
        if (!sentEmail?.messageId)
          return ctx.badRequest("Unable to send email");
      } catch (e) {
        strapi.log.debug(e);
        return ctx.badRequest("Unable to send email");
      }

      await strapi.services.newsletter.create({
        email,
        confirmed: false,
        token,
      });

      return {
        success: true,
        message: "Email added to newsletter, and confirmation sent!",
      };
    } catch (e) {
      strapi.log.debug(e);
      return ctx.badImplementation("Something went wrong!");
    }
  },
  verifyNewsletterConfirmation: async (ctx) => {
    const { token } = ctx.params;
    try {
      const newsletterDetailsExists = await strapi.services.newsletter.findOne({
        token,
      });
      if (!newsletterDetailsExists) {
        return ctx.redirect(process.env.FRONT_URL || "/");
      }

      if (newsletterDetailsExists && newsletterDetailsExists.confirmed) {
        return ctx.redirect(process.env.FRONT_URL || "/");
      } else if (
        newsletterDetailsExists &&
        !newsletterDetailsExists.confirmed
      ) {
        await strapi.services.newsletter.update(
          { id: newsletterDetailsExists.id },
          { confirmed: true }
        );
        return ctx.redirect(process.env.FRONT_URL || "/");
      }
    } catch (e) {
      strapi.log.debug(e);
      return ctx.redirect(process.env.FRONT_URL || "/");
    }
  },
};
