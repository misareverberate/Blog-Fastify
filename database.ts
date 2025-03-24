import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

export default async function connectToDatabase(){
    try {
        mongoose.connect(process.env.MONGO_URL!).then(() => console.log('Banco de Dados conectado!'));
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);  
    }
}