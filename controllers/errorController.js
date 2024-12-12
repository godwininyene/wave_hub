const AppError = require('./../utils/appError')

const handleJWTError = () =>new AppError('Invalid token. Please log in again!', '', 401)
const handleJWTExpireError = ()=> new AppError('Your token has expired! Please log in again.', '', 401)
const handleDuplicateFieldError = err =>{
    const field = err.keyValue;
    let error = {}
    for(const key in field){
        error = {
            [key]:`${key}(${field[key]}) is already in use. Please use another value`
        }
       
    }

    return new AppError('Invalid data supplied', error, 400)
}


const handleValidationErrorDB = (err)=>{   
    const errors= Object.values(err.errors).reduce((acc, el)=>{
        if(el.name == "CastError" ){
            acc[el.path] = `Invalid data provided for ${el.path}. Expected ${el.kind} but got (${el.value})`
           
        }else{
            acc[el.path] = el.message;
        }
      
      return acc;
    }, {})

    return new AppError('Invalid data supplied', errors, 400)

}

const handleCastErrorDb = err =>{
    let error = {}

    if(err.name == "CastError" || err.reason == null){
        error[err.path] = `Invalid data provided for ${err.path}. Expected ${err.kind} but got ${err.value}`
    }

    return new AppError('', error, 400)
}
const sendErrorProd = (err, req, res)=>{
    // A) API
    if(req.originalUrl.startsWith('/api')){
        // A) Operational, trusted error: Send error and message to client
        if(err.isOperational){
            return  res.status(err.statusCode).json({
                status:err.status,
                message:err.message,
                errors:err.errors
            })
        
        }
        // B) Programming or unknown error: Don't leak error details
        // 1) Log the error
        console.error('ERROR', err)
        // 2) Send generic response
        return res.status(500).json({
            status:'error',
            message:'Some went very wrong!',
        });
    }

    // B) RENDERED WEBSITE
    if(err.isOperational){
        return res.status(err.statusCode).render('error', {
            title:"Something went wrong",
            msg: err.message || Object.values(err.errors).join(', ')
        });
    }else{
        //Programming or unknown error: Don't leak error details
        // 1) Log the error
        console.error('ERROR HERE', err)
        // 2) Send generic response
        return res.status(500).render('error',{
            status:'Some went very wrong!',
            msg:'Please try again later.',
        });
    }
}
const sendErrorDev = (err, req, res)=>{
    // A) API
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            error:err
        });
    }

    // B) RENDERED WEBSITE
    return res.status(err.statusCode).render('error', {
        title:"Something went wrong",
        msg: err.message
    });
}


module.exports =(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err, req, res)

    }else if(process.env.NODE_ENV == 'production'){
      
        let error = err;
        if(error.name === 'CastError') error = handleCastErrorDb(error);
        if(error.name ==='ValidationError') error = handleValidationErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldError(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWTExpireError();
        sendErrorProd(error,  req, res)
    }
   
};


