import { Bidding, Freelancer, Login } from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { ReactElement, useState } from "react";
import Client from "../../../../components/layout/client";
import DisplayBid from "../../../../components/shared/display-bid";
import DisplayProfile from "../../../../components/shared/display-profile";
import prisma from "../../../../lib/prisma";
import { DecodedToken } from "../../../../types/types";

type Data = {
  profile: Freelancer | null;
  bid:
    | (Bidding & {
        bidding_project: {
          project_name: string;
        } | null;
      })
    | null;
  token: string | null;
  user: Login | null;
};

type BidPage = {
  data: Data;
};

export default function BidPage({ data }: BidPage) {
  const { bid, profile, token, user } = data;
  return (
    <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-2  ">
      <div className="w-full h-full mb-auto flex flex-col px-2 py-2 gap-y-3">
        <h1 className="font-medium text-slate-500 text-xl m-auto">
          freelancer bid pitch{" "}
        </h1>
        <DisplayBid bid={bid} token={token} />
      </div>
      <div className="w-full mb-auto flex flex-col px-2 py-2 gap-y-3">
        <h1 className="font-medium text-slate-500 text-xl m-auto">
          {" "}
          freelancer bidding profile{" "}
        </h1>
        <DisplayProfile
          profile={profile}
          type="freelancer"
          token={token}
          user={user}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const { req, query } = context;

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

  const { bid_id, fid } = query;

  if (!bid_id) {
    return {
      redirect: {
        permanent: false,
        destination: "/client",
      },
    };
  }

  const user = await prisma.login.findUnique({
    where: {
      Login_id: decodedToken.user_id,
    },
  });

  const profile = await prisma.freelancer.findUnique({
    where: {
      freelancer_id: Number(fid),
    },
  });

  const bid = await prisma.bidding.findUnique({
    where: {
      bidding_id: Number(bid_id),
    },
    include: {
      bidding_project: {
        select: {
          project_name: true,
        },
      },
    },
  });

  return {
    props: {
      data: {
        profile,
        user,
        bid: JSON.parse(JSON.stringify(bid)),
        token: access_token,
      },
    },
  };
};

BidPage.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};
