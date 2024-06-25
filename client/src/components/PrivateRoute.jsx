import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate} from 'react-router-dom'



const PrivateRoute = () => {
    const {penggunaSekarang} = useSelector((state)=>state.pengguna)
  return penggunaSekarang?<Outlet/>:<Navigate to='/sign-in'/>
}

export default PrivateRoute