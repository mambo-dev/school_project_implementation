// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Freelancer } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleAuthorization } from "../../../../utils/authorization";
import jwt_decode from "jwt-decode";

type Response = {
  data: Freelancer | null;
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
          message: "not authorized to perfrom this action",
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

  const freelaner_profile = await prisma.freelancer.update({
    where: {
      freelancer_login_id: findUser.Login_id,
    },
    data: {
      freelancer_desc: description,
      freelancer_email: email,
      freelancer_full_name: `${firstName} ${secondName}`,
      freelancer_location: location,
      freelancer_mobile: mobile,
    },
  });

  res.status(200).json({
    data: freelaner_profile,
    error: null,
  });
}
