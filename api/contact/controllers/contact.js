"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  sendEmailForContact: async (ctx) => {
    const { name, email, message, subject } = ctx.request.body;

    const pluginStore = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore
      .get({ key: "email" })
      .then((storeEmail) => {
        try {
          return storeEmail["email_confirmation"].options;
        } catch (error) {
          return {};
        }
      });

    if (!settings || !settings.from.email) {
      strapi.log.debug("Email settings not found");
      return ctx.badRequest(
        "Unable to send email, please check your email settings"
      );
    }

    const sentEmail = await strapi.plugins["email"].services.email.send({
      to:
        settings.from.email || settings.from.name
          ? `${settings.from.name} <${settings.from.email}>`
          : undefined, // email recipient
      from: email,
      subject: `Message from ${name} - ${subject}`,
      text: message,
    });
    if (!sentEmail?.messageId) return ctx.badRequest("Unable to send email");

    await strapi.services.contact.create({
      name,
      email,
      message,
      subject,
    });

    return {
      success: true,
      message: "successfully contacted!",
    };
  },
};
