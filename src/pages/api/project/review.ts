// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Completed_projects_review, Project } from "@prisma/client";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleAuthorization } from "../../../../utils/authorization";

type Response = {
  data: Completed_projects_review | null;
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

  Object.keys(req.body).forEach((reviewValues) => {
    console.log(req.body[reviewValues]);
    if (req.body[reviewValues] === "") {
      errors.push({
        message: `${reviewValues} must be provided`,
      });
    }
  });

  if (errors.length > 0) {
    return res.status(200).json({
      data: null,
      error: [...errors],
    });
  }

  const { description, date, project_id } = req.body;

  const decodedToken: DecodedToken = jwtDecode(
    `${req.headers.authorization?.split(" ")[1]}`
  );

  const findUser = await prisma.login.findUniqueOrThrow({
    where: {
      Login_id: decodedToken.user_id,
    },
    include: {
      Client: true,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      data: null,
      error: [
        {
          message: "could not find account linked to login user",
        },
      ],
    });
  }

  const create_review = await prisma.completed_projects_review.create({
    data: {
      review_date: new Date(date),
      review_desc: description,
      review_project: {
        connect: {
          project_id,
        },
      },
    },
  });

  res.status(200).json({
    data: create_review,
    error: null,
  });
}
