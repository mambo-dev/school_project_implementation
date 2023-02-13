import React from "react";

type Props = {
  project: any;
  token: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteProject({ project, token, setIsOpen }: Props) {
  return (
    <div className="flex flex-col mt-1 gap-y-4">
      <div className="text-red-500 font-medium">
        <p>Are you sure?</p>{" "}
      </div>
      <div className="text-sm text-slate-400">
        <p>This will be deleted permanently and cannot be restored</p>{" "}
      </div>
      <div className="text-sm text-slate-400 flex items-center justify-end gap-x-2 font-semibold">
        <button className="bg-red-500 border border-red-400 text-white rounded py-2 px-4 focus:ring-1 ring-offset-1 focus:ring-red-600 ">
          delete
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className=" bg-transparent border border-slate-400 rounded py-2 px-4 text-slate-700   "
        >
          cancel
        </button>
      </div>
    </div>
  );
}
