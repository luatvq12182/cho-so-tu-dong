const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });
