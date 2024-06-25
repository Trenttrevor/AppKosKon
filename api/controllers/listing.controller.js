import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
    try {
        const newListing = await Listing.create(req.body)
        res.status(200).json(newListing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        return next(errorHandler(404, 'Listing ra ketemu'))
    }
    if (req.penggunabener.id !== listing.userRef) {
        return next(errorHandler(403, 'Ora authorized bro'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted listing")
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'Listing ra ketemu bro'))

    if (req.penggunabener.id !== listing.userRef) {
        return next(errorHandler(403, "Kuwi dudu listingmu bro!"))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listingById = await Listing.findById(req.params.listingId)
        res.status(200).json(listingById)
    } catch (error) {
        next(error)
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const maxPrice = parseFloat(req.query.maxPrice);
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'desc' ? -1 : 1; // Ensure correct sorting order
    
        // Initialize the query object
        let query = {
            name: { $regex: searchTerm, $options: 'i' }
        };
    
        // Add price filter if maxPrice is provided
        if (!isNaN(maxPrice) && maxPrice > 0) {
            query.price = { $lte: maxPrice };
        }
    
        // Handle typeModel filtering
        let typeModel = req.query.typeModel;
        if (!typeModel || typeModel === '') {
            query.typeModel = { $in: ['Koskosan', 'Kontrakan'] };
        } else {
            query.typeModel = typeModel;
        }

        const listings = await Listing.find(query)
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
        return res.status(200).json(listings);

        // const limit = parseInt(req.query.limit) || 9
        // const startIndex = parseInt(req.query.startIndex) || 0
        // const maxPrice = parseFloat(req.query.maxPrice)

        // if (!isNaN(maxPrice)) query.price = { $lte: maxPrice }


        // let typeModel = req.query.typeModel
        // if(typeModel === undefined || typeModel === ''){
        //     typeModel={$in:[ 'Koskosan', 'Kontrakan']}
        // }else if (typeModel === 'Koskosan'){
        //     typeModel='Koskosan'
        // }else if(typeModel === 'Kontrakan'){
        //     typeModel='Kontrakan'
        // }

        // const searchTerm = req.query.searchTerm || '';

        // const sort = req.query.sort || 'createdAt';

        // const order = req.query.order || 'desc';

        // const listings = await Listing.find({
        //     name: { $regex: searchTerm, $options: 'i' },
        //     typeModel,
        //     price
            
 
        // })
        //     .sort({ [sort]: order })
        //     .limit(limit)
        //     .skip(startIndex);


    } catch (error) {
        next(error)
    }
}