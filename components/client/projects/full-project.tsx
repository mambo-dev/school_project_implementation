import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import {
  Bidding,
  Client,
  Completed_projects_review,
  Freelancer,
  Project,
  Role,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Loading from "../../extras/loading";

type Props = {
  project: Project & {
    project_bids: (Bidding & {
      bidding_Freelancer: Freelancer | null;
    })[];
    project_client: Client | null;
    project_review: Completed_projects_review | null;
  };
  user: {
    Login_username: string;
    Login_role: Role;
  } | null;
};

export default function FullProject({ project, user }: Props) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>();
  return (
    <div className="w-full flex flex-col  ">
      <Link href={`/client/review/${project.project_id}`}>
        <span className="text-blue-400 hover:underline ml-auto w-fit  absolute top-6 right-2 bottom-0">
          review
        </span>
      </Link>

      <span className="flex py-2 text-slate-600 font-medium">
        <span className="text-slate-900 font-semibold">name: </span>{" "}
        {project.project_name}
      </span>
      <span className="flex py-2 text-slate-600 font-medium ">
        <span className="text-slate-900 font-semibold">description: </span>{" "}
        {project.project_desc}
      </span>
      {user?.Login_role === "client" && (
        <span className="flex flex-col  py-2 text-slate-600 font-medium gap-x-2 ">
          <span className="text-slate-900 font-semibold">bids: </span>{" "}
          <ul className="flex flex-col gap-y-3">
            {project.project_bids.map(
              (
                bids: Bidding & {
                  bidding_Freelancer: Freelancer | null;
                },
                index: number
              ) => {
                return (
                  <li
                    key={index}
                    className="w-full flex items-center justify-between border border-slate-300 shadow rounded py-2 px-1 pr-2"
                  >
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
                      <span>
                        {bids.bidding_Freelancer?.freelancer_full_name}
                      </span>
                    </span>

                    <Link
                      href={`/project/bid-freelancer/${bids.bidding_Freelancer_id}?bid_id=${bids.bidding_id}`}
                    >
                      <button
                        onClick={() => {
                          setLoading(true);
                          setSelected(bids.bidding_id);
                        }}
                        className="w-fit text-blue-500 hover:text-blue-600"
                      >
                        {loading ? (
                          bids.bidding_id === selected ? (
                            <Loading borderColor="border-blue-500" />
                          ) : (
                            <ArrowUpRightIcon className="w-7 h-7" />
                          )
                        ) : (
                          <ArrowUpRightIcon className="w-7 h-7" />
                        )}
                      </button>
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </span>
      )}
    </div>
  );
}
