import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { Analytics, getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_FIREBASE_KEY,
  authDomain: 'highlandsbrain-1333.firebaseapp.com',
  projectId: 'highlandsbrain-1333',
  storageBucket: 'highlandsbrain-1333.appspot.com',
  messagingSenderId: '814840273392',
  appId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  measurementId: 'G-CQ3G51X4W5',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

let analytics: Analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')

export { analytics, app, auth, db }
