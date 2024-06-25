import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const ListingItem = ({ resultListing, index }) => {
    const {penggunaSekarang} = useSelector((state)=>state.pengguna)
    return (
        <motion.div
         className=' p-2 w-[700px] h-[220px] shadow-md rounded-md radial-gradient'
         initial={{opacity:0, translateY:100}}
         animate={{opacity:1, translateY:0}}
         transition={{duration:2, delay:index*0.5}}
         >
            <Link to={`/listing/${resultListing._id}`} className='flex flex-row' >
                <div className='w-2/5'>

                    <img src={resultListing.imageUrls[0]} alt="" className='w-[300px] h-[200px] object-cover rounded-lg' />
                </div>

                <div className='w-3/5 ml-5 flex flex-col justify-between'>
                    <div>
                    <h1 className='font-semibold'>{resultListing.name}</h1>
                    <h2 className='truncate'>{resultListing.description}</h2>
                    </div>
                    
                    <div >
                        <h1 className='font-bold'>Rp {resultListing.price.toLocaleString('id-ID')} / month</h1>
                    </div>
                    <div className='flex flex-row gap-1 items-center'>
                    <img src={resultListing.profilPic} alt="" className='w-10 h-10 rounded-full ' />
                    <p>{resultListing.owner}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default ListingItem