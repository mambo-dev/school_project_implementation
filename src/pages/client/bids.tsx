import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Client from "../../../components/layout/client";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

export default function Bid() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const bids = await prisma.accepted_bids.findMany({
    where: {},
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
