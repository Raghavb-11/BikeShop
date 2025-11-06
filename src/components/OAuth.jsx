import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick= async ()=>{
        try{
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })

            let result
            try {
              result = await signInWithPopup(auth, provider)
            } catch (popupError) {
              // Fallback for popup blockers or environments where popup is disallowed
              const popupErrorCode = popupError?.code || ''
              const shouldFallback = popupErrorCode === 'auth/popup-blocked' || popupErrorCode === 'auth/cancelled-popup-request'
              if (shouldFallback) {
                await signInWithRedirect(auth, provider)
                return
              }
              throw popupError
            }

            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                  name: user.displayName,
                  email: user.email,
                  timestamp: serverTimestamp(),
                })
            }
            navigate('/')
        } 
        catch (error) {
            const code = error?.code || 'unknown'
            const message = code === 'auth/unauthorized-domain' 
              ? 'Unauthorized domain for Google sign-in. Add your domain in Firebase Auth settings.' 
              : code === 'auth/operation-not-allowed' 
              ? 'Google provider is disabled in Firebase Auth. Enable it in the Firebase console.' 
              : 'Could not authorize with Google'
            toast.error(message)
        }
    }
    return (
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500 font-medium'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 flex justify-center'>
            <button
              onClick={onGoogleClick}
              className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5'
            >
              <img className='h-5 w-5 mr-3' src={googleIcon} alt='Google' />
              <span>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Google</span>
            </button>
          </div>
        </div>
    )
}

export default OAuth
