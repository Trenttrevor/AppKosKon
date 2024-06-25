import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'


const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      setLoading(false)
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }



  return (
    <div className='flex flex-col items-center mt-20 '>
      <div className='flex flex-col gap-2 rounded-lg px-6 py-8 radial-gradient'>
        <h1 className='text-3xl text-center'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <input
            type="text"
            id='username'
            placeholder='username . . .'
            onChange={handleChange}
            className='border p-3 rounded-lg focus:outline-none' />
          <input
            type="email"
            id='email'
            placeholder='email . . .'
            onChange={handleChange}
            className='border p-3 rounded-lg focus:outline-none' />
          <input
            type="password"
            id='password'
            placeholder='password . . .'
            onChange={handleChange}
            className=' border p-3 rounded-lg focus:outline-none' />
          <button disabled={loading} className='bg-gray-gradient text-white p-2 rounded-lg hover:opacity-90'>
           {loading ? 'loading...': 'SIGN UP'}
          </button>
          <OAuth/>
        </form>
        <div>
          <span>Have an account? </span>
          <Link to='/sign-in' className='text-gray-300'>
            Sign in
          </Link>
        </div>
      </div>
        {error && <p className='flex-wrap'>{error}</p>}
      <div>

      </div>
    </div>

  )
}

export default SignUp