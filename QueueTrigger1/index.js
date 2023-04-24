module.exports = async function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item', myQueueItem);
     // Parse the message body as a JSON object
    //const message = JSON.parse(myQueueItem);

    // Extract the URL from the message
    //const imageUrl = message.url;

    // Call the Computer Vision API to extract text from the image
    const response = await fetch ('https://warehouse-vision-api.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview', {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': 'c0cbcd7832e94aeba55720a8bf1fd885',
            'Content-Type': 'application/json'
        },
        body: `{'url':'${myQueueItem}'}`
    });
    context.log(response);
    const result = await response.json();
    context.log(result);
    const res = result["readResult"].content;
    const pairs = res.split(":");
    const last_value = pairs[pairs.length-1]
    const lines = res.split("\n");
    context.log(lines);
    const json = {};

    for (let i = 0; i < lines.length-1; i++) {
        if (lines[i+1].includes(":")) {
            const parts = lines[i].split(": ");
            json[parts[0]] = parts[1];
        } else {
            const parts = lines[i].split(": ");
            json[parts[0]] = last_value;
            break;
        }
    }

    context.log(json);
    

    // Write the output variable to the Cosmos DB
    context.bindings.cosmodb = JSON.stringify(json);

    context.res = {
        status: 200,
        body: "Product added to Cosmos DB"
    };
};


