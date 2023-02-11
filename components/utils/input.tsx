import React, { ChangeEvent } from "react";

type Input = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  value: string | number;
  label: string;
  type: string;
  textArea?: boolean;
  name: string;
};

export default function TextInput({
  handleChange,
  value,
  label,
  type,
  textArea,
  name,
}: Input) {
  if (textArea) {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm text-teal-900 font-bold">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className="py-2 px-1 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:border-teal-200 focus:shadow-sm focus:shadow-teal-200  focus:ring-teal-100 "
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm text-teal-900 font-bold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className="py-2 px-1 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:border-teal-200 focus:shadow-sm focus:shadow-teal-200  focus:ring-teal-100 "
      />
    </div>
  );
}
