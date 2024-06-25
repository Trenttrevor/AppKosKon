import React from 'react'
import { delay, motion } from 'framer-motion'

import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

const Home = () => {
  const navigate = useNavigate()

  const { penggunaSekarang } = useSelector((state) => state.pengguna)

  const navSearch = () => {
    navigate('/search')
  }
  return (
    <section className='relative h-screen flex flex-col justify-center -translate-y-16'>
      <div className='absolute inset-0 -z-10 h-full w-full'>
        <div className='absolute inset-0 bg-black/60 z-10' />
        <video autoPlay muted loop className='w-full h-full object-cover'>
          <source src='/drone.mp4' type='video/mp4' />
        </video>
      </div>

      <motion.div
        className='flex flex-col items-center gap-24'
      >
        <motion.h1 className='text-neutral-100 tracking-wide font-light text-4xl max-w-[25ch] text-center font-serif'
          initial={{ opacity: 0, translateY: 300 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 2 }}
        >
          Experience New Adventure Finding Your Future Home
        </motion.h1>


        <motion.button onClick={navSearch} className='px-8 py-4 rounded-md bg-black-gradient'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <motion.span className='text-white'>Explore Now</motion.span>
        </motion.button>

        {!penggunaSekarang ? (
                  <div className='flex gap-10'>
                  <Link to='/sign-up'>
                    <motion.button className='px-8 py-4 rounded-md bg-black-gradient'
                      initial={{ opacity: 0, translateX: -100 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ duration: 2, delay: 1 }}
                    >
                      <motion.span className='text-white'>Sign Up</motion.span>
                    </motion.button>
                  </Link>
        
                  <Link to='/sign-in'>
                    <motion.button className='px-8 py-4 rounded-md bg-black-gradient'
                      initial={{ opacity: 0, translateX: 100 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ duration: 2, delay: 1 }}
                    >
                      <motion.span className='text-white'>Sign In</motion.span>
                    </motion.button>
                  </Link>
                </div>
        ):(
          <div>
            <h1 className='text-neutral-100 tracking-wide font-light text-4xl max-w-[25ch] text-center font-serif'>
              Welcome Back !
            </h1>
            <p className='text-neutral-100 tracking-wide font-light text-2xl max-w-[25ch] text-center font-serif'>
              {penggunaSekarang.username}</p>
          </div>
        )}





      </motion.div>

    </section>
  )
}

export default Home