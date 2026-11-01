const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const connectionParams = {
            // user: process.env.MONGO_USERNAME,
            // pass: process.env.MONGO_PASSWORD,
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
        };

        const useDBAuth = process.env.USE_DB_AUTH || false;
        if (useDBAuth) {
            connectionParams.user = process.env.MONGO_USERNAME;
            connectionParams.pass = process.env.MONGO_PASSWORD;
        }

        const uri =
            process.env.MONGO_CONN_STR ||
            process.env.MONGO_URI ||
            process.env.DB_URI ||
            process.env.DB;

        console.log("Mongo URI resolved to:", uri);

        if (!uri) {
            throw new Error(
                "No Mongo URI env var set! Checked MONGO_CONN_STR, MONGO_URI, DB_URI, DB"
            );
        }

        await mongoose.connect(uri, connectionParams);
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
    }
};