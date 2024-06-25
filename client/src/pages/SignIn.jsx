import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'


const SignIn = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const {penggunaSekarang} = useSelector((state)=>state.pengguna)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      console.log(data)
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message)) 
      setError(true)
    }
  }



  return (
    <div className='flex justify-center items-center mt-20 '>
      <div className='flex flex-col gap-2 rounded-lg px-6 py-8 radial-gradient '>
        <h1 className='text-3xl text-center'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <input
            type="email"
            id='email'
            placeholder='email . . .'
            onChange={handleChange}
            className=' border p-3 rounded-lg focus:outline-none' />
          <input
            type="password"
            id='password'
            placeholder='password . . .'
            onChange={handleChange}
            className=' border p-3 rounded-lg focus:outline-none' />
          <button disabled={loading} className='bg-gray-gradient text-white p-2 rounded-lg hover:opacity-90'>
           {loading ? 'loading...': 'SIGN IN'}
          </button>
          <OAuth/>
        </form>
        <div>
          <span>Dont have an account? </span>
          <Link to='/sign-up' className='text-gray-300'>
            Sign Up
          </Link>
        </div>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn