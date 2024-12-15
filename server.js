const dotenv = require('dotenv');
const mongoose = require('mongoose')


process.on("uncaughtException", err=>{
    console.log(err.name, err.message)
    console.log('UNCAUGHT EXCEPTION *** Shutting down...')
    process.exit(1)
});


dotenv.config({path: './config.env'});

const app = require('./app');
let DB;

if (process.env.NODE_ENV === 'development') {
    DB = process.env.DB_LOCAL;
} else if (process.env.NODE_ENV === 'production') {
    DB = process.env.DB_LOCAL;
    // DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}

mongoose.connect(DB).then(() => {console.log('DB connection successfully')})

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`listening to request on ${port}`)
})

process.on("unhandledRejection", err=>{
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION *** Shutting down...')
    server.close(()=>{
        process.exit(1)
    })
});




