// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleAuthorization } from "../../../../utils/authorization";
import jwt_decode from "jwt-decode";

type Data = {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  location: string;
  desc: string;
  login_id: number;
};

type Response = {
  data: Client | null;
  error: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (!(await handleAuthorization(req))) {
    return res.status(401).json({
      data: null,
      error: [
        {
          message: "not authorized to access this resource",
        },
      ],
    });
  }

  const errors: Error[] = [];

  Object.keys(req.body).forEach((profileValues) => {
    console.log(req.body[profileValues]);
    if (req.body[profileValues] === "") {
      errors.push({
        message: `${profileValues} must not be empty`,
      });
    }
  });

  if (errors.length > 0) {
    return res.status(200).json({
      data: null,
      error: [...errors],
    });
  }

  const { description, firstName, secondName, email, mobile, location } =
    req.body;

  const decodedToken: DecodedToken = jwt_decode(
    `${req.headers.authorization?.split(" ")[1]}`
  );

  const findUser = await prisma.login.findUniqueOrThrow({
    where: {
      Login_id: decodedToken.user_id,
    },
  });

  const client_profile = await prisma.client.create({
    data: {
      client_desc: description,
      client_email: email,
      client_full_name: `${firstName} ${secondName}`,
      client_location: location,
      client_mobile: mobile,
      client_login: {
        connect: {
          Login_id: findUser.Login_id,
        },
      },
    },
  });

  res.status(200).json({
    data: client_profile,
    error: null,
  });
}
