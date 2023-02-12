import React, { useState } from "react";
import { countries } from "../extras/countries";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Select from "../utils/select";

type Update = {
  profile: any;
  type: string;
  submitAxios: (values: any) => void;
};
export default function UpdateProfile({ profile, type, submitAxios }: Update) {
  const [loading, setLoading] = useState(false);
  const initialState = {
    firstName: profile.full_name.split(" ")[0],
    secondName: profile.full_name.split(" ")[1],
    email: profile.email,
    mobile: profile.mobile,
    description: profile.description,
    location: profile.location,
  }; //profile.full_name,
  const { values, handleChange, handleSubmit } = useForm(
    initialState,
    submitAxios
  );
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 relative w-full   mb-auto  flex flex-col gap-y-4 "
    >
      <div className="w-full px-2 py-2 flex items-center justify-center flex-col gap-y-4 h-3/4 ">
        <div className="w-full grid grid-cols-1 gap-y-4 ">
          <TextInput
            label="First name"
            handleChange={handleChange}
            value={values.firstName}
            name="firstName"
            type="text"
          />
          <TextInput
            label="Second name"
            handleChange={handleChange}
            value={values.secondName}
            name="secondName"
            type="text"
          />
        </div>
        <div className="w-full grid grid-cols-1 gap-y-4">
          <TextInput
            label="email"
            handleChange={handleChange}
            value={values.email}
            name="email"
            type="email"
            className="md:col-span-2"
          />
          <TextInput
            label="phone number"
            handleChange={handleChange}
            value={values.mobile}
            name="mobile"
            type="tel"
            className="md:col-span-1"
          />
        </div>
        <Select
          options={countries}
          label="location"
          handleChange={handleChange}
          value={values.location}
          name="location"
        />
        <div className="w-full">
          <TextInput
            label="description"
            handleChange={handleChange}
            value={values.description}
            name="description"
            type=""
            textArea={true}
            className="md:col-span-3"
          />
        </div>
      </div>
      <div className="w-full   py-2 bg-slate-50  px-4 h-1/4">
        <div className="w-20 ml-auto">
          <Button text="update" type="submit" loading={loading} />
        </div>
      </div>
    </form>
  );
}
