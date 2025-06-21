import http from 'http';              // Importa o módulo nativo HTTP do Node.js para criar servidor
import debug from 'debug';            // Importa a biblioteca debug para logs de debug
import app from '../src/app.js';      // Importa a instância do app Express

// Inicializa a namespace de debug para o servidor (namespace 'nodestr:server')
debug('nodestr:server');

// Define a porta que o servidor vai escutar
// Usa a variável de ambiente PORT ou o valor padrão 3000
const port = normalizePort(process.env.PORT || '3000');
// Seta a porta no app Express para uso interno
app.set('port', port);

// Cria o servidor HTTP com a aplicação Express como handler
const server = http.createServer(app);

// Inicia o servidor escutando na porta definida
server.listen(port);

// Registra tratadores de eventos para erros e quando o servidor começar a escutar
server.on('error', onError);
server.on('listening', onListening);

/**
 * Função para normalizar e validar a porta.
 * Se o valor for uma string que pode ser convertida em número inteiro positivo, retorna o número.
 * Se não for número, retorna o valor original (por exemplo, para usar nome de pipe).
 * Se o número for inválido (<0), retorna false para indicar porta inválida.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;       // Se não for número, retorna valor original
    if (port >= 0) return port;        // Se número válido (>=0), retorna como número
    return false;                      // Porta inválida
}

/**
 * Tratador de erro para o servidor.
 * Se o erro não estiver relacionado à escuta do servidor, relança o erro.
 * Caso contrário, verifica o tipo de erro:
 * - EACCES: permissões insuficientes para abrir a porta (ex: porta abaixo de 1024)
 * - EADDRINUSE: porta já está em uso
 * Em ambos os casos, mostra mensagem e encerra o processo com código 1.
 */
function onError(error) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Função chamada quando o servidor começa a escutar na porta.
 * Obtém o endereço do servidor e imprime no console e no debug.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Server listening on ' + bind);
}
