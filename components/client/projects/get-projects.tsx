import React from "react";
import Button from "../../utils/button";

type ProjectsProps = {
  projects: any[];
};

export default function GetProjects({ projects }: ProjectsProps) {
  console.log(projects);
  return (
    <div className="overflow-x-auto w-full rounded shadow border border-slate-300">
      <table className="w-full h-full  ">
        <thead className="text-slate-800 py-10 bg-slate-100  h-14">
          <tr className=" text-left">
            <th scope="col" className="px-2">
              name
            </th>
            <th scope="col" className="">
              desription
            </th>
            <th scope="col" className="">
              date
            </th>
            <th scope="col" className="">
              cost
            </th>
            <th scope="col" className="">
              actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => {
            return (
              <tr
                className="text-slate-700  border-b border-slate-200 text-left"
                key={index}
              >
                <th
                  scope="row"
                  className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {project.project_name}
                </th>
                <td className=" py-4 ">
                  {" "}
                  {truncate(project.project_desc, 40)}{" "}
                </td>
                <td className=" py-4">{project.project_cost} ksh </td>
                <td className=" py-4"> {project.project_date}</td>
                <td className=" py-4 flex gap-x-2 ">
                  <Button text="edit" />
                  <Button text="delete" />
                  <Button text="expand" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}
