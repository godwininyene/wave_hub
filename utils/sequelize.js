const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wave_hub', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
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