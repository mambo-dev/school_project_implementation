import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Freelancer from "../../../components/layout/freelancer";

export default function Home() {
  return <div>index</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Freelancer>{page}</Freelancer>;
};
