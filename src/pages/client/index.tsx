import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Client from "../../../components/layout/client";

export default function Home() {
  return <div>Home</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Client>{page}</Client>;
};
