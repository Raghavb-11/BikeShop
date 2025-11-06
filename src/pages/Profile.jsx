import { useState, useEffect ,useCallback} from 'react'
import { Link } from 'react-router-dom'
import { getAuth, updateProfile, updateEmail } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import bikeIcon from '../assets/svg/bicycle-solid.svg'

function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)

  const getPhoneNumber=useCallback(async()=>{
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    return (userData.phone)
  },[auth.currentUser.uid])
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    phone: '', 
  })

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const phone = await getPhoneNumber();
      setFormData((prevState) => ({
        ...prevState,
        phone,
      }));
    };

    fetchPhoneNumber();
  }, [getPhoneNumber]);

  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

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
    
    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const { name, email, phone } = formData

  const onSubmit = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const updates = {}

      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
        updates.name = name
      }

      if (auth.currentUser.email !== email) {
        await updateEmail(auth.currentUser, email)
        updates.email = email
      }

      if (auth.currentUser.phoneNumber !== phone) {
        updates.phone = phone
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <header className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
            My Profile
          </h1>
          <button
            type='button'
            onClick={onLogout}
            className='px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            Logout
          </button>
        </header>

        <main className='space-y-8'>
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>Personal Details</h2>
              <button
                onClick={() => {
                  changeDetails && onSubmit()
                  setChangeDetails((prevState) => !prevState)
                }}
                className='px-4 py-2 text-primary font-semibold hover:text-green-600 transition-colors duration-200'
              >
                {changeDetails ? 'Done' : 'Change'}
              </button>
            </div>

            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    changeDetails
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-gray-100'
                  }`}
                  disabled={!changeDetails}
                  value={name}
                  onChange={onChange}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    changeDetails
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-gray-100'
                  }`}
                  disabled={!changeDetails}
                  value={email}
                  onChange={onChange}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone
                </label>
                <input
                  type='tel'
                  id='phone'
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    changeDetails
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-300 bg-gray-100'
                  }`}
                  disabled={!changeDetails}
                  value={phone}
                  onChange={onChange}
                  placeholder='Your phone number'
                />
              </div>
            </form>
          </div>

          <Link
            to='/create-listing'
            className='flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1'
          >
            <div className='flex items-center gap-4'>
              <img src={bikeIcon} alt='bike' className='w-12 h-12' />
              <p className='text-lg font-semibold text-gray-900'>
                Sell or rent your bike
              </p>
            </div>
            <img src={arrowRight} alt='arrow right' className='w-6 h-6' />
          </Link>

          {!loading && listings?.length > 0 && (
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Your Listings</h2>
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Profile
