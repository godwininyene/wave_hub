const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const DB_NAME = process.env.MYSQL_DATABASE;
const DB_USER = process.env.MYSQL_USERNAME;
const DB_PASS = process.env.MYSQL_PASSWORD;
const DB_HOST = process.env.MYSQL_HOST;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

async function initializeDatabase() {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });

    // Create database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();

    console.log(`Database "${DB_NAME}" is ready.`);

    // Authenticate Sequelize
    await sequelize.authenticate();
    console.log('Database connection established successfully!');

    // Sync models
    // await sequelize.sync({ force: true });
    // console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase(); // Run the function to set up the database

module.exports = sequelize; // Export sequelize instance


// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE, 
//   process.env.MYSQL_USERNAME, 
//   process.env.MYSQL_PASSWORD, {
//   host: process.env.MYSQL_HOST,
//   dialect: 'mysql',
//   logging:false
// });

// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection established successfully!');
//   })
//   .catch((error) => {
//     console.error('Error connecting to database:', error);
//   });


//   sequelize.sync({ alter: true })
//   .then(() => console.log('Tables created successfully!'))
//   .catch(error => console.error('Error creating tables:', error));


// module.exports = sequelize;
