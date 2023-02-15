// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Project } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { Error } from "../../../../../types/types";
import { handleAuthorization } from "../../../../../utils/authorization";

type Response = {
  data: Project[] | null;
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

  const find_projects = await prisma.project.findMany({
    where: {
      project_name: {
        //@ts-ignore
        search: req.query.query,
      },
      project_desc: {
        //@ts-ignore
        search: req.query.query,
      },
    },
    include: {
      project_client: true,
      project_bids: true,
    },
  });

  res.status(200).json({
    data: find_projects,
    error: null,
  });
}
