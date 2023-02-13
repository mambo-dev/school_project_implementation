import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { type } from "os";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Loading from "../extras/loading";

type ButtonType = {
  text: string;
  type?: any;
  onClick?: () => void;
  loading?: boolean;
  AdditionalHtml?: any;
  edit?: boolean;
  deleteBtn?: boolean;
  moreBtn?: boolean;
};

export default function Button({
  text,
  type,
  onClick,
  loading,
  edit,
  deleteBtn,
  moreBtn,
  AdditionalHtml,
}: ButtonType) {
  if (edit) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full py-2 px-2 rounded inline-flex items-center justify-center gap-x-2 bg-transparent text-blue-500 border border-slate-500 focus:bg-blue-100 focus:ring-1 ring-offset-0 ring-slate-200 font-medium"
      >
        <PencilSquareIcon className="w-5 h-5" />
        {text}
      </button>
    );
  }

  if (deleteBtn) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full py-2 px-2 rounded inline-flex items-center justify-center gap-x-2 bg-transparent text-red-500 border border-slate-500 focus:bg-red-100 focus:ring-1 ring-offset-0 ring-slate-200 font-medium"
      >
        <TrashIcon className="w-5 h-5" />
        {text}
      </button>
    );
  }

  if (moreBtn) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-fit py-2 px-3 rounded inline-flex items-center justify-center gap-x-2 bg-transparent text-slate-700 border border-slate-500 focus:bg-slate-100 focus:ring-1 ring-offset-0 ring-slate-200 font-medium"
      >
        <EllipsisVerticalIcon className="w-5 h-5 font-semibold" />
      </button>
    );
  }
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
