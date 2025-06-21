// Importa o mongoose, usado para modelar objetos e conectar ao MongoDB
import mongoose from 'mongoose';

// Cria um atalho para o construtor de Schema
const Schema = mongoose.Schema;

// Define o schema de usuários
const userSchema = new Schema({
    // Nome do usuário
    nome: {
        type: String,
        required: true,
        trim: true
    },

    // E-mail único e obrigatório
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    // Senha do usuário (idealmente deve ser armazenada com hash)
    senha: {
        type: String,
        required: true
    },

    // Número de telefone do usuário
    telefone: {
        type: String,
        required: true,
        trim: true
    },

    // Endereço completo
    rua: {
        type: String,
        required: true,
        trim: true
    },
    cidade: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        trim: true
    },
    cep: {
        type: String,
        required: true,
        trim: true
    },
    pais: {
        type: String,
        required: true,
        trim: true
    },

    // Token de autenticação associado ao usuário (não é a prática mais segura deixar aqui)
    token: {
        type: String,
        required: true
    },

    // Tipo do usuário: cliente ou administrador
    tipo: {
        type: String,
        required: true,
        enum: ['cliente', 'administrador']
    },

    // Estado da conta do usuário
    estadoConta: {
        type: String,
        required: true,
        enum: ['ativo', 'inativo']
    },

    // Carrinho de compras: arrays paralelos para ID dos produtos, tamanhos e quantidades
    carrinho: [{
        type: Number,
        required: true
    }],
    tamanhoCarrinho: [{
        type: Number,
        required: true
    }],
    quantiaCarrinho: [{
        type: Number,
        required: true
    }]
});

// Exporta o modelo 'User' com o schema definido
export default mongoose.model('User', userSchema);
