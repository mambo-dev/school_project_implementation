// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Accepted_bids, Bidding } from "@prisma/client";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../../types/types";
import { handleAuthorization } from "../../../../../utils/authorization";

type Response = {
  data: Accepted_bids | null;
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

  const { description, date, bid_id } = req.body;
  const findUser = await prisma.login.findUniqueOrThrow({
    where: {
      Login_id: decodedToken.user_id,
    },
    include: {
      Client: true,
    },
  });

  const findBid = await prisma.bidding.findUnique({
    where: {
      bidding_id: bid_id,
    },
  });

  if (!findBid) {
    return res.status(403).json({
      data: null,
      error: [
        {
          message: "bid not not found",
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

  const accepted_bids = await prisma.accepted_bids.create({
    data: {
      accepted_date: date,
      accepted_desc: description,
      accepted_bidding: {
        connect: {
          bidding_id: findBid.bidding_id,
        },
      },
      accepted_freelance_price: findBid.bidding_freelancer_price,
    },
  });

  res.status(200).json({
    data: accepted_bids,
    error: null,
  });
}
