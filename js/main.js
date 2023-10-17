//Banco de dados
const db = []

// Trackeando os botões
const modal = document.getElementById('modal')
const openCreateLoginModalButton = document.getElementById('criar-conta')
const openListUserModalButton = document.getElementById('listar-usuarios')
const closeModalButton = document.getElementById('closeModal')

// Abrir e fechar modal para criação de usuarios
openCreateLoginModalButton.addEventListener('click', () => {
  criarUsuarioModal.style.display = 'block'
})
closeModalButton.addEventListener('click', () => {
  criarUsuarioModal.style.display = 'none'
  User.clearCreateAccountForm()
})



// Abrir e fechar modal com os usuarios
openListUserModalButton.addEventListener('click', () => {
  listarUsuariosModal.style.display = 'block'

  User.listarUsuarios()
  console.log('Banco de Dados')
  console.log(db)
})
const closeModalButtonUsers = document.querySelector("#listarUsuariosModal .close")
closeModalButtonUsers.addEventListener('click', () => {
  listarUsuariosModal.style.display = 'none'
})


// Classe construtora
class User {
  constructor(name, user, password, permission) {
    this.name = name
    this.user = user
    this.password = password
    this.permission = permission
  }

  static login(inputUser, inputPassword, db) {
    const user = db.find(({ user }) => user === inputUser)

    if (user) {
      // Verificar a senha descriptografada
      if (User.verifyPassword(inputPassword, user.password)) {
        return `Bem-vindo ${user.name}`
      }
    }

    return 'Usuário ou senha incorreta'
  }


  static hashPassword(password) {
    let hash = 0
    for (let i = 0 ;i < password.length ;i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
    }
    return hash.toString()
  }

  static verifyPassword(inputPassword, hashedPassword) {
    return User.hashPassword(inputPassword) === hashedPassword
  }

  // Método para criar usuário
  static createUser(inputName, inputUser, inputPassword, inputPermission, db) {
    const erros = []
    const alreadyExistUser = db.filter(({ user }) => user === inputUser)

    if (alreadyExistUser.length > 0) {
      erros.push('Esse usuário já está sendo utilizado')
    }

    if (inputPassword.length < 4) {
      erros.push('A senha precisa ter mais do que 4 caracteres')
    }
    //Ajustar os erros e listar com algum tipo de separador
    if (erros.length > 0) {
      const listaErros = erros.map((erro, index) => `Erro ${index + 1}-${erro}`)
      return `\n${listaErros}`
    }
    const hashedPassword = User.hashPassword(inputPassword)
    const newUser = new User(inputName, inputUser, hashedPassword, inputPermission)
    db.push(newUser)
    return `Usuário criado com sucesso, Bem-vindo ${inputName}`
  }

  // Método para limpar os campos do formulário de criação de conta
  static clearCreateAccountForm() {
    const inputName = document.querySelector('#nome')
    const inputUser = document.querySelector('#usuario')
    const inputPassword = document.querySelector('#senha')
    const inputPermission = document.querySelector('#permissao')
    const createAccountResult = document.getElementById('createAccountResult')

    inputName.value = ''
    inputUser.value = ''
    inputPassword.value = ''
    inputPermission.value = ''
    createAccountResult.textContent = ''
  }

  //Método para criar usuarios
  static listarUsuarios() {
    const listarUsuariosModalContent = document.querySelector("#usersList")

    let usuariosHTML = ""

    db.map((user) => {
      usuariosHTML += `<div class="usuario usuario-item">
        <strong>Nome:</strong> ${user.name}<br>
        <strong>Usuário:</strong> ${user.user}<br>
        <strong>Permissão:</strong> ${user.permission}<br>
      </div>`
    })

    listarUsuariosModalContent.innerHTML = usuariosHTML
  }

}

// Buscando os inputs para criação do usuario
const formCreateUser = document.getElementById('accountForm')


// Buscando os inputs para login do usuario
const formLoginUser = document.getElementById('loginForm')

// Função para tratar o envio do formulário
function getFormInputs(event) {
  event.preventDefault()

  const inputName = event.target.querySelector('#nome').value
  const inputUser = event.target.querySelector('#usuario').value
  const inputPassword = event.target.querySelector('#senha').value
  const inputPermission = event.target.querySelector('#permissao').value

  const createUserResult = User.createUser(inputName, inputUser, inputPassword, inputPermission, db)

  const createAccountResult = document.getElementById('createAccountResult')
  createAccountResult.textContent = createUserResult

}

//Funcao para buscar os usuarios na base
function getLoginInputs(event) {
  event.preventDefault()
  const inputUser = event.target.querySelector('#inputUser').value
  const inputPassword = event.target.querySelector('#inputPassword').value

  const loginUserResult = User.login(inputUser, inputPassword, db)

  const loginResult = document.getElementById('loginResult')
  loginResult.textContent = loginUserResult
}

// Adicionando um evento de submit ao formulário de criação de conta
formCreateUser.addEventListener('submit', getFormInputs)

// Adicionando um evento de submit ao formulário para login do usuario
formLoginUser.addEventListener('submit', getLoginInputs)



