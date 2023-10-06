const { Sequelize } = require('sequelize');

const client = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
    updatedAt: 'updated_at',
  },
});

module.exports = client;
