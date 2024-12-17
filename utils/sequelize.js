const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, 
  process.env.MYSQL_USERNAME, 
  process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging:false
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


  // sequelize.sync({ alter: true })
  // .then(() => console.log('Tables created successfully!'))
  // .catch(error => console.error('Error creating tables:', error));


module.exports = sequelize;