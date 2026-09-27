const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if(err.name === "CastError"){
        return res.status(400).json({
            error: "Invalid ID"
        })
    }
    if(err.name === "ValidationError"){
        return res.status(400).json({
            error: err.message
        })
    }

    res.status(500).json({
        error: "Something went wrong"
    })
};

export default errorHandler;