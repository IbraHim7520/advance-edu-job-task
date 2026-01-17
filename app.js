import express, { raw } from 'express'
import cors from 'cors'
import connectDatabase from './Configs/DbConfig.js'
import authRouter from './Modules/Authentication/auth.route.js'
import cookieParser from 'cookie-parser'
import productRouter from './Modules/Products/product.route.js'
import orderRoute from './Modules/Orders/orders.route.js'
import { orderController } from './Modules/Orders/order.controller.js'


const app = express()
app.use(cors())

app.post('/api/stripe/webhook',
  raw({ type: 'application/json'}),
  orderController.webhookController
)

app.use(express.json())
app.use(cookieParser())

connectDatabase()

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRoute)

export default app
