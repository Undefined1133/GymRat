import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../app/firebase/firebaseConfig';

export const signInIfNeeded = async () => {
    try {
      if (!auth.currentUser) {
        const result = await signInAnonymously(auth);
        console.log('Signed in anonymously:', result.user.uid);
      } else {
        console.log('Already signed in:', auth.currentUser.uid);
      }
    } catch (err) {
      console.error('Failed to sign in anonymously:', err);
    }
  }
export default signInIfNeeded;