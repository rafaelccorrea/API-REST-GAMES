const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { urlencoded } = require('express');

//Confi Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

    ]
}


//Listando todos os dados da API
app.get('/games', (req,res) => {
    res.statusCode = 200;
    res.json(DB.games);
})

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

//Criar dados da api

app.post("/game", (req,res) => {

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

app.delete("/games/:id", (req,res)=>{
  
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

app.put('/games/:id', (req,res)=>{
    
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