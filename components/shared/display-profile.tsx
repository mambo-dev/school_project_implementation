import React, { useState } from "react";
import Button from "../utils/button";
import SidePanel from "../utils/side-panel";
import UpdateProfile from "./update-profile";

type Display = {
  profile: any;
  type: string;
  user: any;
  token: string | null;
};
export default function DisplayProfile({
  profile,
  type,
  token,
  user,
}: Display) {
  const [open, setOpen] = useState(false);
  function transform(profile: any, type: string) {
    let transformed;
    if (type === "client") {
      transformed = {
        id: profile.client_id,
        full_name: profile.client_full_name,
        email: profile.client_email,
        mobile: profile.client_mobile,
        description: profile.client_desc,
        location: profile.client_location,
      };
    } else {
      transformed = {
        id: profile.freelancer_id,
        full_name: profile.freelancer_full_name,
        email: profile.freelancer_email,
        mobile: profile.freelancer_mobile,
        description: profile.freelancer_desc,
        location: profile.freelancer_location,
      };
    }

    return transformed;
  }
  const display_profile_data = transform(profile, type);

  return (
    <div
      className={`flex-1 relative w-full  ${
        user.Login_role === "freelancer" && "md:w-[70%] "
      }   bg-white mb-auto shadow rounded border border-slate-300 flex flex-col `}
    >
      <div className="px-2 py-5 sm:px-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            user information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details.
          </p>
        </div>
        {user.Login_role === "freelancer" && (
          <div className="w-20">
            <Button text="update" onClick={() => setOpen(true)} />
            <SidePanel open={open} title="update profile" setOpen={setOpen}>
              <UpdateProfile
                profile={display_profile_data}
                type={type}
                token={token}
              />
            </SidePanel>
          </div>
        )}
      </div>
      <div className="border-t border-slate-300">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {display_profile_data.full_name}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {display_profile_data.email}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">phone number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {display_profile_data.mobile}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">location</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {display_profile_data.location}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {display_profile_data.description}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
