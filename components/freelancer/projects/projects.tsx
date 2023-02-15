import React from "react";
import Project from "../../shared/project";

type Props = {
  projects: any;
  token: string;
};

export default function Projects({ projects, token }: Props) {
  return (
    <div className="w-full flex flex-col gap-y-2 ">
      {projects.map((project: any, index: number) => (
        <Project token={token} key={index} project={project} />
      ))}
    </div>
  );
}
