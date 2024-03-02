require("express-async-errors");
const migrationsRun =  require("./database/sqlite/migrations");
const AppError =  require("./utils/AppError");

const express = require("express");
const routes = require("./routes");

migrationsRun();

const app = express();
app.use(express.json());

app.use(routes);


// tem que ser nessa ordem 
// error, request, response, next
app.use(( error, request, response, next ) => {

  // se o erro é gerado pelo cliente segue esse if 
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status:"error",
      message: error.message
    });
  }

  // se é um erro pelo lado do servidor 

  console.error(error);


  return response.status(500).json({
    status:"error",
    message:"Internal server error",
  })

});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running n Port ${PORT}`))
