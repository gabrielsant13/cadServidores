const express = require('express')
const routerServidor = express.Router()
const path = require('path')

const bodyParser = require('body-parser')
const  mysql = require ('mysql'); 
const Post = require('../bd/Post'); // Post é uma tabela do bd, se refere ao servidor
const { application } = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const { dirname } = require('path');
const SECRET = 'sant'

//CONFIG
    //Body Parser
    routerServidor.use(bodyParser.urlencoded({extended: false}))
    routerServidor.use(bodyParser.json())

//ROTAS

    //---------------------------------- LISTAR-LISTARID--------------------------------------------\\

    routerServidor.get('/', async(req,res) => {
        let post = await Post.findAll()
        res.json(post)
        })

    routerServidor.get('/:id', async(req,res) => {
        const id = req.params.id
        
        //aqui pesquisa pelo id no array
        let post = await Post.findByPk(id)
        res.json(post)
        //aqui abaixo pesquisa pela posição no array
        //res.json(clientes[id])
    })
    //-----------------------------------------------------------------------------------------------\\


    //--------------------------------------CADASTRAR------------------------------------------------\\
    
    //Somente pessoas autorizadas podem solicitar o token para cadastro
    const autorizados = [
        {nome: "Jose Luiz", senha: "123"},
        {nome: "mateus inacio", senha: "456"}
    ]

    //Verifica se o solicitante ta na lista de pessoas autorizadas, se tiver jera um token para ela persistir no banco
    routerServidor.post('/', async(req,res) => {
        console.log("verificando autorização")
        var aut = await autorizados.find(value => (value.nome === req.body.nome && value.senha === req.body.senha))

        if(aut !== undefined){
            console.log("Autorizado")

            //esse 1 do userId seria uma chave primaria vinda do banco de dados, nesse caso como estou utilizando um array nao coloquei id
            const token = await jwt.sign({userId: 2}, SECRET, {expiresIn: 300})
            res.json(token)
            return
        }
        res.status(401).json("Usuario nao autorizado")
    })

    //Verifica o token se é válido, se for, persiste os dados no banco
    routerServidor.post('/cad', verifyJWT,(req,res) => {
        console.log("criando")
        Post.create({
            nome: req.body.nome,
            id_cargo: req.body.id_cargo
        }).then(function(){
            //caso tenha cadastrado com sucesso no banco
            console.log("Cadastrado no banco")
            res.json(req.body)
        }).catch(function(erro){
            console.log("Houve um erro na tentativa de criação: " + erro)
        })
    })
    //-----------------------------------------------------------------------------------------------\\

    
    //-------------------------------------ATUALIZAR--------------------------------------------------\\
    routerServidor.put('/:id', async(req,res) => {
        
        const id = req.params.id

        //setando as informaçoes passadas atraves do req.body no primeiro servidor encontrado
        Post.update({

            nome: req.body.nome,
            id_cargo: req.body.id_cargo
        }, 
        {where: {id: id}}).then(function(){

            console.log("Atualizado no banco")
            res.json(req.body)

        }).catch(function(erro){
            console.log("Houve um erro na tentativa de atualizacao: " + erro)
        
        })
    })
    //-----------------------------------------------------------------------------------------------\\


    //---------------------------------------DELETAR--------------------------------------------------\\
    routerServidor.delete('/:id', (req,res) => {
        const id = req.params.id

        Post.destroy({
            where:{id:id}
        }).then(function(){
            res.json("Destruido")
        }).catch(function(erro){
            res.json("erro ao tentar destruir: " + erro)
        })
    })
//-----------------------------------------------------------------------------------------------\\


//------------------------------------OUTROS------------------------------------------------------\\
/*//CONEXAO COM O BD
//A partir do MySQL 8 apresenta o erro ao utilizar o usuario root para conexao, necessario criar novo usuario (ver index.sql na pasta bd)
    const  conexao  = mysql.createConnection({ 
    host: 'localhost', 
    user: 'gabriel', 
    password: '', 
    database: 'servidores' 
    } ) ;

conexao.connect(function(err) {
    if (err) {
        console.log('Erro ao tentar conectar com o banco ' + err.stack);
        return;
    }
    console.log('Conectado ao Banco de Dados ' + conexao.threadId);
});
//------------------------------------------*/

//Função de verificação
function verifyJWT(req,res,next){
    const token = req.headers['x-access-token']
    if(!token) return res.status(401).json({message: 'No token provided'})

    jwt.verify(token, SECRET,function(err, decoded){
        if(err) return res.status(500).json({message: 'failed to authenticate token'})

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    })
}
//-----------------------------------------------------------------------------------------------\\

module.exports = routerServidor