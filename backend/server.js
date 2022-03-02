const app = require('./app');
const connectDataBase = require("./config/database");
const cloudinary = require("cloudinary");

//Handling Uncaught error

process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncaught error`);
    process.exit(1);
})

//config

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}



connectDataBase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on https://localhost:${process.env.PORT}`);
})

// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Server is shutting down due to Unhandled Prmoise Rejection`);

    server.close(() => {
        process.exit(1);
    })
})