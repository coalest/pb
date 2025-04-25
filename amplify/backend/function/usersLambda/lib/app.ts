import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const ddbClient = new DynamoDBClient({
  region: process.env.TABLE_REGION,
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const path = "/users";

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/*****************************************
 * HTTP Get method to retrieve single user *
 *****************************************/

// TODO: Refactor with User.findById() for fetching User
app.get(path + "/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  const getItemParams = {
    TableName: tableName,
    Key: {
      id: userId,
    },
  };

  try {
    const { Item } = await ddbDocClient.send(new GetCommand(getItemParams));

    if (Item) {
      res.status(200).json(Item);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/************************************
 * HTTP post method for creating a user *
 *************************************/

// TODO: The logic for new user defaults should belong in the User class
app.post(path, async function (req: Request, res: Response) {
  const userId = crypto.randomUUID();
  const putItemParams = {
    TableName: tableName,
    Item: {
      id: userId,
      score: 0,
      predictions: [],
    },
  };
  try {
    await ddbDocClient.send(new PutCommand(putItemParams));
    res.status(200).json({ id: userId, score: 0, predictions: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export { app };
