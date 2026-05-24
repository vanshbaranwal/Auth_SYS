import mongoose from "mongoose";
import dontenv from "dotenv";

dontenv.config()


// export a function that connects to db

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongodb.");
    })
    .catch((err) => {
        console.log("error connecting to mongodb.");
    });
};

export default db;

