/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const bodyParser = require("body-parser");
const express = require("express");

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const path = "/users";

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/************************************
 * HTTP Get method to list objects *
 ************************************/

// app.get(path, async function (req, res) {
//   var params = {
//     TableName: tableName,
//     Select: "ALL_ATTRIBUTES",
//   };
//
//   try {
//     const data = await ddbDocClient.send(new ScanCommand(params));
//     res.json(data.Items);
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: "Could not load items: " + err.message });
//   }
// });

/************************************
 * HTTP Get method to query objects *
 ************************************/

// app.get(path + hashKeyPath, async function (req, res) {
//   const condition = {};
//   condition[partitionKeyName] = {
//     ComparisonOperator: "EQ",
//   };
//
//   if (userIdPresent && req.apiGateway) {
//     condition[partitionKeyName]["AttributeValueList"] = [
//       req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,
//     ];
//   } else {
//     try {
//       condition[partitionKeyName]["AttributeValueList"] = [
//         convertUrlType(req.params[partitionKeyName], partitionKeyType),
//       ];
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ error: "Wrong column type " + err });
//     }
//   }
//
//   let queryParams = {
//     TableName: tableName,
//     KeyConditions: condition,
//   };
//
//   try {
//     const data = await ddbDocClient.send(new QueryCommand(queryParams));
//     res.json(data.Items);
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: "Could not load items: " + err.message });
//   }
// });

/*****************************************
 * HTTP Get method for get single user *
 *****************************************/
app.get(path + "/:id", async function (req, res) {
  const userId = req.params.id;

  const getItemParams = {
    TableName: tableName,
    Key: {
      id: userId,
    },
  };

  try {
    const { Item: User } = await ddbDocClient.send(
      new GetCommand(getItemParams),
    );

    if (User) {
      res.json(User);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url });
  }
});

/************************************
 * HTTP post method for creating a user *
 *************************************/

app.post(path, async function (req, res) {
  const userId = crypto.randomUUID();
  let putItemParams = {
    TableName: tableName,
    Item: {
      id: userId,
      score: 0,
      predictions: [],
    },
  };
  try {
    await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ id: userId });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
