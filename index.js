//modulos externos 
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulos internos
const fs = require('fs')

operation() //Chamando a função operation, para que mostre na tela ao iniciar o programa

//Função de quais operações são possiveis em nosso sistema 
function operation(){
    inquirer.prompt([ //Este comando mostra as opções de escolhas (array)
        {
        type: 'list',
        name:'action',
        message:'O que deseja fazer?',
        choices: ['Criar conta', 'Consulta Saldo', 'Depositar', 'Sacar', 'Sair'],
        },
 ]).then((answer) =>{  //Escolher as opçoes acima e depois(then) irá ter uma resposta
        const action = answer['action']
        console.log(action)
    })
   .catch((err) => console.log(err))
}

