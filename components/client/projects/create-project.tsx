import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Error } from "../../../types/types";
import ErrorMessage from "../../extras/error";
import Success from "../../extras/success";
import useForm from "../../hooks/form";
import Button from "../../utils/button";
import TextInput from "../../utils/input";

export default function CreateProject({ token }: any) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  const initialState = {
    name: "",
    description: "",
    date: "",
    cost: 0,
  };
  function handleCreateProject() {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/project/create-project`,
        {
          ...values,
          cost: Number(values.cost),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        error.response.data.error && error.response.data.error.length > 0
          ? setErrors([...error.response.data.error])
          : setErrors([
              {
                message: "something unexpected happened try again later",
              },
            ]);
      });
  }
  const { values, handleChange, handleSubmit } = useForm(
    initialState,
    handleCreateProject
  );
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex-col flex items-center gap-y-3"
    >
      <TextInput
        handleChange={handleChange}
        label="name"
        type="text"
        value={values.name}
        name="name"
      />
      <TextInput
        handleChange={handleChange}
        label="description"
        type="text"
        value={values.description}
        name="description"
        textArea={true}
      />
      <TextInput
        handleChange={handleChange}
        label="date"
        type="date"
        value={values.date}
        name="date"
      />
      <TextInput
        handleChange={handleChange}
        label="cost"
        type="number"
        value={values.cost}
        name="cost"
      />
      <div className="w-full mt-1">
        <Button text="create project" type="submit" loading={loading} />
      </div>
      <Success message="successfully created project" success={success} />
      <ErrorMessage errors={errors} />
    </form>
  );
}
