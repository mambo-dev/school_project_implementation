import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ErrorMessage from "../../../components/extras/error";
import Loading from "../../../components/extras/loading";
import Success from "../../../components/extras/success";
import useForm from "../../../components/hooks/form";
import Button from "../../../components/utils/button";
import TextInput from "../../../components/utils/input";
import Radio from "../../../components/utils/radio";

type SignUpInitial = {
  role: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  function signUp(values: SignUpInitial) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);

    console.log(values);
    setTimeout(() => {
      setSuccess(false);
      setLoading(false);
    }, 3000);
  }

  const initialValues: SignUpInitial = {
    role: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const { handleChange, values, handleSubmit } = useForm(initialValues, signUp);
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

      <div className=" w-full px-2 md:px-5  lg:w-1/2 h-screen   py-2 md:py-14   lg:px-10 flex  flex-col items-center  gap-y-2">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-teal-800 text-3xl font-semibold">
            Join us at Hiresume
          </h1>
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
          <TextInput
            handleChange={handleChange}
            label="confirm password"
            name="confirmPassword"
            value={values.confirmPassword}
            type="password"
          />
          <div className="flex flex-col py-1 gap-y-2 ">
            <p className="text-gray-700 font-bold">Join us as </p>
            <div className="flex gap-x-2 ">
              <Radio
                handleChange={handleChange}
                checked={values.role === "client"}
                value="client"
                label="client"
                name="role"
              />
              <Radio
                handleChange={handleChange}
                checked={values.role === "freelancer"}
                value="freelancer"
                label="freelancer"
                name="role"
              />
            </div>
          </div>
          {loading ? (
            <Button text="loading..." type="submit" loading={true} />
          ) : (
            <Button text="sign up" type="submit" />
          )}

          <div className="flex mt-2 flex-col text-blue-500 text-xs w-fit ml-auto font-semibold">
            <Link href="/auth/login">
              <p className="hover:underline">already a member? log in.</p>
            </Link>
          </div>
        </form>
        <Success
          success={success}
          message="successfully created user, logging in ..."
        />
        <ErrorMessage errors={errors} />
      </div>
    </div>
  );
}
