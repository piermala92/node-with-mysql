const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db/db');


module.exports = (req,res,next) => {

    if(!req.headers.authorization) {
        return res.status(401).json(
            {
                success : false,
                errorCode: 401,
                message : "Authorization Failed"
            }
        )
    }

    let token = req.headers.authorization.split(" ")[1];

    try{

        let secretToken = jwt.verify(token,process.env.SECRET_TOKEN);
        console.log(secretToken);

        db.query("SELECT * FROM USERS WHERE ID=?", [secretToken.id],(err,data) => {

            if(err) return res.status(500).json({success:false, message: "Internal server error"});

            console.log(data);

        })
    
        next();

    } catch(error) {

        res.status(401).json(
            {
                success : false,
                errorCode: 401,
                message : "Authorization Failed"
            }
        )

    }

}