// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Project } from "@prisma/client";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../../types/types";
import { handleAuthorization } from "../../../../../utils/authorization";

type Response = {
  data: boolean | null;
  error: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  console.log(req.query);
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

  const findProject = await prisma.project.findUnique({
    where: {
      project_id: Number(req.query.project_id),
    },
  });

  if (
    !findProject ||
    findProject.project_client_id !== findUser.Client?.client_id
  ) {
    return res.status(403).json({
      data: null,
      error: [
        {
          message: "cannot delete project",
        },
      ],
    });
  }

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

  const delete_project = await prisma.project.delete({
    where: {
      project_id: findProject.project_id,
    },
  });

  res.status(200).json({
    data: true,
    error: null,
  });
}
