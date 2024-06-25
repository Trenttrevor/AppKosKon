import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import cookieParser from 'cookie-parser'

import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'

import path from 'path'

const app = express()

app.use(express.json())

app.use(cookieParser())

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connect to DB')
}).catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve()


app.listen(3000, ()=>{
    console.log('Running on port 3000!')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res )=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500
    const message = err.message || 'internal server error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        source: 'middleware'
    })
})

