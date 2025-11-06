import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
  const [message, setMessage] = useState('')
  const [owner, setOwner] = useState(null)
  const [searchParams] = useSearchParams()

  const params = useParams()
  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setOwner(docSnap.data())
      } else {
        toast.error('Could not get owner data')
      }
    }
    getOwner()
  }, [params.landlordId])

  const onChange = (e) => setMessage(e.target.value)

  const handleChatRoom = () => {
    if (owner?.name) {
      const roomName = owner.name.toLowerCase().replace(/\s+/g, '-');
      const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL || 'http://localhost:8000';
      window.open(`${chatServerUrl}/${roomName}`, '_blank');
    } else {
      toast.error('Could not join chat room - owner name not available');
    }
  }
  
  const handleCallClick = () => {
    const formattedPhone = owner.phone?.replace(/\D/g, '')
    window.location.href = `tel:${formattedPhone}`
  }

  const handleWhatsAppClick = () => {
    const formattedPhone = owner.phone?.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      `${searchParams.get('listingName')}: ${message}`
    )}`
    window.open(whatsappUrl, '_blank')
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12'>
      <div className='max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-10'>
        <header className='mb-8'>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-2'>
            Contact Owner
          </h1>
          <p className='text-gray-600'>
            Get in touch with the cycle owner
          </p>
        </header>

        {owner !== null && (
          <main className='space-y-6'>
            <div className='bg-gray-50 rounded-xl p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-2'>
                Contact {owner?.name}
              </h2>
              <p className='text-gray-600'>{owner?.email}</p>
              {owner?.phone && (
                <p className='text-gray-600'>{owner.phone}</p>
              )}
            </div>

            <button
              type='button'
              onClick={handleChatRoom}
              className='w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              Join {owner?.name}'s Chat Room
            </button>

            <form className='space-y-6'>
              <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                  Message
                </label>
                <textarea
                  name='message'
                  id='message'
                  rows='6'
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                  value={message}
                  onChange={onChange}
                  placeholder='Type your message here...'
                ></textarea>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <a
                  href={`mailto:${owner.email}?Subject=${encodeURIComponent(
                    searchParams.get('listingName') || ''
                  )}&body=${encodeURIComponent(message)}`}
                  className='block'
                >
                  <button
                    type='button'
                    className='w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  >
                    Send Email
                  </button>
                </a>

                {owner.phone && (
                  <>
                    <button
                      type='button'
                      onClick={handleWhatsAppClick}
                      className='w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    >
                      Send WhatsApp
                    </button>
                    <button
                      type='button'
                      onClick={handleCallClick}
                      className='w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:col-span-2'
                    >
                      Call Now
                    </button>
                  </>
                )}
              </div>
            </form>
          </main>
        )}
      </div>
    </div>
  )
}

export default Contact
