import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { firebase } from "@/firebase/config";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";


export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {
    console.log(`🚀 ~ { email, password, remember_me }:`, { email, password, remember_me })

    // Cookies
    if (remember_me) {
      cookies.set('email', email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
        path: '/'
      })
    } else {
      cookies.delete('email', {
        path: '/'
      });
    }

    try {
      const user = await signInWithEmailAndPassword(firebase.auth, email, password);

      return {
        uid: user.user.uid,
        email: user.user.email,
      }
    } catch (error) {
      console.error("🚀 ~ error:", error)
      const firebaseError = error as AuthError;

      if(firebaseError.code === 'auth/invalid-credential') {
        throw new Error('Invalid credentials');
      }

      throw new Error('Error logging in user');

    }
  },
})