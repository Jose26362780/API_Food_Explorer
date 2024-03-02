/**Padronizar o tipo de mensagem que vai aparecer quando tiver algum tipo de exeção  */



class AppError {
  message;
  statusCode;

  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
