import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/derek-thomson-AJ-7QpXV9U4-unsplash.jpg'
import sellCategoryImage from '../assets/jpg/chepe-nicoli-if0K7iBBDxw-unsplash.jpg'
import Slider from '../components/Slider'

function Explore() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/10 via-green-50 to-blue-50 pb-24 relative overflow-hidden'>
      {/* Decorative gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-100/30 pointer-events-none' />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        <header className='mb-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-green-600 to-blue-600 bg-clip-text text-transparent mb-2'>
            Explore
          </h1>
          <p className='mt-2 text-lg text-gray-700 font-medium'>
            Find your perfect cycle for rent or sale
          </p>
        </header>

        <main className='space-y-12'>
          <div className='w-full relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-green-200/30 to-blue-200/20 rounded-3xl blur-3xl -z-10' />
            <Slider />
          </div>

          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
              Categories
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Link
                to='/category/rent'
                className='group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='aspect-[4/3] overflow-hidden relative'>
                  <img
                    src={rentCategoryImage}
                    alt='rent'
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'>
                  <div className='absolute bottom-0 left-0 right-0 p-6'>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      Cycles for Rent
                    </h3>
                    <p className='text-gray-200'>Find cycles available for rent</p>
                  </div>
                </div>
              </Link>

              <Link
                to='/category/sale'
                className='group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='aspect-[4/3] overflow-hidden relative'>
                  <img
                    src={sellCategoryImage}
                    alt='sell'
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-500/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'>
                  <div className='absolute bottom-0 left-0 right-0 p-6'>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      Cycles for Sale
                    </h3>
                    <p className='text-gray-200'>Browse cycles available for purchase</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Explore
