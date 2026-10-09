import mongoose from 'mongoose';

export const initMongoConnection = async () => {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB } = process.env;
    
    // SRV'yi bypass eden (DNS engeline takılmayan) ozel uzun baglanti stringi
    const uri = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@ac-tzxdwkf-shard-00-00.witahtg.mongodb.net:27017,ac-tzxdwkf-shard-00-01.witahtg.mongodb.net:27017,ac-tzxdwkf-shard-00-02.witahtg.mongodb.net:27017/${MONGODB_DB}?ssl=true&replicaSet=atlas-p7izpe-shard-0&authSource=admin&retryWrites=true&w=majority`;
    
    try {
        await mongoose.connect(uri);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Mongo connection error:', error);
        throw error;
    }
};