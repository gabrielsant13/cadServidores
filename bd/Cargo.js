const bd = require('./bd')

const Cargo = bd.sequelize.define('cargo', {
    nome_cargo: {
        type: bd.Sequelize.STRING
    },
    descricao: {
        type: bd.Sequelize.STRING
    }
},{
    //desabilitando timestamps em sequelize
    timestamps: false,
    //evitar que os nomes sejam plurais
    freezeTableName: true})

module.exports = Cargo