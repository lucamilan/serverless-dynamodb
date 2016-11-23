'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
const dynamo = new AWS.DynamoDB.DocumentClient()

const DYNAMO_MAX_REQS = 25
const DYNAMO_TABLE = process.env.TABLE_NAME;

function processRow(row) {
  const data = row.split(';');

  return {
    userid : Number(data[0])
  }
}

function putItems(items) {
  const puts = items.map(item => ({PutRequest: {Item: item}}))

  return new Promise((resolve, reject) => {
      var req = {};

      req[DYNAMO_TABLE] = puts;

      dynamo.batchWrite({
        RequestItems: req
      }, (err, data) => err ? reject(err) : resolve(data))
  })
}

module.exports.process = (event, context, callback) => { 

  const params = {
    Bucket: event.Records[0].s3.bucket.name, 
    Key: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))
  };

  s3.getObject(params, (err, data) => {
      if (err) {
        context.fail(err);
      } else {
        const ops = [];

        const items = data.Body.toString().split(/\r?\n/);

        items.shift();

        for (var i = 0; i < items.length; i += DYNAMO_MAX_REQS)
          ops.push(
            items.slice(i, i + DYNAMO_MAX_REQS).map(processRow)
          );

        const requests = ops.map(putItems);

        Promise.all(requests)
          .then(data => {
            console.log(data)
            context.succeed(data)
          })
          .catch(error => {
            console.log(error)
            context.fail(err)
          });
    }
  });
};