const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const Secret = "21052014"

//Config Cors
app.use(cors());

//Confi Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware autenticação de token
function auth(req, res, next) {
    const authToken = req.headers['authorization'];
    if (authToken != undefined){
        //Dividindo o token e pegando somente o token
        const bearer = authToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, Secret, (err, data)=>{
            if(err){
                res.status(401);
                res.json({err: 'Token Invalido!'});
            }else{
                req.token = token;
                req.LoggerUser = {id: data.id, email: data.email};
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err: "Token Invalid"});
    }
}

//Banco de dados Fake.
let DB = {
    games:[
        {
            id:23,
            title: "Call Of Duty",
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: "God Od War",
            year: 2020,
            price: 40
        },   
        {
            id:2,
            title: "Mine",
            year: 2008,
            price: 80
        }
    ],
    users: [
        {
            id:3,
            name: "rafael correa",
            email: "rafael@gmail.com",
            password: "123",
        },
        {
            id:4,
            name: "Yuri Correa",
            email: "yuri@gmail.com",
            password: "123",
        }

    ]
}

//Usuario geração de Token
app.post('/auth', (req,res)=>{

    let {email, password} = req.body;

    if(email != undefined){

       let user =  DB.users.find(users => users.email == email);

       if(user != undefined){

            if(user.password == password){

                jwt.sign({id: user.id, email: user.email},Secret,{expiresIn:'12h'}, (err,token) => {
                    if(err){
                        res.status(400);
                        res.json({err: 'Falha interna!'})
                    }else{
                        res.status(200);
                        res.json({token:token})
                    }
                })
            }else{
                res.status(401);
                res.json({err: "Senha invalida!"})
            }

       }else{
           res.status(404);
           res.json({error: 'User not found'})
       }

    }else{
        res.status(400);
        res.json({error: "Invalid email"})
    }
})


//Rota com middleware Listando games
app.get('/games',auth,(req,res) => {
    res.statusCode = 200;
    res.json(DB.games);
})

//Listando dados da API
//Pesquisar Por ID
app.get('/games/:id', (req,res) => {
    let id = req.params.id;

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        
        let id = parseInt(req.params.id);
        let games = DB.games.find(g => g.id == id);

        if(games != undefined){
            res.statusCode = 200;
            res.json(games);
        }else{
            res.sendStatus(404);
        }
    }
})

//Cadastro de dados da api
app.post("/game", auth,(req,res) => {

    //Desestruturacao

    let {title, year, price} = req.body;

    DB.games.push({
        id: 01,
        title,
        price,
        year 
    });
    res.sendStatus(200);
})

//Deletando Dados da Api

app.delete("/games/:id", auth, (req,res)=>{
  
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        let id = parseInt(req.params.id);
        let index = DB.games.findIndex(games => games.id === id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index, 1);
            res.sendStatus(200);
        }
    }
})

//Editando dados da API 

app.put('/games/:id', auth, (req,res)=>{
    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        
        let id = parseInt(req.params.id);
        
        let games = DB.games.find(g => g.id == id);

        if(games != undefined){
            
            let{title, year, price } = req.body;

            if(title != undefined){
                games.title = title;
            }
            if(price != undefined){
                games.price = price;
            }
            if(year != undefined){
                games.year = year;
            }

            res.sendStatus(200);

        }else{
            res.sendStatus(404);
        }
    }
})

//Config Servidor
app.listen(8081, ()=>{
    console.log('Api Rodando')
})