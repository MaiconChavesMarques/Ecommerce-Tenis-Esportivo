import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    id_interno: {
        type: Number,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true
    },
    imagem: {
        type: String,
        required: true,
        trim: true
    },
    tamanhos: [{
        type: Number,
        required: true
    }],
    quantidade: [{
        type: Number,
        required: true
    }]
});

export default mongoose.model('Product', schema);