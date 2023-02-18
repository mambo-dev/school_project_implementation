import {
  BuildingOfficeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Accepted_bids,
  Bidding,
  Client as ClientType,
  Login,
  Project,
  Role,
} from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ReportBids from "../../../components/client/reports/bids";
import Bids from "../../../components/client/reports/bids";
import ReportProjects from "../../../components/client/reports/projects";

import Client from "../../../components/layout/client";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export type ReportNav = {
  name: string;
  icon: any;
};

export default function Reports({ data }: Props) {
  const [page, setPage] = useState("projects");
  const { bids, projects, token, user } = data;
  console.log(projects);
  const reports: ReportNav[] = [
    {
      name: "projects",
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
    },
    {
      name: "accepted bids",
      icon: <CheckCircleIcon className="w-4 h-4" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 px-4 py-10 gap-2">
      <div className="mb-auto col-span-6 md:col-span-1 ">
        <ul className="border border-slate-300 gap-y-2 text-teal-700 font-medium rounded shadow gap-x-2 py-2 flex flex-row items-center justify-between px-2 md:flex-col ">
          {reports.map((report: ReportNav, index: number) => {
            return (
              <button
                onClick={() => setPage(report.name)}
                key={index}
                className={`focus:bg-slate-100  focus:text-teal-500 w-1/2 gap-x-2 md:w-full py-2 px-1 rounded hover:text-teal-500 hover:bg-slate-100 inline-flex items-center justify-center md:justify-start `}
              >
                {report.icon}
                {report.name}
              </button>
            );
          })}
        </ul>
      </div>
      <div className="mb-auto col-span-6 md:col-span-5 ">
        <div className="shadow rounded border border-slate-100">
          {page === "projects" ? (
            <ReportProjects clientProjects={projects} user={user} />
          ) : (
            <ReportBids acceptedBids={bids} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

type Data = {
  reports: any[];
  user: {
    Login_id: number;
    Login_username: string;
    Login_role: Role;
  } | null;
  token: string | null;
  projects: Project[];
  bids: {
    accepted_id: number;
    accepted_date: Date;
    accepted_desc: string;
    accepted_freelance_price: number;
    accepted_by: ClientType | null;
    accepted_bidding:
      | (Bidding & {
          bidding_project: Project | null;
        })
      | null;
  }[];
};
//@ts-ignore
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

  let user = await prisma.login.findUnique({
    where: {
      Login_id: decodedToken.user_id,
    },
    select: {
      Login_id: true,
      Login_username: true,
      Login_role: true,
      Login_password: false,
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

  let projects = await prisma.project.findMany({
    where: {
      project_client: {
        client_login: {
          Login_id: user?.Login_id,
        },
      },
    },
    select: {
      project_cost: true,
      project_date: true,
      project_id: true,
      project_desc: true,
      project_name: true,
      project_client_id: false,
    },
  });
  let bids = await prisma.accepted_bids.findMany({
    where: {
      accepted_by: {
        client_login: {
          Login_id: user?.Login_id,
        },
      },
    },
    select: {
      accepted_id: true,
      accepted_date: true,
      accepted_desc: true,
      accepted_freelance_price: true,
      accepted_bidding_id: false,
      accepted_by_id: false,
      accepted_bidding: {
        include: {
          bidding_project: true,
        },
      },
      accepted_by: true,
    },
  });

  return {
    props: {
      data: {
        user,
        projects: JSON.parse(JSON.stringify(projects)),
        bids: JSON.parse(JSON.stringify(bids)),
        token: access_token,
      },
    },
  };
};

Reports.getLayout = function getLayout(page: React.ReactElement) {
  return <Client>{page}</Client>;
};
