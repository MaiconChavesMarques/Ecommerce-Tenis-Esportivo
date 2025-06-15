import express from 'express';
import bodyParser from 'body-parser';
import products from './routes/products.js';
import cors from 'cors';
import mongoose from 'mongoose';
import users from './routes/users.js';

const app = express();
const router = express.Router();

app.use(cors({
    origin: 'http://localhost:5173',
}));

mongoose.connect('mongodb+srv://maiconsaomatheus:JaRONxfO3SpRJTMo@cluster0.nxcycoi.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
.catch(err => console.error('❌ Erro ao conectar no MongoDB Atlas:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/products', products);
app.use('/users', users);

export default app;