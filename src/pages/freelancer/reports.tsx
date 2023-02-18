import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Accepted_bids, Bidding, Login, Project } from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ReportProjects from "../../../components/client/reports/projects";
import ReportFreelancerProjects from "../../../components/freelancer/reports/freelancer-reports";
import Client from "../../../components/layout/client";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";
import { ReportNav } from "../client/reports";

type Props = {
  data: Data;
};

export default function FreelancerReports({ data }: Props) {
  const [page, setPage] = useState("projects");
  const { bids, user, token } = data;

  const reports: ReportNav[] = [
    {
      name: "projects",
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
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
          {page === "projects" && <ReportFreelancerProjects user={user} />}
        </div>
      </div>
    </div>
  );
}

type Data = {
  bids: (Bidding & {
    bidding_project:
      | (Project & {
          project_bids: {
            bidding_accepted_bids: Accepted_bids[];
          }[];
        })
      | null;
  })[];
  user: Login | null;
  token: string | null;
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

  let bids = await prisma.bidding.findMany({
    where: {
      bidding_Freelancer: {
        freelancer_login: {
          Login_id: user?.Login_id,
        },
      },
    },
    include: {
      bidding_project: {
        include: {
          project_bids: {
            select: {
              bidding_accepted_bids: true,
              bidding_project_id: false,
            },
          },
        },
      },
    },
  });

  return {
    props: {
      data: {
        user,

        bids: JSON.parse(JSON.stringify(bids)),
        token: access_token,
      },
    },
  };
};

FreelancerReports.getLayout = function getLayout(page: React.ReactElement) {
  return <Client>{page}</Client>;
};
