const Sequelize = require('sequelize')

//Conexao com o BD mysql
const sequelize = new Sequelize('servidores', 'gabriel', '',{
    host: 'localhost',
    dialect: 'mysql',
    query:{raw:true},
    
})

//verifica se esta conectando com o banco
/*sequelize.authenticate().then(function(){
    console.log("conectado com sucesso no banco")
}).catch(function(erro){
    console.log("erro ao tentar conectar com o banco: " + erro)
})*/

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}