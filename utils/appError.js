 class AppError extends Error{
    constructor(message, errors, statusCode){
        super(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail': 'error';
        this.errors = errors;
        this.isOperational = true;
    }
}

module.exports = AppError;