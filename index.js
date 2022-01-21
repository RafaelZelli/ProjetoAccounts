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
            createAccount() //Nesse caso, irá para a função da mensagem criar conta(createAccount)
            buildAccount()  //Chama a função criar conta
        }else if(action === 'Consultar Saldo'){

        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){

        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()   //Este comando encerra a execução do programa
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

// Função de depositar 
function deposit(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']
        
        //Verifico se a conta existe
        if(!checkAccount(accountName)){
            return deposit()
        }
        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?',
        }]).then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount)  //Adiciona a quantia no saldo
            operation()  //Volta ao menu principal

        }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

//Função que verifica se a conta existe
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){  //Se esta conta não existir...
        console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome!"))
        return false
    }
        return true
}

//Função que adiciona quantia no saldo
function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){         //Se não tiver saldo(amount)...
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente"))
        return deposit()
    }
    // Somando o valor do balance mais com o que foi depositado 
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    //Depois vou salvar esta alteração no arquivo
    fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),   //Transforma JSON em texto
    function(err){
        console.log(err)
    },
    )
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))
}

//Função que lê o saldo no arquivo
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{   //Lê o arquivo json
        encoding: 'utf-8',
        flag: 'r'   // 'r' read
    })
    return JSON.parse(accountJSON)   //transformando em Json novamente
}

