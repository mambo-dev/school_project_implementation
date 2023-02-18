import { Role } from "@prisma/client";
import React from "react";
import ProjectDiv from "../../shared/project";

type Props = {
  projects: any;
  token: string;
  user: {
    Login_username: string;
    Login_role: Role;
  } | null;
};

export default function Projects({ projects, token, user }: Props) {
  return (
    <div className="w-full flex flex-col gap-y-2 ">
      {projects.map((project: any, index: number) => (
        <ProjectDiv token={token} key={index} project={project} user={user} />
      ))}
    </div>
  );
}
