import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

import {motion} from 'framer-motion'

const Search = () => {
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        furnished: false,
        parking: false,
        sort: 'createdAt',
        order: 'desc',
        typeModel: '',
        maxPrice: ''
    })

    const navigate = useNavigate()

    const [resultListings, setResultListings] = useState([])

    console.log(resultListings)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const furnishedFromUrl = urlParams.get('furnished')
        const parkingFromUrl = urlParams.get('parking')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        const typeModelFromUrl = urlParams.get('typeModel')
        const maxPriceModelFromUrl = urlParams.get('maxPrice')


        if (searchTermFromUrl || furnishedFromUrl || parkingFromUrl || sortFromUrl || orderFromUrl || typeModelFromUrl || maxPriceModelFromUrl) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                furnished: furnishedFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
                typeModel: typeModelFromUrl || '',
                maxPrice: maxPriceModelFromUrl || ''
            })
        }

        const fetchListings = async () => {
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()

            setResultListings(data)
        }
        fetchListings()
    }, [location.search])



    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }

        if (e.target.id === 'furnished' || e.target.id === 'parking') {
            setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt'
            const order = e.target.value.split('_')[1] || 'desc'

            setSidebardata({ ...sidebardata, sort, order })
        }

        if (e.target.id === 'typeModel') {
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.value
            })
        }

        if (e.target.id === 'maxPrice') {
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.value
            })
        }


    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        urlParams.set('typeModel', sidebardata.typeModel)
        urlParams.set('maxPrice', sidebardata.maxPrice)


        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    }

    return (
        <div className='flex flex-row max-w-6xl mx-auto mt-10 gap-2 h-screen'>
            <div className='w-2/5 '>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <div>
                        <input
                            type="text"
                            id='searchTerm'
                            onChange={handleChange}
                            value={sidebardata.searchTerm}
                            placeholder='search by name'
                            className='bg-black-gradient p-2 rounded-md text-white'
                        />
                    </div>
                    <div>
                        <select id="typeModel" onChange={handleChange} className='bg-black-gradient p-2 rounded-md text-white w-48'>
                            <option value="">Type of Property</option>
                            <option value="Koskosan">Kos-kosan</option>
                            <option value="Kontrakan">Kontrakan</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Filter by max price</label>
                        <input type="number" id='maxPrice' placeholder='maxPrice' onChange={handleChange} value={sidebardata.maxPrice} className='bg-black-gradient p-2 rounded-md text-white w-48' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Sort:</label>
                        <select id="sort_order" onChange={handleChange} defaultValue={'created_at_desc'} className='bg-black-gradient p-2 rounded-md text-white w-48'>
                            <option value='price_desc'>Price high to low</option>
                            <option value='price_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <div>
                        <button className='radial-gradient py-2 px-4 rounded-md cursor-pointer '>Search</button>
                    </div>
                </form>
            </div>
            <div className='w-3/5 flex flex-col'>
                <p>Search Results:</p>
                <div className='flex flex-col gap-5 mt-5'>

                    {
                        resultListings.length === 0 && (<p>Items not Found!</p>)
                    }
                    {
                        resultListings.length > 0 && resultListings.map((resultListing, index) =>
                            <ListingItem key={resultListing._id} resultListing={resultListing} index={index} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Search