import { Role } from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Projects from "../../../components/freelancer/projects/projects";
import SearchProjects from "../../../components/freelancer/projects/search-projects";
import Freelancer from "../../../components/layout/freelancer";
import Tabs from "../../../components/utils/tabs";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

export default function Home({ data }: any) {
  const { projects, token, user } = data;

  const tabs = {
    all: {
      component: <Projects projects={projects} token={token} user={user} />,
    },
    search: {
      component: <SearchProjects token={token} user={user} />,
    },
  };

  return (
    <div className="w-full flex items-center justify-center py-10 px-2 ">
      <div className="w-full md:w-3/4 m-auto">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}

type Data = {
  projects: any[] | null;
  token: string | null;
  user: {
    Login_username: string;
    Login_role: Role;
  } | null;
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

  const projects = await prisma.project.findMany({
    orderBy: {
      project_cost: "desc",
    },
    include: {
      project_client: true,
      project_bids: true,
    },
  });

  const user = await prisma.login.findUnique({
    where: {
      Login_id: decodedToken.user_id,
    },
    select: {
      Login_username: true,
      Login_password: false,
      Login_role: true,
    },
  });

  return {
    props: {
      data: {
        projects: JSON.parse(JSON.stringify(projects)),
        token: access_token,
        user,
      },
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Freelancer>{page}</Freelancer>;
};
