import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.css'

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='relative mb-8 rounded-2xl overflow-hidden shadow-2xl'>
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Scrollbar]}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className='h-64 md:h-96'
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div className='w-full h-full'>
                  <img
                    src={listing.imgUrls[index]}
                    alt={`Slide ${index}`}
                    className='w-full h-full object-cover'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className='absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setShareLinkCopied(true)
              setTimeout(() => {
                setShareLinkCopied(false)
              }, 2000)
            }}
          >
            <img src={shareIcon} alt='share' className='w-5 h-5' />
          </button>

          {shareLinkCopied && (
            <div className='absolute top-16 right-4 bg-white rounded-xl px-4 py-2 shadow-lg z-10'>
              <p className='text-sm font-semibold text-gray-900'>Link Copied!</p>
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
              {listing.name}
            </h1>
            <p className='text-xl text-gray-600 mb-4'>{listing.location}</p>
            
            <div className='flex flex-wrap items-center gap-3 mb-6'>
              <span className='px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold'>
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
              </span>
              {listing.offer && (
                <span className='px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold'>
                  ₹{listing.regularPrice - listing.discountedPrice} discount
                </span>
              )}
              {listing.brand && (
                <span className='px-4 py-2 bg-gray-200 text-gray-900 rounded-full text-sm font-semibold'>
                  Brand: {listing.brand}
                </span>
              )}
            </div>

            <div className='text-3xl font-bold text-primary mb-6'>
              ₹{listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {listing.type === 'rent' && ' / Month'}
            </div>
          </div>

          <div className='border-t border-gray-200 pt-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Details</h2>
            <ul className='space-y-2'>
              <li className='flex items-center text-gray-700'>
                <span className='font-medium mr-2'>Age:</span>
                {listing.old > 1
                  ? `${listing.old} months old`
                  : '1 month old'}
              </li>
              {listing.parking && (
                <li className='flex items-center text-gray-700'>
                  <span className='font-medium mr-2'>Parking:</span>
                  Available
                </li>
              )}
              <li className='flex items-center text-gray-700'>
                <span className='font-medium mr-2'>Type:</span>
                {listing.gear ? 'Gear Cycle' : 'Non Gear'}
              </li>
            </ul>
          </div>

          {listing.description && (
            <div className='border-t border-gray-200 pt-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>Description</h2>
              <p className='text-gray-700 leading-relaxed'>{listing.description}</p>
            </div>
          )}

          <div className='border-t border-gray-200 pt-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Location</h2>
            <div className='h-64 md:h-96 rounded-xl overflow-hidden'>
              <MapContainer
                style={{ height: '100%', width: '100%' }}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${encodeURIComponent(listing.name)}`}
              className='block w-full text-center py-4 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              Contact Owner
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Listing
