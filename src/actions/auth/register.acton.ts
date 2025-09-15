import { defineAction } from "astro:actions";
import { z } from "astro:schema";

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

    return { ok: true, msg: 'User registered successfully' };
  },
})