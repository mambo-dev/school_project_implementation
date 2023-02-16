import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "../../../../types/types";
import { checkUserExists } from "../../../../utils/user";
import { handleLoginValidation } from "../../../../utils/validation";
import * as argon2 from "argon2";
import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import cookie from "cookie";
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

  if (!(await argon2.verify(`${user?.Login_password}`, password))) {
    return res.status(200).json({
      data: null,
      error: [
        {
          message: "wrong username or password",
        },
      ],
    });
  }

  var access_token = jwt.sign(
    { user_id: user.Login_id, username: user.Login_username },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "2h",
    }
  );

  //send cookie with jwt
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 120,
      sameSite: "strict",
      path: "/",
    })
  );

  return res.status(200).json({
    data: { username: user.Login_username, role: user.Login_role },
    error: null,
  });
}
