import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  Accepted_bids,
  Bidding,
  Client as ClientType,
  Freelancer,
  Project,
} from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { ReactElement } from "react";
import Client from "../../../components/layout/client";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type BidProps = {
  data: Data;
};
export default function Bid({ data }: BidProps) {
  const { token, bids } = data;
  return (
    <div className="w-full py-10 px-2">
      <div className="m-auto w-full md:w-1/2 flex flex-col gap-y-3">
        {bids?.map((bid) => (
          <Disclosure key={bid.accepted_id}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded bg-slate-100 px-4 py-5 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75">
                  <span className="flex items-center gap-x-2 ">
                    <span className="relative w-12 h-12 rounded-full bg-white  border border-slate-300">
                      <Image
                        src="/images/avatar.png"
                        alt="profile image"
                        fill
                        sizes=""
                        className="rounded-full "
                      />
                    </span>
                    <span className="flex  flex-1 items-center gap-x-4  ">
                      <span>
                        {
                          bid.accepted_bidding?.bidding_Freelancer
                            ?.freelancer_full_name
                        }
                      </span>
                      <span className="border  border-slate-300 bg-white rounded-full py-1 px-2  text-slate-900 font-bold text-xs ">
                        {addCommas(bid.accepted_freelance_price)} ksh
                      </span>
                    </span>
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-slate-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  {bid.accepted_desc}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

type Data = {
  bids:
    | (Accepted_bids & {
        accepted_by: ClientType | null;
        accepted_bidding: {
          bidding_Freelancer: Freelancer | null;
        } | null;
      })[]
    | null;
  token: string | null;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const { req } = context;

  const access_token = req.cookies.access_token;
  if (!access_token || access_token.trim() === "") {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const decodedToken: DecodedToken = jwtDecode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const findClient = await prisma.client.findUnique({
    where: {
      client_login_id: decodedToken.user_id,
    },
  });

  const bids = await prisma.accepted_bids.findMany({
    where: {
      accepted_by_id: findClient?.client_id,
    },
    include: {
      accepted_by: true,
      accepted_bidding: {
        select: {
          bidding_Freelancer: true,
          bidding_desc: false,
          bidding_accepted_bids: false,
          bidding_freelancer_price: false,
          bidding_project: false,
          bidding_date: false,
        },
      },
    },
  });
  console.log(bids);
  return {
    props: {
      data: {
        bids: JSON.parse(JSON.stringify(bids)),
        token: access_token,
      },
    },
  };
};

Bid.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};

export function addCommas(num: number | undefined) {
  return num?.toLocaleString();
}
