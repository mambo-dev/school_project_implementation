import React, { ReactElement } from "react";
import Client from "../layout/client";
import TextInput from "../utils/input";
import CreateProfile from "./create-profile";
import DisplayProfile from "./display-profile";

type CreateProfile = {
  createProfile: (values: any) => void;
  hasProfile: boolean;
};

export default function Profile({ createProfile, hasProfile }: CreateProfile) {
  const initialState = {
    firstName: "",
    secondName: "",
    email: "",
    mobile: "",
    description: "",
    location: "",
  };

  return (
    <div className="flex flex-col gap-y-2 px-2 md:flex-row w-full min-h-screen items-center md:px-10 py-10">
      <div className="w-full md:w-[30%] mb-auto">
        <h3 className="leading-6 font-semibold text-slate-800 text-xl">
          {" "}
          Personal Information
        </h3>
        <p className="text-sm mt-1 text-slate-600 ">
          use your main email address to make communication with users easier
        </p>
      </div>
      {hasProfile ? (
        <DisplayProfile />
      ) : (
        <CreateProfile
          initialState={initialState}
          submitAxios={createProfile}
        />
      )}
    </div>
  );
}