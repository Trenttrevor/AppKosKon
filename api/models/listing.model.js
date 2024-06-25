import mongoose from "mongoose";
import { Schema } from "mongoose";

const listingSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      typeModel:{
        type:String,
        required: true
      },
      price: {
        type: Number,
        required: true,
      },
      bathrooms: {
        type: Number,
        required: true,
      },
      bedrooms: {
        type: Number,
        required: true,
      },
      furnished: {
        type: Boolean,
        required: true,
      },
      parking: {
        type: Boolean,
        required: true,
      },
      imageUrls: {
        type: Array,
        required: true,
      },
      userRef: {
        type: String,
        required: true,
      },
      profilPic:{
        type: String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
      },
      owner:{
        type: String
      },
      contact:{
        type:String
      }

},
    {timestamps:true}
)

const Listing = mongoose.model('Listing', listingSchema)

export default Listing