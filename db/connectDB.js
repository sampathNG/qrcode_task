const mongosee = require("mongoose");
const url =
  "mongodb+srv://ramuksampath5:passwords@cluster0.h9swq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongosee.connect(url);
    console.log("connected tp database");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = connectDB;
