const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path : '../.env'});



const db = mysql.createConnection(
    {
        host : process.env.DATABASE_HOST,
        port : 3306,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE
    }
);

db.connect((err) => { 

    if(err){
        throw error;
    } else {
        console.log("MySQL connected correctly...");
    }

});


module.exports = db;