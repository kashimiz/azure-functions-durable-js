module.exports = function (context, req) {
    context.log('"ping" function called');
    const res = {
        body: {
            "success": true,
        }
    }
    context.done(null, res);
};