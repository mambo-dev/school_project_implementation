import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ErrorMessage from "../../../components/extras/error";
import Success from "../../../components/extras/success";
import useForm from "../../../components/hooks/form";
import Button from "../../../components/utils/button";
import TextInput from "../../../components/utils/input";
import axios from "axios";
import { Error } from "../../../types/types";

type LoginInitial = {
  username: string;
  password: string;
};

export default function Login() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  function Login(values: LoginInitial) {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, {
        username: values.username,
        password: values.password,
      })
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
            data.role === "client"
              ? router.push("/client/profile")
              : router.push("/freelancer/profile");
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors([
          {
            message: "unexpected error while loggin in",
          },
        ]);
      });
  }

  const initialValues: LoginInitial = {
    username: "",
    password: "",
  };

  const { handleChange, values, handleSubmit } = useForm(initialValues, Login);
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-1/2 relative h-screen hidden md:flex  ">
        <Image
          className="w-full h-full  rounded-tr-2xl "
          src="/images/auth-banner.jpg"
          fill
          sizes=""
          alt="auth banner"
        />
      </div>
      <div className=" w-full px-2 md:px-5  py-48 lg:w-1/2 h-screen  md:py-40  lg:px-10 flex  flex-col items-center justify-center gap-y-2">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-teal-800 text-3xl font-semibold">Welcome back</h1>
        </div>
        <form className="w-full flex gap-y-2 flex-col" onSubmit={handleSubmit}>
          <TextInput
            handleChange={handleChange}
            label="username"
            name="username"
            value={values.username}
            type="text"
          />
          <TextInput
            handleChange={handleChange}
            label="password"
            name="password"
            value={values.password}
            type="password"
          />

          {loading ? (
            <Button text="loading..." type="submit" loading={true} />
          ) : (
            <Button text="log in" type="submit" />
          )}

          <div className="flex mt-2 flex-col text-blue-500 text-xs w-fit ml-auto font-semibold">
            <Link href="/auth/signup">
              <p className="hover:underline">not a member? sign up.</p>
            </Link>
          </div>
        </form>
        <Success
          success={success}
          message="succesfully logged in, redirecting..."
        />
        <ErrorMessage errors={errors} />
      </div>
    </div>
  );
}
