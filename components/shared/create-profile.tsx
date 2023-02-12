import React from "react";
import { countries } from "../extras/countries";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Select from "../utils/select";
type Create = {
  initialState: any;
  submitAxios: (values: any) => void;
  loading: boolean;
  setErrors?: () => void;
};

export default function CreateProfile({
  initialState,
  submitAxios,
  loading,
  setErrors,
}: Create) {
  const { values, handleChange, handleSubmit } = useForm(
    initialState,
    submitAxios
  );
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 relative w-full md:w-[70%]  bg-white mb-auto shadow rounded border border-slate-300 flex flex-col gap-y-4 "
    >
      <div className="w-full px-2 py-2 flex items-center justify-center flex-col gap-y-4 h-3/4 ">
        <div className="w-full grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 ">
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
        <div className="w-full grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3">
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
          <Button text="save " type="submit" loading={loading} />
        </div>
      </div>
    </form>
  );
}
