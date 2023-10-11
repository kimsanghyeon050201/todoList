const dotenv = require('dotenv')

dotenv.config()

const {SERVER_PORT, HOST, HOST_URL, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER, SQL_PORT} = process.env

const sqlEncrypt = process.env.ENCRYPT === "true"

module.exports = {
    port : SERVER_PORT,
    host: HOST,
    url : HOST_URL,
    dbconfig : {
        server : SQL_SERVER,
        port : parseInt(SQL_PORT),
        options : {
            encrypt : false,
            databse : SQL_DATABASE,
        },
        authentication:{
            type: 'default',
            options:{
                userName : SQL_USER,
                password : SQL_PASSWORD
            }
        }
        
    }
}
