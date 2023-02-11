import { GetServerSideProps } from "next";
import React from "react";

export default function Profile() {
  return <div>Profile</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
