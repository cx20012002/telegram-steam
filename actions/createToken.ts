"use server";

import { serverClient } from "@/lib/steamServer";

export const createToken = async (userId: string) => {
  const token = serverClient.createToken(userId);
  console.log("Token created for user:", token);
  return token;
};
