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

        //Definindo para onde vai cada escolha
        if(action === 'Criar conta'){
            createAccount() //Nesse caso, irá para a função criar conta(createAccount)
            buildAccount()
        }
    })
   .catch((err) => console.log(err))
}

//Função mensagem de criar conta
function createAccount(){
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opçoes da sua conta a seguir'))
    
}

//Função para criar a conta
function buildAccount(){

    inquirer.prompt([
        {
            name:'accountName',
            message: 'Digite um nome para a sua conta:',
        },
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){ //Verifica se o diretorio accounts não existe
            fs.mkdirSync('accounts')   //Caso não exista, agente cria ele aqui
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){  //Verificar se a conta já existe
            console.log(chalk.bgRed.black("Esta conta já existe, escolha outro nome!"),
            )
            buildAccount()
            return     //Retornar para que não gere um bug no sistema
        }
        fs.writeFileSync(   //Escreve no arquivo criado
        `accounts/${accountName}.json`,  
         '{"balance": 0}',
         function(err){
             console.log(err)
         },
        )
        console.log(chalk.green('Parabens, a sua conta foi criada!'))
        operation()
    })
    .catch((err) => console.log(err))
}

