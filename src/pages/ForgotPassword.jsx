import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = (e) => setEmail(e.target.value)
  
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.error('Could not send reset email')
    }
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 sm:p-10'>
        <div className='text-center'>
          <h2 className='text-4xl font-extrabold text-gray-900 mb-2'>
            Forgot Password
          </h2>
          <p className='text-gray-600'>
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={onSubmit}>
          <div>
            <label htmlFor='email' className='sr-only'>
              Email address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              className='appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white'
              placeholder='Email address'
              value={email}
              onChange={onChange}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '12px center',
              }}
            />
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              <span>Send Reset Link</span>
              <ArrowRightIcon fill='#ffffff' width='24px' height='24px' />
            </button>
          </div>
        </form>

        <div className='text-center'>
          <Link
            to='/sign-in'
            className='text-sm font-semibold text-primary hover:text-green-600 transition-colors duration-200'
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
