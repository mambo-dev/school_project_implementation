import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Error } from "../../../types/types";
import ErrorMessage from "../../extras/error";
import Success from "../../extras/success";

type Props = {
  project: any;
  token: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteProject({ project, token, setIsOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  const handleDelete = () => {
    setLoading(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_URL}/api/project/delete-project/${project.project_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        setSuccess(true);
        router.reload();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrors([
          {
            message: "unexpected error occured",
          },
        ]);
        setTimeout(() => {
          setErrors([]);
        }, 3000);
      });
  };
  return (
    <div className="flex flex-col mt-1 gap-y-4">
      <div className="text-red-500 font-medium">
        <p>Are you sure?</p>{" "}
      </div>
      <div className="text-sm text-slate-400">
        <p>This will be deleted permanently and cannot be restored</p>{" "}
      </div>
      <div className="text-sm text-slate-400 flex items-center justify-end gap-x-2 font-semibold">
        <button
          onClick={handleDelete}
          className="bg-red-500 border border-red-400 text-white rounded py-2 px-4 focus:ring-1 ring-offset-1 focus:ring-red-600 "
        >
          {loading ? "loading..." : "delete"}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className=" bg-transparent border border-slate-400 rounded py-2 px-4 text-slate-700   "
        >
          cancel
        </button>
      </div>
      <ErrorMessage errors={errors} />
      <Success message="succesfully deleted" success={success} />
    </div>
  );
}
