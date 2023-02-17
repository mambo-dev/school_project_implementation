import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Accepted_bids, Bidding, Project } from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Client from "../../../components/layout/client";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type BidProps = {
  data: Data;
};
export default function Bid({ data }: BidProps) {
  let acceptedBids: any[] = [];
  data.bids.forEach((bid) => {
    const bids = bid.project_bids.map((bid) => {
      console.log(bid.bidding_accepted_bids);
      return bid.bidding_accepted_bids;
    });
    acceptedBids = bids;
  });

  console.log(acceptedBids);
  return (
    <div className="w-full py-10 px-2">
      <div className="m-auto w-full md:w-1/2 ">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded bg-slate-100 px-4 py-5 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75">
                <span>What is your refund policy?</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-slate-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                If you&apos;re unhappy with your purchase for any reason, email
                us within 90 days and we&apos;ll refund you in full, no
                questions asked.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

type Data = {
  bids: (Project & {
    project_bids: (Bidding & {
      bidding_accepted_bids: Accepted_bids[];
    })[];
  })[];
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

  const bids = await prisma.project.findMany({
    where: {
      project_client: {
        client_login_id: decodedToken.user_id,
      },
    },
    include: {
      project_bids: {
        include: {
          bidding_accepted_bids: true,
        },
      },
    },
  });

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
