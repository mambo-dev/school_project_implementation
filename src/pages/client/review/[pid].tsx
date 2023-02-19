import { Login, Project, Role } from "@prisma/client";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ErrorMessage from "../../../../components/extras/error";
import Success from "../../../../components/extras/success";
import useForm from "../../../../components/hooks/form";
import Client from "../../../../components/layout/client";
import Button from "../../../../components/utils/button";
import TextInput from "../../../../components/utils/input";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";

type Props = {
  data: Data;
};
type Data = {
  project: Project | null;
  token: string | null;
  user: {
    Login_username: string;
    Login_role: Role;
  } | null;
};

export default function Review({ data }: Props) {
  const { project, user, token } = data;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  console.log(project);
  const initialState = {
    date: "",
    description: "",
  };
  const submitReview = (values: any) => {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/project/review`,
        {
          ...values,
          project_id: project?.project_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const { data, error } = response.data;

        if (!data) {
          setErrors([...error]);
        } else {
          setSuccess(true);
          setErrors([]);
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrors([
          {
            message: "unexpected error ",
          },
        ]);
      });
  };
  const { values, handleChange, handleSubmit } = useForm(
    initialState,
    submitReview
  );
  return (
    <div className="w-[98%] h-screen flex flex-col gap-y-4  md:w-3/4 m-auto shadow border border-slate-300 py-10 px-1 md:px-2 ">
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-sm font-semibold ">
          project - {project?.project_name}
        </p>
        <p>reviews are done for completed projects </p>
        <p className="text-xs font-semibold ">
          once you review the project is closed and all bids not accepted are
          automatically rejected
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4 ">
        <TextInput
          type="date"
          handleChange={handleChange}
          label="date of review"
          name="date"
          value={values.date}
        />
        <TextInput
          textArea
          type="date"
          handleChange={handleChange}
          label="review comments"
          name="description"
          value={values.description}
        />
        <Button text="submit review" loading={loading} />
      </form>
      <Success message="successfully reviewed and closed" success={success} />
      <ErrorMessage errors={errors} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const { req } = context;

  const access_token = req.cookies.access_token;
  if (!access_token || access_token.trim() === "") {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const decodedToken: DecodedToken = jwtDecode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const user = await prisma.login.findUnique({
    where: {
      Login_id: decodedToken.user_id,
    },
    select: {
      Login_username: true,
      Login_password: false,
      Login_role: true,
    },
  });

  if (user?.Login_role !== "client") {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }
  const { pid } = context.query;

  const project = await prisma.project.findUnique({
    where: {
      project_id: Number(pid),
    },
  });

  return {
    props: {
      data: {
        project: JSON.parse(JSON.stringify(project)),
        token: access_token,
        user,
      },
    },
  };
};

Review.getLayout = function getLayout(page: React.ReactElement) {
  return <Client>{page}</Client>;
};
