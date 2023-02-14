import React from "react";

type Props = {
  project: any;
};

export default function FullProject({ project }: Props) {
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
    </div>
  );
}
