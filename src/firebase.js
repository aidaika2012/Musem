import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCdYScOgKtLw3T1KEvT62JRfve46HZn-eM",
  authDomain: "musem-f012c.firebaseapp.com",
  projectId: "musem-f012c",
  storageBucket: "musem-f012c.firebasestorage.app",
  messagingSenderId: "819616495426",
  appId: "1:819616495426:web:01f83bb09f57368c8e3adb",
  measurementId: "G-SK9PNFW5K5"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
