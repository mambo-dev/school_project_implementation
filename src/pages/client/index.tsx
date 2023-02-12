import { GetServerSideProps } from "next";
import React, { ReactElement, useState } from "react";
import CreateProject from "../../../components/client/projects/create-project";
import Client from "../../../components/layout/client";
import Button from "../../../components/utils/button";
import SidePanel from "../../../components/utils/side-panel";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-full flex items-center flex-col">
      <div className="w-full flex items-center justify-end py-3 px-1">
        <div className="w-28">
          <Button text="new project" onClick={() => setOpen(true)} />
          <SidePanel open={open} setOpen={setOpen} title="create project">
            <CreateProject />
          </SidePanel>
        </div>
      </div>
      {/*create job*/}
      {/*table*/}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};
