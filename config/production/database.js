module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
      default: {
          connector: 'bookshelf',
          settings: {
              client: 'mysql',
              host: env('DATABASE_HOST', 'localhost'),
              port: env.int('DATABASE_PORT', 3306),
              database: env('DATABASE_NAME', 'eduraiser'),
              username: env('DATABASE_USERNAME', 'admin'),
              password: env('DATABASE_PASSWORD', 'admin123'),
              ssl: env.bool('DATABASE_SSL', false),
          },
          options: {}
      },
  },
});