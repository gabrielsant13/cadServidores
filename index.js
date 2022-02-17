const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const  mysql = require ('mysql'); 
const Post = require('./bd/Post');
const Cargo = require('./bd/Cargo')
const { application } = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken')
const SECRET = 'sant'

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

const autorizados = [
    {nome: "Jose Luiz", senha: "123"},
    {nome: "mateus inacio", senha: "456"}
]

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

//CONFIG
    //Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())

//ROTAS
    app.get('/', async(req,res) => {
        let post = await Post.findAll()
        res.json(post)
    })

    app.get('/cargo', async(req,res) => {
        console.log("cheguei")
        let cargos = await Cargo.findAll()
        res.json(cargos)
    })


    app.get('/:id', async(req,res) => {
        const id = req.params.id
        
        //aqui pesquisa pelo id no array
        let post = await Post.findByPk(id)
        res.json(post)
        //aqui abaixo pesquisa pela posição no array
        //res.json(clientes[id])
    })

    app.post('/', async(req,res) => {
        console.log("verificando autorização")
        var aut = await autorizados.find(value => (value.nome === req.body.nome && value.senha === req.body.senha))

        if(aut !== undefined){
            console.log("Autorizado")

            //esse 1 do userId seria uma chave primaria vinda do banco de dados
            const token = await jwt.sign({userId: 2}, SECRET, {expiresIn: 300})
            res.json(token)
            return
        }
        res.status(401).json("Usuario nao autorizado")
    })

    app.post('/cad', verifyJWT,(req,res) => {
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

    app.post('/cargo', async(req,res) => {
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

    app.put('/:id', async(req,res) => {
        
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
/*
    //ainda está na atualização do array, porem o patch nao funcionou corretamente
    app.patch('/:id', (req,res) => {
        const id = req.params.id
        const nome = req.body.nome
        const tel = req.body.tel

        let cliente = clientes.filter(value => value.id == id)

        cliente[0].id = id
        cliente[0].nome = nome
        cliente[0].tel = tel

        console.log(cliente[0])
    })
*/
    app.delete('/:id', (req,res) => {
        const id = req.params.id

        Post.destroy({
            where:{id:id}
        }).then(function(){
            res.json("Destruido")
        }).catch(function(erro){
            res.json("erro ao tentar destruir: " + erro)
        })
    })
    
    app.delete('/cargo/:id', async(req,res) => {
        let id = req.params.id

        Cargo.destroy({
            where:{id:id}
        }).then(function(){
            res.json("Cargo destruido")
        }).catch(function(erro){
            res.json("erro ao tentar destruir o cargo: " + erro)
        })
    })


//SERVER
const PORT = 5555
app.listen(PORT, () => {
    console.log("Servidor iniciado com sucesso!")
})