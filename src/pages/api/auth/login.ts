import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "../../../../types/types";
import { handleLoginValidation } from "../../../../utils/validation";

type Data = {
  usename: string;
  role: string;
};

type Response = {
  data: Data | null;
  error: Error[] | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { valid, errors } = handleLoginValidation(req.body);

  if (!valid) {
    return res.status(200).json({
      data: null,
      error: errors,
    });
  }

  return res.status(200).json({
    data: { usename: "John Doe", role: "client" },
    error: null,
  });
}
