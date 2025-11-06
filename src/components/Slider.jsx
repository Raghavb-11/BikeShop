import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper'; // Import required modules
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import Spinner from './Spinner';

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)
      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }
  
  if (listings.length === 0) {
    return <></>
  }
  
  return (
    listings && (
      <div className='relative'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'>
          Recommended
        </h2>

        <Swiper
          modules={[Autoplay, Navigation, Pagination, Scrollbar]}
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className='rounded-2xl overflow-hidden shadow-xl'
          style={{ height: '400px' }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
              className='cursor-pointer'
            >
              <div className='relative w-full h-full overflow-hidden rounded-2xl'>
                <img
                  src={data.imgUrls[0]}
                  alt={data.name}
                  className='w-full h-full object-cover'
                  style={{ objectFit: 'cover' }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                
                <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
                  <p className='text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-lg'>
                    {data.name}
                  </p>
                  <p className='inline-block px-4 py-2 bg-primary text-white font-semibold rounded-full text-lg shadow-lg'>
                    ₹{data.discountedPrice ?? data.regularPrice}
                    {data.type === 'rent' && ' / month'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  )
}

export default Slider
