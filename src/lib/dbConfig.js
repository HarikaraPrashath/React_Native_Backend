import mongoose from "mongoose"


export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_ADDRESS);
        console.log(`Database connection ${conn.connection.host}`)
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}