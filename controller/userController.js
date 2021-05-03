const db = require("../db/db");
const bcrypt = require("bcrypt");




/**
 * 
 *    GET ALL USERS
 * 
 */
exports.getUsers = (req,res) => {

    let sqlQuery = "SELECT * FROM users"
    db.query(sqlQuery, (error,result) => {
 
      if(error) throw error;

      console.log(result.map(
         data => {
            return {
               username : data.username,
               email : data.email
            }
         }
      ));

      res.json(result.map(

         data => {
            return {
               username : data.username,
               email : data.email
            }
         }
         
      ))



    })

}



/**
 * 
 *    GET USER BY ID   
 * 
 */
exports.getUserById = (req,res) => {

   let userId = req.params.userId;

   let sqlQuery = "SELECT * FROM users WHERE id=?";
   db.query(sqlQuery, [userId], (error,results) => {
 
      if(error) throw error;

      if(results.length == 0) return res.json({message : "User not found!"});

      res.json(results[0]);

   })

}







/**
 * 
 *    GET USER BY USERNAME OR BY EMAIL
 * 
 */
exports.searchUser = (req,res) => {

   let input = req.params.input;

   let sqlQuery = "SELECT * FROM users WHERE username like '%" + input + "%' or username like '%" + input + "%'";
   db.query(sqlQuery,(error,result) => {

      if (error) throw error;

      if (result.length == 0){

         console.log("Non ce n'è !");

         return res.status(404).json(
            {
               message : "No result match your search",
               description : "No items were found!"
            }
         )
      } 

      res.json(
         {
            length : result.length,
            success : true,
            data : result
         }
      );

   })

}






/**
 * 
 *    EDIT USER 
 * 
 */
exports.editUser = (req,res) => {

   let username = req.body.username;

   const userId = req.params.userId;

   let sqlQuery = "UPDATE users SET username=? WHERE id=?"
   db.query(sqlQuery,[username,userId],(error,result) => {

      if (error) throw error;

      res.status(201).json(
         {
            success : true,
            message : "User updated!",
            data : result
         }
      )



   })

}








/**
 * 
 *    CHANGE PASSWORD 
 * 
 */
exports.changePassword = (req,res) => {

   let userId = req.params.userId;
   let newPassword = req.body.newPassword;

   let sqlQuery = "UPDATE users SET password=? where id=?";


   bcrypt.hash(newPassword, 8, (err, hashedNewPassword) => {

      if (err) res.status(500).json(err); 
      


      db.query(sqlQuery, [hashedNewPassword, userId], (error) => {

         if (error) res.send("Error here!");
   
         res.json(
            {
               success : true,
               message : "Password updated correctly!"
            }
         )
   
      });

   }) 



} 







/**
 *    TEST 
 */
exports.test = (req,res) => {

   console.log("Test OK!");

   res.send("Ok user recognized!");

} 