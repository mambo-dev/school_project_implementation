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
  project_id: number;
  token: string;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Bid({ project_id, setClose, token }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  const handleBid = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/project/bid/send-bid`,
        {
          ...values,
          date: new Date(values.date),
          price: Number(values.price),
          project_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        router.reload();
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
        setTimeout(() => {
          setErrors([]);
        }, 3000);
      });
  };
  const initialState = {
    date: "",
    description: "",
    price: "",
  };

  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    handleBid
  );
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
      <TextInput
        handleChange={handleChange}
        name="date"
        type="date"
        label="date bidding"
        value={values.date}
      />
      <TextInput
        handleChange={handleChange}
        name="description"
        type="text"
        label="bid description"
        value={values.description}
        textArea
      />
      <TextInput
        handleChange={handleChange}
        name="price"
        type="number"
        label="my price"
        value={values.price}
      />
      <div className="flex items-center justify-end gap-x-2 mt-3">
        <div className="w-24">
          {" "}
          <Button type="submit" text="send" loading={loading} />
        </div>
        <Button
          type="button"
          onClick={() => setClose(false)}
          text="cancel"
          cancel={true}
        />
      </div>
      <ErrorMessage errors={errors} />
      <Success message="succesfully sent bid" success={success} />
    </form>
  );
}
