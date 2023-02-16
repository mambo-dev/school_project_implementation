import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Error } from "../../../../types/types";
import { handleSignUpValidation } from "../../../../utils/validation";
import * as argon2 from "argon2";
import { checkUserExists } from "../../../../utils/user";

type Data = {
  usename: string;
  role: string;
};

type Response = {
  data: Data | null;
  error: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { username, password, confirmPassword, role } = req.body;

  const { valid, errors } = handleSignUpValidation(req.body);

  if (!valid) {
    return res.status(200).json({
      data: null,
      error: errors,
    });
  }

  if (await checkUserExists(username)) {
    return res.status(200).json({
      data: null,
      error: [{ message: "user already exists" }],
    });
  }

  const hash_password = await argon2.hash(password, {
    hashLength: 12,
  });

  const signup = await prisma.login.create({
    data: {
      Login_password: hash_password,
      Login_role: role,
      Login_username: username,
    },
  });

  return res.status(200).json({
    data: { usename: signup.Login_username, role: signup.Login_role },
    error: null,
  });
}
