import { Bidding, Freelancer, Role } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/router";

import React, { useState } from "react";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";

type DisplayBid = {
  bid:
    | (Bidding & {
        bidding_project: {
          project_name: string;
        } | null;
      })
    | null;
  token: string | null;
};

export default function DisplayBid({ bid, token }: DisplayBid) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  function accept_bid() {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/project/bid/accept-bid`,
        {
          bid_id: bid?.bidding_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setErrors([]);
        if (!response.data.data) {
          setErrors([...response.data.error]);
        } else {
          setSuccess(true);
          setTimeout(() => {
            router.reload();
          }, 500);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
        setErrors([
          {
            message: "something unexpected happened try again later",
          },
        ]);
      });
  }
  console.log(bid);
  return (
    <div
      className={`flex-1 relative w-full bg-white mb-auto shadow rounded border border-slate-300 flex flex-col `}
    >
      <div className="px-2 py-5 sm:px-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            user bid
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">bid details.</p>
        </div>
      </div>
      <div className="border-t border-slate-300">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">project name</dt>
            <dd className="first-letter:uppercase  mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {bid?.bidding_project?.project_name}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              freelancer bid on{" "}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {format(new Date(`${bid?.bidding_date}`), "PPPP")}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              bid description
            </dt>
            <dd className=" first-letter:uppercase mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {bid?.bidding_desc}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              willing to work for
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {bid?.bidding_freelancer_price}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">actions</dt>
            <dd className=" flex  items-center justify-start text-white gap-x-4 mt-1 text-sm font-medium sm:col-span-2 sm:mt-0">
              <button
                onClick={accept_bid}
                className=" focus:ring-2 ring-green-300 ring-offset-1 bg-green-500 rounded py-2 w-24 px-1 inline-flex items-center justify-center"
              >
                {loading ? "loading..." : "accept"}
              </button>
              <button className="focus:ring-2 ring-red-300 ring-offset-1 bg-red-400 w-24 rounded  py-2 px-1 inline-flex items-center justify-center">
                reject
              </button>
            </dd>
          </div>
          <ErrorMessage errors={errors} />
          <Success message="bid accepted" success={success} />
        </dl>
      </div>
    </div>
  );
}
