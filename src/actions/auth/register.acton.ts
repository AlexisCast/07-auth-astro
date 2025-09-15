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
  handler: async ({ name, password, remember_me, email }) => {
    console.log(`🚀 ~ { name, password, remember_me, email }:`, { name, password, remember_me, email })

    return true;
  },
})