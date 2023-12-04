// If there is an error then this will run
exports.get404 = (req,res,next)=>{
    const error = new Error("Not Found.");
    error.statusCode= 404;
    next(error);
};

// if there is internal server error then this will run
exports.get500 = (error, req, res, next)=>{
    const data = error.data;
     res.status(error.statusCode || 500);
     res.json({
        error: {
            message: error.message,
            data: data,
        },
     });
     
};