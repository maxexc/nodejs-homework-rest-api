const mongoose = require("mongoose")
const app = require('./app')


const { DB_HOST, PORT } = process.env;
console.log(DB_HOST);

mongoose.set("strictQuery", true);


mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT); 
    console.log(`Database connection at port ${PORT} successful`);
  })
  .catch((error) => { 
    console.log(error.message);
    process.exit(1)
  });
