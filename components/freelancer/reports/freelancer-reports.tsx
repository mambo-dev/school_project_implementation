import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Login } from "@prisma/client";
import React from "react";
import { exportToExcel } from "../../../utils/excel";
import Table from "../../extras/table";

type Props = {
  user: Login | null;
};

export default function ReportFreelancerProjects({ user }: Props) {
  const downloads: any[] = [];
  let id = 0;
  const projectHeaders = ["name", "description", "date", "cost", "accepted"];
  return (
    <div className="flex flex-col py-2 gap-y-2">
      <div className="w-full px-2">
        <div className="w-24 ml-auto">
          <button
            onClick={() => {
              exportToExcel({
                Dbdata: downloads,
                filename: `${user?.Login_username}-${
                  user?.Login_id
                }${id++}-projects`,
                filetype:
                  "application/vnd.openxmlfromats-officedocument.spreadsheetml.sheet;cahrset=UTF-8",
                fileExtension: ".xlsx",
              });
            }}
            className="w-full px-1 py-2 text-white font-medium inline-flex items-center justify-center rounded shadow bg-teal-400 focus:ring-2 ring-teal-300 hover:ring-1 hover:bg-teal-500 focus:bg-teal-500  ring-offset-1 gap-x-2  "
          >
            <ArrowDownTrayIcon className="w-5 h-5" /> export
          </button>
        </div>
      </div>
      <div className="w-full px-2">
        <Table headers={projectHeaders}>
          {/* {clientProjects.map((project: Project, index: number) => {
        return (
          <tr key={project.project_id} className="border-b">
            <th
              scope="row"
              className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {project.project_name}
            </th>
            <td className="py-4">{truncate(project.project_desc, 40)}</td>
            <td className="py-4">{project.project_date}</td>
            <td className="py-4">
              {" "}
              {addCommas(project.project_cost)} ksh{" "}
            </td>
          </tr>
        );
      })} */}
        </Table>
      </div>
    </div>
  );
}
