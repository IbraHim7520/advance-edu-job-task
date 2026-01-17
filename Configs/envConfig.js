import dotenv from 'dotenv'

dotenv.config();

const envConfig = {
    port : process.env.PORT || 4004,
    db_uri : process.env.MONGODB_URI,
    jwt_secret:process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV || "development",
    stripe_api_key: process.env.STRIPE_API_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook : process.env.STRIPE_WEBHOOK_SECRET
}

export default envConfig