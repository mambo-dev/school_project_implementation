import { GetServerSideProps } from "next";
import React from "react";

export default function Home() {
  return <div>Home</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
