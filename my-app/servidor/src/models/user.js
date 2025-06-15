import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true // garante e-mails únicos
    },
    senha: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true,
        trim: true
    },
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
    token: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['cliente', 'administrador'] // opcional, restringe os tipos válidos
    },
    estadoConta: {
        type: String,
        required: true,
        enum: ['ativo', 'inativo']
    },
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

export default mongoose.model('User', userSchema);