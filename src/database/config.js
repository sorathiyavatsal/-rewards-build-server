import Sequelize from 'sequelize';
import config from '../conf';

export const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
  host: config.database.host,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});
