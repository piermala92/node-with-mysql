const express = require("express");

const routes = express.Router();

const auth = require("../middleware/checkAuth");



/// Controller 
const userController = require("../controller/userController");
const authController = require("../controller/auth");



routes.get("/", auth, userController.getUsers);



routes.get("/test",(req,res) => {

    res.send("Ue Crmeelo");

});




/// REGISTER 
routes.post("/register", authController.register);



/// LOGIN 
routes.post("/login", authController.login);








/// GET USER BY ID 
routes.get("/:userId", userController.getUserById);





/// GET USER BY USERNAME OR BY EMAIL 
routes.get("/search/:input", userController.searchUser);





/// UPDATE USER
routes.patch("/:userId", userController.editUser);




/// CHANGE PASSWORD 
routes.patch("/change-password/:userId", userController.changePassword);



/// TEST CHECK AUTH
routes.get("/test-auth/test", auth, userController.test);




/// TEST CHECK TOKEN  (questo test chiama una funzione per controllare se il token sia valido o meno)
routes.post("/auth/verify-token", authController.verifyToken) ;



module.exports = routes;