import mongoose from 'mongoose'

export default async function connectToDatabase(){
    try {
        mongoose.connect('mongodb://localhost:27017/').then(() => console.log('Connected!'));
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);  
    }
}