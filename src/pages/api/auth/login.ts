import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "../../../../types/types";
import { checkUserExists } from "../../../../utils/user";
import { handleLoginValidation } from "../../../../utils/validation";
import * as argon2 from "argon2";
import prisma from "../../../../lib/prisma";

type Data = {
  username: string;
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
  const { username, password } = req.body;
  const { valid, errors } = handleLoginValidation(req.body);

  if (!valid) {
    return res.status(200).json({
      data: null,
      error: errors,
    });
  }

  if (!(await checkUserExists(username))) {
    return res.status(200).json({
      data: null,
      error: [
        {
          message: "user does not exist",
        },
      ],
    });
  }

  const user = await prisma.login.findUniqueOrThrow({
    where: {
      Login_username: username,
    },
  });

  if (!(await argon2.verify(`${user?.User_password}`, password))) {
    return res.status(200).json({
      data: null,
      error: [
        {
          message: "wrong username or password",
        },
      ],
    });
  }

  //send cookie with jwt

  return res.status(200).json({
    data: { username: user.Login_username, role: user.Login_role },
    error: null,
  });
}
