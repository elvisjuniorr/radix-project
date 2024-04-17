const Sequelize = require ('sequelize');
const db = new Sequelize ("equipmentsdata", "root", "0702", {
    host: 'localhost',
    dialect: "mysql"
});

db.authenticate()
.then(function(){   
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(function(){
    console.log("Erro: Conexão com o banco de dados não realizada com sucesso!");
});

module.exports = db;