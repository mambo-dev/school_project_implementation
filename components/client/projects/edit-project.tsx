import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Error } from "../../../types/types";
import ErrorMessage from "../../extras/error";
import Success from "../../extras/success";
import useForm from "../../hooks/form";
import Button from "../../utils/button";
import TextInput from "../../utils/input";

type Props = {
  project: any;
  token: string;
};

export default function EditProject({ project, token }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const initialState = {
    name: project.project_name,
    description: project.project_desc,
    date: project.project_date,
    cost: project.project_cost,
  };
  const router = useRouter();
  function handleUpdateProject() {
    setLoading(true);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_URL}/api/project/update-project/${project.project_id}`,
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
        setErrors([]);
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
    handleUpdateProject
  );
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[400px] flex-col flex items-center gap-y-3"
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
        <Button text="update project" type="submit" loading={loading} />
      </div>
      <Success message="successfully updated project" success={success} />
      <ErrorMessage errors={errors} />
    </form>
  );
}
