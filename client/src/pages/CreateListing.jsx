import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        typeModel: '',
        address: '',
        price: 500,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,

    })

    const [imageUploadError, setImageUploadError] = useState(null)
    const [imageUpload, setImageUpload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { penggunaSekarang } = useSelector((state) => state.pengguna)

    const navigate = useNavigate()

    console.log(formData)
    const handleImageSubmit = (e) => {
        e.preventDefault()
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setImageUploadError(false)
            setImageUpload(true)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                })
                setImageUploadError(false)
                setImageUpload(false)

            }).catch((err) => {
                setImageUploadError('Image upload failed (2 mb max per image)')
                setImageUpload(false)
            })
        } else {
            setImageUploadError("mung iso max 6 foto bro karo min 1 foto")
            setImageUpload(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`uploading is ${progress}%`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, indexSini) => indexSini !== index)
        })
    }

    const handleChange = (e) => {
        if (e.target.type === "number") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }

        if (e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }

        if (e.target.type === 'checkbox') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.id === 'typeModel') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }



    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image')
            setLoading(true)
            setError(false)
            const res = await fetch('/api/listing/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: penggunaSekarang._id,
                    profilPic: penggunaSekarang.avatar,
                    owner: penggunaSekarang.username,
                    contact: penggunaSekarang.email
                })
            })
            const data = await res.json()
            if (data.success === false) {
                setError(data.message)
                setLoading(false)
                return
            }
            navigate(`/listing/${data._id}`)
            
        } catch (err) {
            setError(error)
        }
    }


    return (
        <div className='flex flex-col'>
            <h1 className="text-center uppercase font-semibold mt-6 mb-10">Creating Listing Page</h1>
            <div className='flex '>

                <form onSubmit={handleSubmit} className='flex flex-row max-w-7xl mx-auto'>
                    <div className="w-3/5 flex flex-col gap-2 pr-14">
                        <input
                            type="text"
                            id='name'
                            onChange={handleChange}
                            value={formData.name}
                            placeholder='name'
                        />
                        <textarea
                            type="text"
                            id="description"
                            onChange={handleChange}
                            value={formData.description}
                            placeholder='description'
                        />
                        <input
                            type="text"
                            id='address'
                            onChange={handleChange}
                            value={formData.address}
                            placeholder='address'
                        />
                        <div>
                            <span>Price Rp.</span>
                            <input
                                type="number"
                                id='price'
                                onChange={handleChange}
                                value={formData.price}
                            />
                        </div>
                        <select id="typeModel" onChange={handleChange} value={formData.typeModel}>
                            <option value="">Choose Your Property Type</option>
                            <option value="Koskosan">Kos-kosan</option>
                            <option value="Kontrakan">Kontrakan</option>
                        </select>
                        <div>
                            <span>Bathroom: </span>
                            <input
                                type="number"
                                id='bathrooms'
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                        </div>
                        <div>
                            <span>Bedroom: </span>
                            <input
                                type="number"
                                id='bedrooms'
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                        </div>
                        <div>
                            <div>
                                <span>furnished</span>
                                <input
                                    type="checkbox"
                                    id='furnished'
                                    onChange={handleChange}
                                    checked={formData.furnished}
                                />
                            </div>
                            <div>
                                <span>parking</span>
                                <input
                                    type="checkbox"
                                    id='parking'
                                    onChange={handleChange}
                                    checked={formData.parking}
                                />
                            </div>
                        </div>
                        <button className='bg-slate-500 p-3'>create listing</button>
                    </div>

                    <div className="w-2/5 flex flex-col gap-4">
                    <div className="flex flex-col p-2 gap-2 ">
                        <input
                            type="file"
                            onChange={(e) => setFiles(e.target.files)}
                            accept='image/*'
                            multiple
                        />
                        <button disabled={imageUpload} onClick={handleImageSubmit} type="button" className="bg-teal-500 p-2 cursor-pointer">
                            {imageUpload ? "uploading" : " Upload Photos"}
                        </button>
                        {formData.imageUrls.length > 0 && formData.imageUrls.map((image, index) => (
                            <div key={image} className="flex flex-col shadow-md rounded-md radial-gradient ">
                                <img src={image} alt="image" className="w-45 h-40 object-cover" />
                                <button onClick={() => handleImageDelete(index)}  className="cursor-pointer">Delete</button>
                            </div>
                        ))}
                        {error && <p className='text-red-700 text-sm'>{error}</p>}

                    </div>
                    </div>
                    
                </form>
            </div>

        </div>
    )
}

export default CreateListing