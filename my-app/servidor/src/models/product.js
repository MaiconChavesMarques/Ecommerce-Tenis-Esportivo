// Importa o Mongoose, biblioteca ODM para MongoDB
import mongoose from 'mongoose';

// Cria uma referência ao construtor de Schemas do Mongoose
const Schema = mongoose.Schema;

// Define o schema para os produtos
const schema = new Schema({
    // ID interno do produto (único e obrigatório)
    id_interno: {
        type: Number,
        required: true,
        unique: true
    },

    // Nome do produto (string obrigatória e com remoção de espaços nas pontas)
    nome: {
        type: String,
        required: true,
        trim: true
    },

    // Descrição do produto (obrigatória e sem espaços desnecessários nas bordas)
    descricao: {
        type: String,
        required: true,
        trim: true
    },

    // Preço do produto (obrigatório)
    preco: {
        type: Number,
        required: true
    },

    // URL ou caminho da imagem do produto (obrigatório e com trim)
    imagem: {
        type: String,
        required: true,
        trim: true
    },

    // Lista de tamanhos disponíveis (ex: [38, 39, 40]) — todos obrigatórios
    tamanhos: [{
        type: Number,
        required: true
    }],

    // Quantidade disponível para cada tamanho (ex: [10, 5, 0]) — todos obrigatórios
    quantidade: [{
        type: Number,
        required: true
    }]
});

// Exporta o modelo 'Product' baseado no schema definido
// Isso cria (ou usa) a coleção 'products' no MongoDB
export default mongoose.model('Product', schema);
