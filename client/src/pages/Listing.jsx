import React, { useEffect, useState } from 'react'
import { FaWifi } from "react-icons/fa";
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { MdOutlineArrowForwardIos } from "react-icons/md"
import { BsStack } from "react-icons/bs";
import { GiHomeGarage } from "react-icons/gi";
import { MdChair } from "react-icons/md"
import { FaMapMarkerAlt } from "react-icons/fa";

import { useParams } from 'react-router-dom'

import {motion} from 'framer-motion'


const Listing = () => {
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleBack = () => {
    const prevIndex = currentIndex === 0 ? listing?.imageUrls.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
  }

  const handleForward = () => {
    const forwardIndex = currentIndex === listing?.imageUrls.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(forwardIndex)
  }

  console.log(listing)


  useEffect(() => {
    const fetchDataListing = async () => {
      const res = await fetch(`/api/listing/get/${params.listingId}`)
      const data = await res.json()
      if (data.success === false) {
        setError(data.message)
        return
      }
      setListing(data)
    }
    fetchDataListing()
  }, [])

  return (
    <div className='flex mt-5 max-w-6xl mx-auto'>
      <motion.div className='w-2/5 mr-5' initial={{opacity:0, translateX:-70}} animate={{opacity:1, translateX:0}} transition={{duration:2, delay:0.5}}>
        <div className='flex flex-1 items-center gap-2 p-5 radial-gradient  flex-nowrap rounded-md'>
          <img src={listing?.profilPic} alt="" className='w-14 h-14 rounded-full ' />
          <div>
            <p className='sans-serif'>OWNER</p>
            <h1 className='font-semibold'>{listing?.owner}</h1>
            <p>Contact: {listing?.contact}</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div className='w-3/5 ml-2' initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2}}>
        <motion.div className='radial-gradient p-5 rounded-md relative' initial={{opacity:0, translateX:100}} animate={{opacity:1, translateX:0}} transition={{duration:2}} >
          <img src={listing?.imageUrls[currentIndex]} alt="" className='object-cover rounded-sm' />
          <div onClick={handleBack} className='absolute top-[50%]  translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
            <MdOutlineArrowBackIosNew />
          </div>
          <div onClick={handleForward} className='absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
            <MdOutlineArrowForwardIos />
          </div>
          <div className='absolute flex left-5 top-5 gap-2 items-center bg-black/10 rounded-sm p-1'>
            <BsStack />  <span>{listing?.imageUrls.length} Photos</span>
          </div>

        </motion.div>
        <motion.div className='flex justify-around items-center bg-teal-400 p-3 mt-2' initial={{opacity:0, translateY:-70}} animate={{opacity:1, translateY:0}} transition={{duration:2, delay:0.8}}>
          <h1>Price Rp. {listing?.price.toLocaleString('id-ID')} / month</h1>
          <h1>Type: {listing?.typeModel}</h1>
        </motion.div>
        <motion.div className='bg-white/60 rounded-md p-3 mt-3 shadow-md' initial={{opacity:0, translateY:-70}} animate={{opacity:1, translateY:0}} transition={{duration:2, delay:0.7}}>
          <h1 className='font-semibold'>Address</h1>
          <p className='flex flex-row items-center gap-2'><FaMapMarkerAlt /> {listing?.address} </p>
        </motion.div>

        <motion.div className='bg-white/60 rounded-md p-3 mt-3 shadow-md ' initial={{opacity:0, translateY:-70}} animate={{opacity:1, translateY:0}} transition={{duration:2, delay:0.5}}>
          <h1 className=' font-semibold'>Facilities:</h1>
          <div className='flex flex-row flex-wrap gap-10'>
            <div className='flex flex-col items-center'>
              <FaWifi size={60} />
              <h1>WI-FI</h1>
            </div>
            <div  className='flex flex-col items-center'>
              <GiHomeGarage size={60}/>
              <h1>Parking Lot</h1>
            </div>
            <div  className='flex flex-col items-center'>
              <MdChair size={60}/>
              <h1>Furnished</h1>
            </div>
          </div>
        </motion.div>

        <motion.div className='bg-white/60 rounded-md p-3 mt-3 shadow-md ' initial={{opacity:0, translateY:-70}} animate={{opacity:1, translateY:0}} transition={{duration:2, delay:0.2}}>
        <h1 className='font-semibold'>Description</h1>
        <p className='flex flex-row items-center gap-2'>{listing?.description} </p>
        </motion.div>
      </motion.div>

    </div>
  )
}

export default Listing