// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Project } from "@prisma/client";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleAuthorization } from "../../../../utils/authorization";

type Response = {
  data: Project | null;
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

  Object.keys(req.body).forEach((projectValues) => {
    console.log(req.body[projectValues]);
    if (req.body[projectValues] === "") {
      errors.push({
        message: `${projectValues} must be provided`,
      });
    }
  });

  if (errors.length > 0) {
    return res.status(200).json({
      data: null,
      error: [...errors],
    });
  }

  const { name, description, date, cost } = req.body;

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

  const create_project = await prisma.project.create({
    data: {
      project_cost: cost,
      project_date: date,
      project_desc: description,
      project_name: name,
      project_client: {
        connect: {
          client_id: findUser.Client?.client_id,
        },
      },
    },
  });

  res.status(200).json({
    data: create_project,
    error: null,
  });
}
