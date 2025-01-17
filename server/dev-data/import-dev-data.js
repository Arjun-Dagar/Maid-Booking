const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const Maid = require("./../models/maidModel");
const Customer = require("../models/customerModel");
const Review = require("../models/reviewModel");

//connection to database
const DB = process.env.DATABASE;
const connectionParams = {
  useNewUrlParser: true,
};

mongoose
  .connect(DB, connectionParams)
  .then((con) => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

//reading files
const maids = JSON.parse(
  fs.readFileSync(`${__dirname}/test-maid-data.json`, "utf-8")
);
const customers = JSON.parse(
  fs.readFileSync(`${__dirname}/test-customer-data.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/test-review-data.json`, "utf-8")
);
// const bookings = JSON.parse(
//   fs.readFileSync(`${__dirname}/test-bookings-data`, "utf-8")
// );

//Import data to database

const importData = async () => {
  try {
    //await Maid.create(maids);
    //await Customer.create(customers);

    console.log("Data added successfully! ");
  } catch (err) {
    console.log(err + " ");
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    //await Maid.deleteMany();
    //await Customer.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
