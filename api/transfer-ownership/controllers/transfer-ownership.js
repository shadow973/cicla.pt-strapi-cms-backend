"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
module.exports = {
  transferOwnershipEmail: async (ctx) => {
    let { bike, newOwnerEmail, initiate } = ctx.request.body;
    bike = await strapi.services.bikes.findOne({ id: bike });
    if (!bike) {
      return ctx.badRequest("Bike not found");
    }
    if (!newOwnerEmail) {
      return ctx.badRequest("New owner email not found");
    }
    const isEmail = emailRegExp.test(newOwnerEmail);

    if (!isEmail) {
      return ctx.badRequest("New owner email is invalid");
    }
    newOwnerEmail = newOwnerEmail.toLowerCase();

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

    try {
      let message = "",
        subject = "";
      if (initiate) {
        subject = "Bike Transfer Initiated";
        message = `
            Hello, Bike transfer for '${bike?.model} ${bike?.serial_number}' has been initiated. 
            <br>
            <br>
            Thank You.
        `;
      } else {
        subject = "Bike Transfer Completed";
        message = `
          Hello, Bike transfer for '${bike?.model} ${bike?.serial_number}' has been completed. 
          <br>
          <br>
          Thank You.
        `;
      }
      const sentEmail = await strapi.plugins["email"].services.email.send({
        to: [newOwnerEmail, ctx.state.user.email], // email recipient
        from:
          settings.from.email || settings.from.name
            ? `${settings.from.name} <${settings.from.email}>`
            : undefined,
        subject,
        text: message,
      });

      if (!sentEmail?.messageId) return ctx.badRequest("Unable to send email");

      return { success: true, message: "Transfer ownership email sent" };
    } catch (error) {
      return ctx.badImplementation("Unable to send email!");
    }
  },
};
