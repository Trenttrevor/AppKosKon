import Pengguna from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const hashedpassword = bcryptjs.hashSync(password, 10)
        const newUser = new Pengguna({ username, email, password: hashedpassword })
        await newUser.save()
        res.status(207).json({ message: "Pengguna sukses dibuat!" })
    } catch (error) {
        // res.status(500).json(error) if you are not using error-handling middleware
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validUser = await Pengguna.findOne({ email: email })
        if (!validUser) return next(errorHandler(404, 'Wrong email bro!'))

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, 'Wrong password bro!'))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...restIngpo } = validUser._doc
        res.cookie('tokenmu', token, { httpOnly: true }).status(200).json(restIngpo)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    // check if user already has a account or not, if yes we just need to create token for cookie, else we need to sign it up
    const pengguna = await Pengguna.findOne({ email: req.body.email })
    if (pengguna) {
        const { password: pass, ...restIngpo } = pengguna._doc
        const token = jwt.sign({ id: pengguna._id }, process.env.JWT_SECRET)
        res.cookie('tokenmu', token, { httpOnly: true }).status(200).json(restIngpo)
    } else {
        // like sign up functionality
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashedpassword = bcryptjs.hashSync(generatedPassword, 10)
        const newPengguna = new Pengguna({ username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8), email: req.body.email, password: hashedpassword, avatar: req.body.photo })
        await newPengguna.save()
        const token = jwt.sign({ id: newPengguna._id }, process.env.JWT_SECRET)
        const { password: pass, ...restIngpo } = newPengguna._doc
        res.cookie('tokenmu', token, { httpOnly: true }).status(200).json(restIngpo)
    }
}

export const signout = async(req, res, next)=>{
    try {
        res.clearCookie('tokenmu')
        res.status(200).json('Kowe wes sign out!')
    } catch (error) {
        next(error)
    }
}