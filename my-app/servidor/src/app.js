// Importa o framework Express, utilizado para criar o servidor e rotas HTTP
import express from 'express';

// Importa o body-parser para interpretar o corpo das requisições (ex: JSON)
import bodyParser from 'body-parser';

// Importa as rotas definidas para produtos
import products from './routes/products.js';

// Importa o CORS (Cross-Origin Resource Sharing) para permitir requisições entre domínios diferentes
import cors from 'cors';

// Importa o mongoose, biblioteca para conectar e interagir com o MongoDB
import mongoose from 'mongoose';

// Importa as rotas definidas para usuários
import users from './routes/users.js';

// Cria uma instância do aplicativo Express
const app = express();

// Cria um roteador (não está sendo usado neste código, mas pode ser útil para modularizar)
const router = express.Router();

// Configura o CORS permitindo que a origem 'http://localhost:5173' (por exemplo, o frontend) acesse o backend
app.use(cors({
    origin: 'http://localhost:5173',
}));

// Conecta ao banco de dados MongoDB Atlas usando a URI de conexão
mongoose.connect('mongodb+srv://maiconsaomatheus:JaRONxfO3SpRJTMo@cluster0.nxcycoi.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('✅ Conectado ao MongoDB Atlas!')) // Sucesso na conexão
.catch(err => console.error('❌ Erro ao conectar no MongoDB Atlas:', err)); // Erro na conexão

// Configura o Express para usar o body-parser e aceitar requisições com JSON
app.use(bodyParser.json());

// Também aceita dados codificados em URL (ex: enviados por formulários)
app.use(bodyParser.urlencoded({ extended: false }));

// Define que todas as requisições que começam com /products serão tratadas pelas rotas em routes/products.js
app.use('/products', products);

// Define que todas as requisições que começam com /users serão tratadas pelas rotas em routes/users.js
app.use('/users', users);

// Exporta a instância do app para ser usada em outro arquivo (geralmente para iniciar o servidor)
export default app;
