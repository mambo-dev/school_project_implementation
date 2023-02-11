import { GetServerSideProps } from "next";
import React from "react";

export default function profile() {
  return <div>profile</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
