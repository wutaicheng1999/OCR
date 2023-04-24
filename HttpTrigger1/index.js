module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const messages = req.body;

    // for (let i = 0; i < messages.length; i++) {
    //     context.bindings.output = messages[i];
    //     context.log(messages[i]);
    // };

    context.bindings.output = messages;

    context.res = {
        status: 200,
        body: "Messages added to queue successfully"
    };
}