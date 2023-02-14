import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import React from "react";
import { truncate } from "../client/projects/get-projects";
import Button from "../utils/button";

type Props = {
  project: any;
};

export default function Project({ project }: Props) {
  console.log(project);
  return (
    <div className="w-full shadow rounded border border-slate-300 py-2 px-1 text-slate-800 flex gap-y-2 flex-col">
      <div className="flex items-center justify-between ">
        <h3 className="font-medium first-letter:uppercase">
          {project.project_name}
        </h3>
        <span className="border  border-slate-300 bg-gray-100 rounded-full py-1 px-2  text-slate-900 font-bold text-xs ">
          ${project.project_cost}
        </span>
      </div>
      <div className="flex items-center justify-between ">
        <h4 className="first-letter:uppercase">
          {truncate(project.project_desc, 40)}{" "}
        </h4>
        <span className="py-1 px-2  text-slate-900 text-sm font-medium ">
          {project.project_date}
        </span>
      </div>
      <div className="flex items-center justify-between ">
        <h4 className="">
          <strong>posted by;</strong> {project.project_client.client_email}
        </h4>
        <span className="py-1 px-2  text-slate-900 text-sm font-medium ">
          <strong>total bids</strong> 0
        </span>
      </div>
      <div className="flex items-center justify-end gap-x-2 ">
        <div className="w-24">
          <button className="w-full py-2 px-2 rounded inline-flex items-center justify-center gap-x-2 bg-teal-400 text-white focus:bg-teal-500 focus:ring-1 ring-offset-1 ring-teal-400 ">
            bid
          </button>
        </div>
        <div className="w-fit px-1">
          <button className="w-fit py-2 px-3 rounded inline-flex items-center justify-center gap-x-2 bg-transparent text-slate-700 focus:border focus:border-slate-500 focus:bg-slate-100 focus:ring-1 ring-offset-0 ring-slate-200 font-medium">
            <EllipsisVerticalIcon className="w-5 h-5 font-semibold" />
          </button>
        </div>
      </div>
    </div>
  );
}
