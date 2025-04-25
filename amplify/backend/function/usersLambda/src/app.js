"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: process.env.TABLE_REGION,
});
const ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + "-" + process.env.ENV;
}
const path = "/users";
const app = (0, express_1.default)();
exports.app = app;
app.use(body_parser_1.default.json());
app.use(middleware_1.default.eventContext());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
/*****************************************
 * HTTP Get method to retrieve single user *
 *****************************************/
// TODO: Refactor with User.findById() for fetching User
app.get(path + "/:id", async (req, res) => {
    const userId = req.params.id;
    const getItemParams = {
        TableName: tableName,
        Key: {
            id: userId,
        },
    };
    try {
        const { Item } = await ddbDocClient.send(new lib_dynamodb_1.GetCommand(getItemParams));
        if (Item) {
            res.status(200).json(Item);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
/************************************
 * HTTP post method for creating a user *
 *************************************/
// TODO: The logic for new user defaults should belong in the User class
app.post(path, async function (req, res) {
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
        await ddbDocClient.send(new lib_dynamodb_1.PutCommand(putItemParams));
        res.status(200).json({ id: userId, score: 0, predictions: [] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(3000, function () {
    console.log("App started");
});
