exports.successResponse = (res, statusCode, data, message = "Success") => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

exports.errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
