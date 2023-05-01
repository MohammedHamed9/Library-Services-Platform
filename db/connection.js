const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lsp',
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.log(" CONNCETION ERROR ");
        return;
    }
    else {
        console.log("CONNECTED TO DATABASE");
    }
});
module.exports = connection;
