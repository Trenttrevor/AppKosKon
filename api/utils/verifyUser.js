import { errorHandler } from "./error.js"
import jwt from 'jsonwebtoken'

export const verifyToken = ( req, res, next) => {
    const token = req.cookies.tokenmu

    if(!token) return next(errorHandler(401, 'Ora authorized'))

    jwt.verify(token, process.env.JWT_SECRET, (err, penggunabener)=>{
        if(err) return next(errorHandler(403, 'Forbidden bro'))

        req.penggunabener = penggunabener
        next()
    })
}