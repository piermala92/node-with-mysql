const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path : '../.env'});


/// mapping error 
const errorsMap = require('../utilities/errorMapping');



/**
 * 
 *  REGISTER 
 * 
 */
exports.register = async (req, res) => {

    let { username, email, password } = req.body;   



    // bcrypt test
    bcrypt.hash(password, 8, (err, hashedPassword) => {

        if (err) res.status(500).json(err);


        let sqlQuery = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
        db.query(sqlQuery, [username, email, hashedPassword], (error, results) => {

            if (error) res.status(400).json({success : false, errorMessage : errorsMap.mapError(error.sqlMessage.split('key')[1], username, email)});

            res.json(results);

        })


    })

} 





/**
 * 
 *      LOGIN 
 * 
 */
exports.login = async (req,res) => {

    /** NUOVO APPROCCIO */
    let { username, password } = req.body;

    if(!username || !password) return res.status(400).json({success:false,message:"Please enter credentials!"});


    try {
        db.query("SELECT * from users WHERE username = ?",[username], async (error,results) => {

            if (error) res.status(500).json(error);

            if(!results || results.length == 0 || !(await bcrypt.compare(password,results[0].password)) ){

                return res.status(401).json({success : false, message : "Invalid credentials!"})

            }

            let token = jwt.sign(
                { id : results[0].id, username:username, email:results[0].email },
                process.env.SECRET_TOKEN,
                { expiresIn : "20s" }
            )

            /// let's set the cookie here
            let cookieOptions = {
                expires : new Date( Date.now() + 1 * 3600 * 1000 ),
                httpOnly : true
            }

            res.cookie('jwt',token,cookieOptions);

            /// object to return in api response
            let userData = {
                id : results[0].id,
                username : results[0].username,
                email : results[0].email,
                creationDate : results[0].creation_date
            }

            return res.json({ success : true, code : 200, message : "Login successful!", data : userData, token : token});

        });

    } catch (error) { 

        res.status(500).json({success : false, message : error});

    }


    /** VECCHIO APPROCCIO */
    /*let { username, password } = req.body;

    if(!username || !password) return res.status(400).json({success:false,message:"Invalid credentials!"});


    db.query("SELECT * from users WHERE username = ?",[username],(err,results) => {

        if (err) res.status(500).json(err);

        if(results.length > 0){

            let userPassword = results[0].password;

            bcrypt.compare(password,userPassword,(error,data) => {

                if(error){
                    return res.status(500).json({message : error})
                }

                if(data)
                {   
                    let userEmail = results[0].email;

                    let token = jwt.sign(
                        {username:username, email:userEmail},
                        process.env.SECRET_TOKEN,
                        {expiresIn : "1h"}
                    );

                    return res.json(
                        {
                            success : data,
                            message : "Login successful!",
                            token : token
                        }
                    );
                }


                return res.status(401).json(
                    {
                        success : data,
                        message : "Invalid credentials!"
                    }
                )


            })


        } else {

            res.status(400).json(
                {
                    message : "Error",
                    description : "Invalid credentials!"
                }
            )

        }



    })*/

}














/**
 * 
 *      VERIFY
 * 
 */
exports.verifyToken = async (req,res) => {

    let token = req.body.token;

    try{

        let secretToken = jwt.verify(token,process.env.SECRET_TOKEN);

        res.status(200).json(
            {
                validJwt : true,
                errorCode: 200,
                expiryDate : secretToken.exp
            }
        );

    } catch(error) {

        res.status(401).json(
            {
                validJwt : false,
                errorCode: 401
            }
        )

    }

}