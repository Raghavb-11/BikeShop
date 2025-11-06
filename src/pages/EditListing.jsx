import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'
import { storage } from '../firebase.config'

function EditListing() {
  const [geolocationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0);
  const [formData, setFormData] = useState({
    type: 'rent',
    description: '',
    old: 1,
    brand: '',
    parking: false,
    gear: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: [], // Changed from 'images' to 'imageUrls'
    latitude: 0,
    longitude: 0,
  })

  const {
    type,
    description,
    old,
    brand,
    parking,
    gear,
    address,
    offer,
    regularPrice,
    discountedPrice,
    imageUrls, // Updated field
    latitude,
    longitude,
  } = formData
  const auth = getAuth()
  const navigate = useNavigate()
  const params = useParams()
  const isMounted = useRef(true)

  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('You can not edit that listing')
      navigate('/')
    }
  })

  // Fetch listing to edit
  useEffect(() => {
    setLoading(true)
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setFormData({ ...docSnap.data(), address: docSnap.data().location })
        setLoading(false)
      } else {
        navigate('/')
        toast.error('Listing does not exist')
      }
    }

    fetchListing()
  }, [params.listingId, navigate])

  // Sets userRef to logged in user
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if (imageUrls.length > 6) { // Updated from 'images' to 'imageUrls'
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
      location = address
    }

    // Store image in firebase
    const storeImage = async (image) => {
    
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

      const storageRef = ref(storage, 'imageUrls/' + fileName)

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            reject(error)
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...imageUrls].map((image) => storeImage(image)) // Updated from 'images' to 'imageUrls'
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }
    setLoading(false)
    delete formDataCopy.imageUrls // Updated from 'images'
    delete formDataCopy.address
    location && (formDataCopy.location = location)
    !formDataCopy.offer && delete formDataCopy.discountedPrice
    console.log(formDataCopy)

    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('Listing saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      // Convert FileList to an array
      const newFiles = [...e.target.files];
      setFormData((prevState) => ({
        ...prevState,
        imageUrls: [...(prevState.imageUrls || []), ...newFiles],// Assign a true array
      }));
      setUploadedCount((prevCount) => prevCount + newFiles.length);
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <header className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
            Edit Listing
          </h1>
          <p className='mt-2 text-lg text-gray-600'>
            Update your cycle listing details
          </p>
        </header>

        <main>
          <form onSubmit={onSubmit} className='bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Sell / Rent
              </label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    type === 'sale'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='type'
                  value='sale'
                  onClick={onMutate}
                >
                  Sell
                </button>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    type === 'rent'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='type'
                  value='rent'
                  onClick={onMutate}
                >
                  Rent
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Brief Description
              </label>
              <input
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                type='text'
                id='description'
                value={description}
                onChange={onMutate}
                maxLength='32'
                minLength='10'
                required
                placeholder='Enter a brief description'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Age (in months)
                </label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                  type='number'
                  id='old'
                  value={old}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Brand
                </label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                  type='text'
                  id='brand'
                  value={brand}
                  onChange={onMutate}
                  maxLength='32'
                  minLength='3'
                  required
                  placeholder='Cycle brand'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Parking Spot
              </label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    parking
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='parking'
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    !parking && parking !== null
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='parking'
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Gear Type
              </label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    gear
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='gear'
                  value={true}
                  onClick={onMutate}
                >
                  Gear Cycle
                </button>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    !gear && gear !== null
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='gear'
                  value={false}
                  onClick={onMutate}
                >
                  Non Gear
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Address
              </label>
              <textarea
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                rows='3'
                id='address'
                value={address}
                onChange={onMutate}
                required
                placeholder='Enter the full address'
              />
            </div>

            {!geolocationEnabled && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Latitude
                    </label>
                    <input
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                      type='number'
                      id='latitude'
                      value={latitude}
                      onChange={onMutate}
                      required
                      placeholder='e.g., 28.6139'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Longitude
                    </label>
                    <input
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                      type='number'
                      id='longitude'
                      value={longitude}
                      onChange={onMutate}
                      required
                      placeholder='e.g., 77.2090'
                    />
                  </div>
                </div>
                <button
                  type='button'
                  className='w-full py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200'
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(address);
                    const latLongUrl = `https://www.latlong.net/?place=${encodedAddress}`;
                    window.open(latLongUrl, '_blank');
                  }}
                >
                  Get Latitude and Longitude
                </button>
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Special Offer
              </label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    offer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='offer'
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  type='button'
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    !offer && offer !== null
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  id='offer'
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Regular Price
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                  type='number'
                  id='regularPrice'
                  value={regularPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required
                  placeholder='0'
                />
                {type === 'rent' && (
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium'>
                    ₹ / Month
                  </span>
                )}
              </div>
            </div>

            {offer && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Discounted Price
                </label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required={offer}
                  placeholder='0'
                />
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Images
              </label>
              <p className='text-sm text-gray-500 mb-3'>
                The first image will be the cover (max 6).
              </p>
              <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-200'>
                <input
                  className='hidden'
                  type='file'
                  id='imageUrls'
                  onChange={onMutate}
                  max='6'
                  accept='.jpg,.png,.jpeg'
                  multiple
                  required
                />
                <label
                  htmlFor='imageUrls'
                  className='cursor-pointer block'
                >
                  <span className='text-primary font-semibold hover:text-green-600'>
                    Click to upload images
                  </span>
                  <span className='block text-sm text-gray-500 mt-1'>
                    PNG, JPG, JPEG up to 6 files
                  </span>
                </label>
              </div>
              {uploadedCount > 0 && (
                <p className='mt-2 text-sm text-gray-600'>
                  Uploaded {uploadedCount} image(s)
                </p>
              )}
            </div>

            <button
              type='submit'
              className='w-full py-4 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg'
            >
              Update Listing
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default EditListing