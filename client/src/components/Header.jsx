import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { FaSearch } from "react-icons/fa";

const Header = () => {
    const { penggunaSekarang } = useSelector((state) => state.pengguna)

    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e)=> {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])

    return (
        <header className=' text-white flex justify-around items-center p-3 bg-transparent'>
            <Link to='/'>
                <span>AppKosKon</span>
            </Link>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex relative items-center'>
                    <input
                        type="text"
                        placeholder='search...'
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className='rounded-md focus:outline-none p-2 text-black'
                    />
                    <FaSearch className='absolute top-[25%] right-0 pr-1  text-black ' size={20}/>
                    </div>
                   
                </form>
            </div>
            <ul className='flex gap-4 items-center'>
                <Link to='/search'>
                    <li>Explore!</li>
                </Link>

                <Link to='/profile' >
                    {penggunaSekarang ? (
                        <img src={penggunaSekarang.avatar} alt="whatt" className='rounded-full w-10 h-10'/>
                    ) : (<li>Sign In</li>)}

                </Link>
            </ul>
        </header>
    )
}

export default Header