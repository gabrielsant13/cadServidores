const express = require('express')
const app = express()
const routerCargo = require('./routes/admCargo')
const routerServidor = require('./routes/admServidor')

app.use(routerCargo)
app.use(routerServidor)

//SERVER
const PORT = 5555
app.listen(PORT, () => {
    console.log("Servidor iniciado com sucesso!")
})