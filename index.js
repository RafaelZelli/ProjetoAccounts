//modulos externos 
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulos internos
const fs = require('fs')
const console = require('console')

operation() //Chamando a função operation, para que mostre na tela ao iniciar o programa

//Função de quais operações são possiveis em nosso sistema 
function operation(){
    inquirer.prompt([ //Este comando mostra as opções de escolhas (array)
        {
        type: 'list',
        name:'action',
        message:'O que deseja fazer?',
        choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Transferir', 'Sair'],
        },
 ]).then((answer) =>{  //Escolher as opçoes acima e depois(then) irá ter uma resposta
        const action = answer['action']

        //Definindo para onde vai cada escolha
        if(action === 'Criar conta'){
            createAccount() //Nesse caso, irá para a função da mensagem criar conta(createAccount)
            buildAccount()  //Chama a função criar conta
        }else if(action === 'Consultar Saldo'){
            getAccountBalance()
        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){
            withdraw()
        }else if(action === 'Transferir'){
            transfer()
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

function checkAccount2(accountName2){
    if(!fs.existsSync(`accounts/${accountName2}.json`)){  //Se esta conta não existir...
        console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome!"))
        return false
    }
        return true
}

//Função que adiciona quantia no saldo
function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){         //Se não tiver digitado nada...
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
    console.log(chalk.green(`${accountName}, foi depositado o valor de R$${amount} na sua conta`))
}

//Função que lê o saldo no arquivo
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{   //Lê o arquivo json
        encoding: 'utf-8',
        flag: 'r'   // 'r' read
    })
    return JSON.parse(accountJSON)   //transformando em Json novamente
}

function getAccount2(accountName2){
    const accountJSON = fs.readFileSync(`accounts/${accountName2}.json`,{   //Lê o arquivo json
        encoding: 'utf-8',
        flag: 'r'   // 'r' read
    })
    return JSON.parse(accountJSON)   //transformando em Json novamente
}

//Função que mostra o saldo da conta
function getAccountBalance(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']
        
        //Verifica se a conta existe
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`Olá ${accountName}, o saldo da sua conta é de R$${accountData.balance}`))
        operation()
    }).catch(err => console.log(err))
}

//Função de sacar
function withdraw(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja sacar?'
        }]).then((answer) => {
            const amount = answer['amount']
            removeAmount(accountName, amount)            
        })
    }).catch(err => console.log(err))
}


//Função que remove o dinheiro da conta
function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){      //Caso não tenha digitado nada...
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente"))
        return withdraw()
    }
    if(accountData.balance < amount){    //Caso o valor do saque for mais que tem disponivel na conta..
        console.log(chalk.bgRed.black("Valor indisponível"))
        return withdraw()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )
    console.log(chalk.green(`Foi realizado um saque de R$${amount}`))
    operation()
}

//Função para transferir dinheiro 
function transfer(){

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return transfer()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja transferir?'
        }]).then((answer) => {
            const amount = answer['amount']
            if(!amount){      //Caso não tenha digitado nada...
                console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente"))
                return transfer()
            }

            inquirer.prompt([{
                name: 'accountName2',
                message: 'Para quem você deseja transferir?'
            }]).then((answer) => {
                const accountName2 = answer['accountName2']

                if(!checkAccount2(accountName2)){                    
                    return transfer()
                }
                transferirConta(accountName, accountName2, amount)
            })           
        })        
    }).catch(err => console.log(err))    
}


//Função que transfere o dinheiro 
function transferirConta(accountName, accountName2, amount){
    const accountData = getAccount(accountName)
    const accountData2 = getAccount2(accountName2)

    if(!amount){      //Caso não tenha digitado nada...
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente"))
        return transfer()
    }
    if(accountData.balance < amount){ //Caso o valor da transfer for mais que tem disponivel na conta..
        console.log(chalk.bgRed.black("Valor indisponível"))
        return transfer()
    }
    if(accountName == accountName2){ //Caso tenha digitado uma transferencia para mesma conta...
        console.log(chalk.bgRed.black("Não é possível transferir para a mesma conta!"))
        return transfer()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    accountData2.balance = parseFloat(accountData2.balance) + parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )
    fs.writeFileSync(
        `accounts/${accountName2}.json`,
        JSON.stringify(accountData2),
        function(err){
            console.log(err)
        }
    )
    console.log(chalk.green(`Foi realizado uma transferência na conta de ${accountName} no valor de R$${amount} para ${accountName2}`))
    operation()
}
















