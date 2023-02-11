import React from "react";
import { Error } from "./types";

type ErrorProps = {
  errors: Error[];
};

export default function ErrorMessage({ errors }: ErrorProps) {
  return (
    <p
      className={`${
        errors.length < 0 && "hidden"
      } font-bold text-sm text-red-500 m-auto mt-2`}
    >
      {errors.map((error: Error, index: number) => error.message)}
    </p>
  );
}
