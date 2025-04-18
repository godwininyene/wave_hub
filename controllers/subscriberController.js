const Email = require('../utils/email');
const Subscriber = require('./../models/Subscriber');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

exports.createSubscriber = catchAsync(async(req, res, next)=>{
    const subscriber = await Subscriber.create(req.body);
    //send email to subscriber
     try {
        await new Email({name:subscriber.name, email:subscriber.email}, '').sendWelcome()
        // Send response after successful email
        res.status(201).json({
            status: 'success',
            data: {
                subscriber,
            },
        });
    } catch (error) {
        console.log('Error in controller',error)
        return next(new AppError("There was a problem sending the email.. Please try again later!", '', 500))
    }
});

exports.getAllSubscribers = catchAsync(async(reqq, res, next)=>{
    const subscribers = await Subscriber.findAll();
    res.status(200).json({
        result:subscribers.length,
        status:"success",
        data:{
            subscribers
        }
    });
})