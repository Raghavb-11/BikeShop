import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import cycleIcon from '../assets/svg/bicycle-solid.svg'
import gearIcon from '../assets/svg/gears-solid.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'

function ListingItem({listing, id, onEdit, onDelete}) {
    return (
        <li className='relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group'>
          <Link
            to={`/category/${listing.type}/${id}`}
            className='block'
          >
            {/* Image Section */}
            <div className='relative w-full h-48 md:h-56 overflow-hidden bg-gray-200'>
              <img
                src={listing.imgUrls[0]}
                alt={listing.name || listing.description}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                }}
              />
              {listing.offer && (
                <div className='absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg'>
                  OFFER
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className='p-4 md:p-5'>
              <p className='text-xs text-gray-500 font-medium mb-1 truncate'>
                {listing.location}
              </p>
              <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
                {listing.description || listing.name}
              </h3>
              <p className='text-xl font-bold text-primary mb-3'>
                ₹{listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                {listing.type === 'rent' && ' / Month'}
              </p>
              
              {/* Info Icons */}
              <div className='flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100'>
                <div className='flex items-center gap-2'>
                  <img 
                    src={cycleIcon} 
                    className='w-5 h-5 opacity-70' 
                    alt='age' 
                  />
                  <span className='text-xs'>
                    {listing.old > 1 ? `${listing.old} months` : '1 month'}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <img 
                    src={gearIcon} 
                    className='w-5 h-5 opacity-70' 
                    alt='gear' 
                  />
                  <span className='text-xs'>
                    {listing.gear ? 'Gear' : 'Non Gear'}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Action Buttons */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(id, listing.name)
              }}
              className='absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10'
              aria-label='Delete listing'
            >
              <DeleteIcon
                className='w-5 h-5'
                fill='rgb(231, 76, 60)'
              />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit(id)
              }}
              className='absolute top-2 left-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10'
              aria-label='Edit listing'
            >
              <EditIcon className='w-5 h-5' fill='#00cc66' />
            </button>
          )}
        </li>
    )
}

export default ListingItem
