import { type } from "os";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Loading from "../extras/loading";

type ButtonType = {
  text: string;
  type?: any;
  onClick?: () => void;
  loading?: boolean;
  AdditionalHtml?: any;
};

export default function Button({
  text,
  type,
  onClick,
  loading,
  AdditionalHtml,
}: ButtonType) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-2 px-2 rounded inline-flex items-center justify-center gap-x-2 bg-teal-500 text-white focus:bg-teal-600 focus:ring-2 ring-offset-0 ring-teal-400 "
    >
      {loading && <Loading />}
      {text}
    </button>
  );
}
