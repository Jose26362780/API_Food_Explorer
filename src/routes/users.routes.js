const { Router } = require("express");


const UsersController = require("../controllers/UsersController");


const usersRoutes = Router();


function myMiddleware(request, response, next){


  console.log("voce passou pelo Middleware");

 /* if(!request.body.isAdmin){
    return response.json({ message: "user unauthorized" });
  }*/

  next();

}




const usersController = new UsersController();

/*userRoutes.use(myMiddleware); // se eu quissese aplicar em todas*/

/* se for so uma rota coloco dentro da routa  */

usersRoutes.post("/", myMiddleware, usersController.create);
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;