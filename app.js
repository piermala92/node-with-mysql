const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config({ path : './.env'});

/// Per leggere la request in formato json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/// Settare il cookie 
app.use(cookieParser());




const PORT = process.env.PORT;



/// Impostare il cors 
//app.use(cors( { origin : "http://localhost:" + PORT } )); 
app.use(cors());





/// Routes
const routes = require("./routes/apiRoutes");
app.use("/", routes);





/// Server 

app.listen(PORT,() => {
    console.log("Server listening on port " + PORT);
})