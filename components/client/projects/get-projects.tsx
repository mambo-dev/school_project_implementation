import { Role } from "@prisma/client";
import React, { useState } from "react";
import { addCommas } from "../../../src/pages/client/bids";
import Button from "../../utils/button";
import Modal from "../../utils/modal";
import DeleteProject from "./delete-project";
import EditProject from "./edit-project";
import FullProject from "./full-project";

type ProjectsProps = {
  projects: any[];
  token: string;
  user: {
    Login_username: string;
    Login_role: Role;
  } | null;
};

export default function GetProjects({ projects, token, user }: ProjectsProps) {
  const [edit, setEdit] = useState(false);
  const [deleteProject, setDeleteProject] = useState(false);
  const [more, setMore] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({});
  console.log(projects[0].project_review);
  return (
    <div className="overflow-x-auto w-full rounded shadow border border-slate-300">
      <table className="w-full h-full  ">
        <thead className="text-slate-600 py-10 bg-slate-100 border-b border-slate-300 shadow h-14">
          <tr className=" text-left py-2">
            <th scope="col" className="px-2 ">
              name
            </th>
            <th scope="col" className="px-2 ">
              desription
            </th>
            <th scope="col" className="px-2 ">
              date
            </th>
            <th scope="col" className="px-2 ">
              cost
            </th>
            <th scope="col" className="px-2 ">
              status
            </th>
            <th scope="col" className="px-2 ">
              edit
            </th>
            <th scope="col" className="px-2 ">
              delete
            </th>
            <th scope="col" className="px-2">
              expand
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

                <td className=" py-4"> {project.project_date}</td>
                <td className=" py-4">
                  {addCommas(project.project_cost)} ksh{" "}
                </td>
                <td className=" py-4">
                  {project.project_review ? (
                    <span className="border  border-green-300 bg-green-400 rounded-full py-2 px-3  text-white font-bold text-xs ">
                      complete
                    </span>
                  ) : (
                    <span className="border  border-yellow-300 bg-yellow-400 rounded-full py-2 px-3  text-white font-bold text-xs ">
                      on going
                    </span>
                  )}
                </td>
                <td className=" py-4  px-2 ">
                  <Button
                    text="edit"
                    edit
                    onClick={() => {
                      setEdit(true);
                      setCurrentProject(project);
                    }}
                  />
                  <Modal
                    span
                    isOpen={edit}
                    setIsOpen={setEdit}
                    title="edit project"
                  >
                    <EditProject project={project} token={token} />
                  </Modal>
                </td>
                <td className=" py-4  px-2 ">
                  <Button
                    text="delete"
                    deleteBtn
                    onClick={() => {
                      setDeleteProject(true);
                      setCurrentProject(project);
                    }}
                  />
                  <Modal
                    isOpen={deleteProject}
                    setIsOpen={setDeleteProject}
                    title="delete project"
                  >
                    <DeleteProject
                      project={project}
                      token={token}
                      setIsOpen={setDeleteProject}
                    />
                  </Modal>
                </td>
                <td className=" py-4 px-2  ">
                  <Button
                    text="expand"
                    moreBtn
                    onClick={() => {
                      setMore(true);
                      setCurrentProject(project);
                    }}
                  />
                  <Modal
                    isOpen={more}
                    setIsOpen={setMore}
                    title="about project"
                  >
                    <FullProject project={currentProject} user={user} />
                  </Modal>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}
