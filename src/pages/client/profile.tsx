import { GetServerSideProps } from "next";
import React, { ReactElement, useState } from "react";
import Client from "../../../components/layout/client";
import Profile from "../../../components/shared/profile";
import jwt_decode from "jwt-decode";
import { DecodedToken, Error } from "../../../types/types";
import prisma from "../../../lib/prisma";
import axios from "axios";
import { useRouter } from "next/router";

type Data = {
  profile: any | null;
  user: any | null;
  token: string | null;
};

type ProfilePage = {
  data: Data;
};
export default function ProfilePage({ data }: ProfilePage) {
  const { profile, token, user } = data;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  function createClientProfile(values: any) {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/profile/create-client`,
        {
          ...values,
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
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrors([
          {
            message: "something unexpected happened try again later",
          },
        ]);
      });
  }
  return (
    <div className="w-full h-full flex  flex-col md:flex-row">
      <Profile
        hasProfile={profile}
        createProfile={createClientProfile}
        error={errors}
        loading={loading}
        success={success}
        token={token}
        type="client"
        user={user}
      />
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

  let user = await prisma.login.findUnique({
    where: {
      Login_id: decodedToken.user_id,
    },
  });

  const profile = await prisma.client.findUnique({
    where: {
      client_login_id: decodedToken.user_id,
    },
  });

  return {
    props: {
      data: {
        profile,
        user,
        token: access_token,
      },
    },
  };
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};
