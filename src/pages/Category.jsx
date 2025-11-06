import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { 
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
  } from 'firebase/firestore';
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('timestamp')
    const [sortOrder, setSortOrder] = useState('desc')
    const params = useParams()
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const fetchListings = useCallback(async () => {
        try {
            const listingsRef = collection(db, 'listings')

            const q = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy(sortBy, sortOrder),
                limit(10)
            )
            
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings(listings)
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch listings')
        }
    }, [params.categoryName, sortBy, sortOrder])

    useEffect(() => {
        fetchListings()
    }, [fetchListings])

    const handleSortChange = (e) => {
        const value = e.target.value
        if (value === 'newest') {
            setSortBy('timestamp')
            setSortOrder('desc')
        } else if (value === 'oldest') {
            setSortBy('timestamp')
            setSortOrder('asc')
        } else if (value === 'price-asc') {
            setSortBy('regularPrice')
            setSortOrder('asc')
        } else if (value === 'price-desc') {
            setSortBy('regularPrice')
            setSortOrder('desc')
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 capitalize'>
                        {params.categoryName === 'rent' ? 'Cycles for Rent' : 'Cycles for Sale'}
                    </h1>
                    <p className='mt-2 text-lg text-gray-600'>
                        Browse our collection of {params.categoryName === 'rent' ? 'rental' : 'sale'} cycles
                    </p>
                </header>
                
                <div className='mb-6 flex justify-end'>
                    <select
                        className='px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer'
                        onChange={handleSortChange}
                        defaultValue='newest'
                    >
                        <option value='newest'>Newest First</option>
                        <option value='oldest'>Oldest First</option>
                        <option value='price-asc'>Price: Low to High</option>
                        <option value='price-desc'>Price: High to Low</option>
                    </select>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center py-20'>
                        <Spinner />
                    </div>
                ) : listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {listings.map((listing) => (
                                    <ListingItem 
                                        listing={listing.data} 
                                        id={listing.id} 
                                        key={listing.id} 
                                    />
                                ))}
                            </ul>
                        </main>
                        {lastFetchedListing && (
                            <div className='mt-8 text-center'>
                                <button
                                    onClick={fetchListings}
                                    className='px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='text-center py-20'>
                        <p className='text-xl text-gray-600'>
                            No listings for {params.categoryName}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Category
