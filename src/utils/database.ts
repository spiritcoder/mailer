import mongoose from 'mongoose';

export async function DBConnection()  {

    try {
        //comment out on local
        mongoose.connect(`${process.env.DBSERVER}/${process.env.DBNAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        //const uri = "mongodb://auth-mongo-srv:27017/auth"
        //mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        mongoose.connection.once('open', function () {
            console.log('Database connection was successful')
        })
    } catch (error) {
        console.error(error)
    }
 
}