import { GetServerSideProps } from "next";
import React, { ReactElement, useState } from "react";
import CreateProject from "../../../components/client/projects/create-project";
import Client from "../../../components/layout/client";
import Button from "../../../components/utils/button";
import SidePanel from "../../../components/utils/side-panel";
import { DecodedToken } from "../../../types/types";
import jwt_decode from "jwt-decode";
import prisma from "../../../lib/prisma";
import GetProjects from "../../../components/client/projects/get-projects";
import {
  Bidding,
  Client as ClientType,
  Completed_projects_review,
  Freelancer,
  Project,
  Role,
} from "@prisma/client";

export default function Home({ data }: any) {
  const { token, projects, user } = data;

  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-full flex items-center flex-col">
      <div className="w-full flex items-center justify-end py-3 px-1">
        <div className="w-28">
          <Button text="new project" onClick={() => setOpen(true)} />
          <SidePanel
            open={open}
            setOpen={setOpen}
            title="create project"
            span={true}
          >
            <CreateProject token={token} />
          </SidePanel>
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-2 px-2">
        <div className="w-full md:w-[40%] mb-auto flex gap-y-2 flex-col">
          <h3 className="leading-6 font-semibold text-slate-800 text-xl">
            {" "}
            My Projects
          </h3>
          <p className="text-sm mt-1 text-slate-600 ">
            a list of all projects you created since you joined us
          </p>
        </div>
        {projects && projects?.length <= 0 ? (
          <div className="w-full flex items-center justify-center">
            {" "}
            <div className="w-64 border border-slate-300 shadow rounded py-2 px-1 text-slate-600 font-medium flex flex-col gap-y-2  ">
              <p>you currently dont have projects start adding</p>
              <div className="w-fit m-auto">
                <Button text="new project" onClick={() => setOpen(true)} />
              </div>
            </div>{" "}
          </div>
        ) : (
          <GetProjects token={token} projects={projects} user={user} />
        )}
      </div>
    </div>
  );
}

type Data = {
  projects: (Project & {
    project_bids: (Bidding & {
      bidding_Freelancer: Freelancer | null;
    })[];
    project_client: ClientType | null;
    project_review: Completed_projects_review | null;
  })[];
  token: string;
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

  const decodedToken: DecodedToken = jwt_decode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

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

  if (user?.Login_role !== "client") {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const projects = await prisma.project.findMany({
    where: {
      project_client: {
        client_login_id: decodedToken.user_id,
      },
    },
    orderBy: {
      project_date: "asc",
    },
    include: {
      project_client: true,
      project_bids: {
        include: {
          bidding_Freelancer: true,
        },
      },
      project_review: true,
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
  return <Client>{page}</Client>;
};
