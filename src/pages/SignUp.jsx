import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const { name, email, password, phone } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 sm:p-10'>
        <div className='text-center'>
          <h2 className='text-4xl font-extrabold text-gray-900 mb-2'>
            Welcome!
          </h2>
          <p className='text-gray-600'>Create your account to get started</p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={onSubmit}>
          <div className='space-y-5'>
            <div>
              <label htmlFor='name' className='sr-only'>
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                className='appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white'
                placeholder='Full Name'
                value={name}
                onChange={onChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='9' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M22 21v-2a4 4 0 0 0-3-3.87'%3E%3C/path%3E%3Cpath d='M16 11.13a4 4 0 0 1 0 7.75'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '12px center',
                }}
              />
            </div>

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
              <label htmlFor='phone' className='sr-only'>
                Phone Number
              </label>
              <input
                id='phone'
                name='phone'
                type='tel'
                className='appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white'
                placeholder='Phone Number (Optional)'
                value={phone}
                onChange={onChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '12px center',
                }}
              />
            </div>

            <div className='relative'>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                required
                className='appearance-none relative block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white'
                placeholder='Password'
                value={password}
                onChange={onChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/path%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '12px center',
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword((prevState) => !prevState)}
                className='absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer'
              >
                <img
                  src={visibilityIcon}
                  alt='show password'
                  className='h-5 w-5 text-gray-400 hover:text-gray-600'
                />
              </button>
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              <span>Sign Up</span>
              <ArrowRightIcon fill='#ffffff' width='24px' height='24px' />
            </button>
          </div>
        </form>

        <OAuth />

        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/sign-in'
              className='font-semibold text-primary hover:text-green-600 transition-colors duration-200'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
