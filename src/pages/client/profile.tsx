import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Client from "../../../components/layout/client";
import Profile from "../../../components/shared/profile";
import jwt_decode from "jwt-decode";
import { DecodedToken } from "../../../types/types";
import prisma from "../../../lib/prisma";

type Data = {
  profile: any | null;
  token: string | null;
};
export default function profile({ data }: any) {
  const { profile, token } = data;
  function createClientProfile() {}
  return (
    <div className="w-full h-full flex  flex-col md:flex-row">
      <Profile hasProfile={profile} createProfile={createClientProfile} />
    </div>
  );
}

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

  const decodedToken: DecodedToken = jwt_decode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const profile = await prisma.client.findUnique({
    where: {
      client_login_id: decodedToken.user_id,
    },
  });

  return {
    props: {
      data: {
        profile,
        token: access_token,
      },
    },
  };
};

profile.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};
