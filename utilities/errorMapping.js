exports.mapError = (error, username, email) => {

    switch(error){

        case "ER_DUP_ENTRY":
            return "User already exists!"

        case " 'username_UNIQUE'":
            return "User with username " + username + " already exists!"

        case " 'email_UNIQUE'":
            return "User with email " + email + " already exists!"

    }

}