/*
 * This is a utility file to help invoke and debug the lambda function. It is not included as part of the
 * bundle upload to Lambda.
 * 
 * Credentials:
 *  The AWS SDK for Node.js will look for credentials first in the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and then 
 *  fall back to the shared credentials file. For further information about credentials read the AWS SDK for Node.js documentation
 *  http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_the_Shared_Credentials_File_____aws_credentials_
 * 
 */


process.env['TABLE_NAME'] = 'yoox-mystyle-final-dev-eu-west-1-359585510514';
process.env['AWS_REGION'] = 'eu-west-1';
process.env['AWS_PROFILE'] = 'serverless';

var fs = require('fs');

//var app = require('./app.js');
//var event = JSON.parse(fs.readFileSync('./server/mocks/event-api.json', 'utf8').trim());

var app = require('./handler.js');
//var event = JSON.parse(fs.readFileSync('./backend/mocks/event-unlocker-get.json', 'utf8').trim());
var event = {};
event = JSON.parse(fs.readFileSync('./event.json', 'utf8').trim());

var context = { };
var callback = function() {

    console.log("Lambda Function Complete");
};

context.done = function () {
    console.log("Lambda Function Complete");
};

app.process(event, context, callback);
