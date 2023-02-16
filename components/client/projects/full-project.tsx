import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  project: any;
};

export default function FullProject({ project }: Props) {
  console.log(project);
  return (
    <div className="w-full flex flex-col ">
      <span className="flex py-2 text-slate-600 font-medium">
        <span className="text-slate-900 font-semibold">name: </span>{" "}
        {project.project_name}
      </span>
      <span className="flex py-2 text-slate-600 font-medium ">
        <span className="text-slate-900 font-semibold">description: </span>{" "}
        {project.project_desc}
      </span>
      <span className="flex flex-col  py-2 text-slate-600 font-medium gap-x-2 ">
        <span className="text-slate-900 font-semibold">bids: </span>{" "}
        <ul>
          {project.project_bids.map((bids: any, index: number) => {
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
                  <span>{bids.bidding_Freelancer.freelancer_full_name}</span>
                </span>

                <Link
                  href={`/project/bid-freelancer/${bids.bidding_Freelancer.freelancer_id}?bid_id=${bids.bidding_id}`}
                >
                  <button className="w-fit text-blue-500 hover:text-blue-600">
                    <ArrowUpRightIcon className="w-7 h-7" />
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </span>
    </div>
  );
}
