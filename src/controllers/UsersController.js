/* Padronizar o tipo de mensagem que vai aparecer quando tiver algum tipo de exeção 

*/
// importamos o hash para criptografar a senha 
// importamos o compare para comparar senha criptografada 
const { hash,compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");


class UsersController {

  // funcionalidade de criação de usuario
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await  sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])


    if(checkUserExists){
      throw new AppError("Este e-mail já esta em uso.");

    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES ( ?, ?, ?)",
      [name, email, hashedPassword]
    )


    return response.status(201).json();
  }

  // Funcionalidade de atualização de usuario
  async update(request, response){
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    // se não existir o usuario
    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    )

    // se encontra um email e esse email  for difeente do id do usuario significa que ele esta tentando mudar o email para o email de outra pessoa

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail ja esta em uso.")
    }

    user.name = name ?? user.name; // se existir conteudo dentro de name entao name sera utilizado se nao sera utilizado user.name (famoso nulish operator ??)
    user.email = email ?? user.email;

    // condicional para atualizar senha
    // se digitou a nova senha mas nao digitou a senha antiga
    // vai lanzar um erro
    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova senha"
      )
    }

    // se o password e o old password for informado
    // se a senha antiga é igual a senha que esta no banco vai dar erro

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      // se a senha antiga nao confere
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere")
      }

      // se passo todos os items de verificação

      user.password = await hash(password, 8)
    }

    await database.run(
      `
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
      [user.name, user.email, user.password, id]
    )

    /* DATETIME('now') -> é uma função do meu banco de dados para atualizar a data automaticamente de meu controller */

    return response.status(200).json();
  }
}

module.exports = UsersController;
