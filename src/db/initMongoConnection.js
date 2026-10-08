import mongoose from 'mongoose';

export const initMongoConnection = async () => {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    
    // Bütün DNS sorununu çözen family: 4 ayarını buraya ekliyoruz
    await mongoose.connect(uri, { family: 4 });
    
    console.log('Mongo connection successfully established!');
};