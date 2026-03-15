"use server"

import { PlatformUserCreateInput } from "@enterprise-commerce/core/platform/types"
import { cookies } from "next/headers"
import { storefrontClient } from "clients/storefrontClient"
import internalClient from "clients/internalClient"
import { COOKIE_ACCESS_TOKEN } from "constants/index"

// /apps/web/app/actions/user.actions.ts
export async function registerUser(input: any) {
  // If 'input' is already a plain object from your component
  let email, password;

  if (input instanceof FormData) {
    email = input.get("email") as string;
    password = input.get("password") as string;
  } else {
    // If it's a plain object (which happens sometimes with manual calls)
    email = input.email;
    password = input.password;
  }

  // Now call your client
  const result = await internalClient.registerUser({ email, password });
  // ... rest of your logic
  return result;
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await storefrontClient.createUserAccessToken({ email, password }) // change this
  cookies().set(COOKIE_ACCESS_TOKEN, user?.accessToken || "", { expires: new Date(user?.expiresAt || "") })
  return user
}

// For Task 1, you can leave the getCurrentUser() function below as it is. 
export async function getCurrentUser() {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value
  const user = await storefrontClient.getUser(accessToken || "") // we should replace this with our client
  return user
}

// disregard the updateUser function, someone else is working on it
export async function updateUser(input: PlatformUserCreateInput) {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value

  const user = await storefrontClient.updateUser(accessToken!, { ...input })
  return user
}

export async function logoutUser() {
  cookies().delete(COOKIE_ACCESS_TOKEN)
}
