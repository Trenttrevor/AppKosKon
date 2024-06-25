import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'
import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'

const Profile = () => {
  const fileRef = useRef()
  const dispatch = useDispatch()

  const { penggunaSekarang } = useSelector((state) => state.pengguna)

  const [file, setFile] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [filePersen, setFilePersen] = useState(0)

  const [userListings, setUserListings] = useState([])
  const [errorShowListings, setErrorShowListings] = useState(null)

  const [updateSuccess, setUpdateSucces] =  useState(false)



  // firebase storage rules:
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePersen(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(updateUserStart())
    try {
      const res = await fetch(`/api/user/update/${penggunaSekarang._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSucces(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart())
    try {
      const res = await fetch(`/api/user/delete/${penggunaSekarang._id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutStart())
    try {
      const res = await fetch('/api/auth/signout')
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }

      dispatch(signOutSuccess(data))

    } catch (error) {
      dispatch(signOutFailure)
    }
  }

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${penggunaSekarang._id}`)
      const data = await res.json()
      if (data.success === false) {
        setErrorShowListings(data.message)
        return
      }
      setUserListings(data)
    } catch (error) {
      setErrorShowListings(error.messagge)
    }
  }

  const handleListingdelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,
        {
          method: "DELETE"
        }
      )
      const data = await res.json()
      if (data.success === false) {
        console.log(data.message)
        return
      }
      setUserListings((prev) => (
        prev.filter((listings) => listings._id !== listingId)
      ))

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col max-w-6xl mx-auto'>
      <div className='flex flex-col mx-auto mt-4 items-center'>
        <h1 className='font-semibold uppercase text-2xl'>Profile Page</h1>
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          accept='image/*'
          hidden
        />
        <img
          src={formData.avatar || penggunaSekarang.avatar}
          onClick={() => fileRef.current.click()}
          alt="whatt"
          className='h-[80px] w-[80px] rounded-full cursor-pointer mt-10'
        />
        {updateSuccess && <p>Successfully Updated!</p>}
        <p className='text-sm'>
          {
            fileUploadError ? (
              <span>Error Image must be less than 2 mb</span>
            ) : (
              filePersen > 0 && filePersen < 100 ? (
                <span>uploading ${filePersen}%</span>
              ) : (
                filePersen === 100 ? (
                  <span>Image successfully uploaded!</span>
                ) : (
                  ''
                )
              )
            )
          }
        </p>
      </div>

      <div className='flex flex-row mt-5 '>
        <div className='w-1/2 mx-auto'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <div className='flex flex-col'>
              <p>Username</p>
              <input
                type="text"
                id='username'
                defaultValue={penggunaSekarang.username}
                onChange={handleChange}
                placeholder='username...'
                className='w-[400px] p-2 rounded-sm'
              />
            </div>
            <div className='flex flex-col'>
              <p>Email</p>
              <input
                type="email"
                id='email'
                defaultValue={penggunaSekarang.email}
                onChange={handleChange}
                placeholder='email...'
                className='w-[400px] p-2 rounded-sm'
              />
            </div>
            <div className='flex flex-col'>
              <p>Password</p>
              <input
                type="password"
                id='password'
                onChange={handleChange}
                placeholder='password...'
                className='w-[400px] p-2 rounded-sm'
              />
            </div>
            <div className='p-3'>
              <button className='p-3 bg-teal-700 rounded-md' >
                UPDATE PROFILE
              </button>
            </div>

            <div className='p-3'>
              <Link to='/create-listing' className='p-3 bg-teal-700 rounded-md'>
                CREATE LISTING
              </Link>
            </div>
          </form>

          <div className='flex-1'>
            <button onClick={handleShowListings} className='bg-teal-500 p-2 rounded-sm mt-7'>SHOW LISTINGS</button>
          </div>
          <div className='flex mt-10 gap-2'>
            <span onClick={handleDeleteUser} className='bg-red-700 p-1 rounded-sm uppercase cursor-pointer'>delete account</span>
            <span onClick={handleSignOut} className='bg-blue-700/20 p-1 rounded-sm uppercase cursor-pointer'>sign out</span>
          </div>
        </div>

        <div className='w-1/2'>
          {userListings.length > 0 &&
            <div className=' flex flex-col gap-2'>
              {
                userListings && userListings.map((listing, index) => (
                  <motion.div key={listing._id} className='flex justify-between items-center p-1 mt-5 shadow-md rounded-md radial-gradient'
                    initial={{ opacity: 0, translateY: 100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 2, delay: index * 0.5 }}>
                    <Link to={`/listing/${listing._id}`}>
                      <img src={listing.imageUrls} alt="" className='w-50 h-40 object-contain' />
                    </Link>
                    <Link to={`/listing/${listing._id}`} className='truncate overflow-hidden max-w-48'>
                      <p >{listing.name}</p>
                    </Link>
                    <div className='flex flex-col items-center mr-2 gap-2'>
                      <button onClick={() => handleListingdelete(listing._id)} className='uppercase bg-red-900 py-1 px-2 text-gray-300 rounded-sm'>delete</button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className='uppercase bg-teal-500 py-0.5 px-3 rounded-sm'>edit</button>
                      </Link>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile