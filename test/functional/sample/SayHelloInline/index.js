const df = require("../../../../lib/src");

module.exports = df(function*(context){
    const input = context.df.getInput();
    return `Hello, ${input}!`;
});