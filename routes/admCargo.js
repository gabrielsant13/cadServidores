const express = require('express')
const routerCargo = express.Router()
const Cargo = require('../bd/Cargo') //Cargo é uma tabela do bd


//----------------------------------------------------------------------------------------------\\
routerCargo.get('/cargo', async(req,res) => {
    console.log("cheguei")
    let cargos = await Cargo.findAll()
    res.json(cargos)
})

routerCargo.post('/cargo', async(req,res) => {
    Cargo.create({
        nome_cargo: req.body.nome_cargo,
        descricao: req.body.descricao
    }).then(function(){
        //caso tenha cadastrado com sucesso no banco
        console.log("Cargo criado")
        res.json(req.body)
    }).catch(function(erro){
        console.log("Houve um erro na tentativa de criação do cargo: " + erro)
    })
})

routerCargo.delete('/cargo/:id', async(req,res) => {
    let id = req.params.id

    Cargo.destroy({
        where:{id:id}
    }).then(function(){
        res.json("Cargo destruido")
    }).catch(function(erro){
        res.json("erro ao tentar destruir o cargo: " + erro)
    })
})

module.exports = routerCargo
//----------------------------------------------------------------------------------------------\\