"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    return strapi
      .query("bikes")
      .find(params, [
        "user",
        "user.city",
        "user.country",
        "user.entity_registrations",
        "brands",
        "secondary_colors",
        "color",
        "serial_number_photo",
        "invoice_photo",
        "bike_photo",
        "category",
        "materials",
        "wheel_size",
        "suspension_types",
        "year",
        "for_stolen",
        "for_classified",
      ]);
  },
};
