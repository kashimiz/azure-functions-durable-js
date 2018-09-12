const df = require("durable-functions");

module.exports = df(function*(context){
    context.log("Starting any-a-or-b sample");

    const tasks = [];
    tasks.push(context.df.callActivity("F1"));
    tasks.push(context.df.callActivity("F2"));

    const output = yield context.df.Task.any(tasks);
    return output.result;
});