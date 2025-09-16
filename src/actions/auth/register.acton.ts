import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { firebase } from "@/firebase/config";

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, password, remember_me, email }, { cookies }) => {
    console.log(`🚀 ~ { name, password, remember_me, email }:`, { name, password, remember_me, email })

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

    // Create User in Firebase
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      // console.log("🚀 ~ user:", user)

      // Update the name (displayName) of the user

      // Verify Email

      return {
        uid: user.user.uid,
        email: user.user.email,
      }
    } catch (error) {

      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }

      throw new Error('Error registering user');
    }

    return { ok: true, msg: 'User registered successfully' };
  },
})