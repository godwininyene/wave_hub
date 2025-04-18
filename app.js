const path = require('path')
const express = require('express');
const app = express();
const globalErrorController = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const postRouter = require('./routes/postRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const commentRouter = require('./routes/commentRoutes');
const subscriberRouter = require('./routes/subscriberRoutes');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser')

//Body parser, read data from req.body into body
app.use(express.json());
app.use(express.urlencoded({extended: true, limit:'10kb'}))
app.use(cookieParser())

//Define view engine
app.set('view engine', 'pug');
//Set views folder
app.set('views', path.join(__dirname, 'views'))

//Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

//TEST MIDDLEWARE
app.use((req, res, next)=>{
    next();
})
   
// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/subscribers', subscriberRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next)=>{
    next(new AppError(`The requested url ${req.originalUrl} was not found on this server!`, '', 404))
});

app.use(globalErrorController)


module.exports = app;