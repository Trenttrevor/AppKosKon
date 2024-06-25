import Pengguna from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import Listing from "../models/listing.model.js"

export const test = async (req, res) => {
    res.json({ message: 'api route works!' })
}

export const updateUser = async (req, res, next) => {
    if (req.penggunabener.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!'))
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await Pengguna.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            },
            { new: true }
        )
        const { password: pass, ...restIngpo } = updatedUser._doc

        res.status(200).json(restIngpo)

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.penggunabener.id !== req.params.id) {
        return next(errorHandler(402, 'you can only delete your own account'))
    }
    try {
        await Pengguna.findByIdAndDelete(req.params.id)
        res.clearCookie('tokenmu')
        res.status(200).json({ message: 'pengguna berhasil dihapus' })
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async(req, res, next)=> {
    if(req.penggunabener.id === req.params.id){
        try {
            const listings = await Listing.find({userRef:req.params.id})
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    }else{
        next(errorHandler(403, "Kowe mung iso ndelok listings nggonmu dewe"))
    }
    
}