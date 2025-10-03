import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

// export function to connect with database.

const db = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("database connection successful!!");
    })

    .catch((error) => {
        console.log("error conecting to database : ", error);
    })
}

export default db;