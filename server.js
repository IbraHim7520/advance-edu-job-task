import app from "./app.js";
import envConfig from "./Configs/envConfig.js";

app.get('/', (req , res)=>{
    res.send("Server working!");
})

app.listen(envConfig.port , ()=>{
    console.log(`Server is running at port: ${envConfig.port}`);
})