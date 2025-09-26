import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { firebase } from "@/firebase/config";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials);
    console.log("🚀 ~ credential:", credential);

    if (!credential) {
      throw new Error('Google Sign-In Failed');
    }

    const response = await signInWithCredential(firebase.auth, credential!);
    // console.log("🚀 ~ response:", response)

    return { ok: true };
  }
})