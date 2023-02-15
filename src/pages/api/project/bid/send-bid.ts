// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Bidding } from "@prisma/client";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../../types/types";
import { handleAuthorization } from "../../../../../utils/authorization";

type Response = {
  data: Bidding | null;
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

  Object.keys(req.body).forEach((bidValues) => {
    console.log(req.body[bidValues]);
    if (req.body[bidValues] === "") {
      errors.push({
        message: `${bidValues} must be provided`,
      });
    }
  });

  if (errors.length > 0) {
    return res.status(200).json({
      data: null,
      error: [...errors],
    });
  }

  const decodedToken: DecodedToken = jwtDecode(
    `${req.headers.authorization?.split(" ")[1]}`
  );

  const { description, date, price, project_id } = req.body;
  const findUser = await prisma.login.findUniqueOrThrow({
    where: {
      Login_id: decodedToken.user_id,
    },
    include: {
      Freelancer: true,
    },
  });

  const findProject = await prisma.project.findUnique({
    where: {
      project_id,
    },
  });

  if (!findProject) {
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
          message: "could not find account linked to  user",
        },
      ],
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      project_id,
    },
    include: {
      project_bids: true,
    },
  });

  if (!project) {
    return res.status(403).json({
      data: null,
      error: [
        {
          message: "project must have been deleted",
        },
      ],
    });
  }
  console.log(project.project_bids);
  const freelancer_has_bid =
    project.project_bids.length > 0 &&
    project.project_bids.some(
      (bids) =>
        bids.bidding_Freelancer_id === findUser.Freelancer?.freelancer_id
    );

  if (freelancer_has_bid) {
    return res.status(403).json({
      data: null,
      error: [
        {
          message: "cannot bid twice on same project",
        },
      ],
    });
  }

  const create_bid = await prisma.bidding.create({
    data: {
      bidding_date: date,
      bidding_desc: description,
      bidding_freelancer_price: price,
      bidding_project: {
        connect: {
          project_id,
        },
      },
      bidding_Freelancer: {
        connect: {
          freelancer_id: findUser.Freelancer?.freelancer_id,
        },
      },
    },
  });

  res.status(200).json({
    data: create_bid,
    error: null,
  });
}
