const bd = require('./bd')

const Post = bd.sequelize.define('servidor', {
    nome: {
        type : bd.Sequelize.STRING
    },
    id_cargo: {
        type: bd.Sequelize.STRING
    }
},{
    //desabilitando timestamps em sequelize
    timestamps: false,
    //evitar que os nomes sejam plurais
    freezeTableName: true
})



//executar este comando apenas uma unica vez para criar a tabela servidores
//Post.sync({force: true}) 

module.exports = Post