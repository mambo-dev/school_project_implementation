import axios from "axios";
import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/debounce";
import Project from "../../shared/project";

export default function SearchProjects({ token, user }: any) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const debouncedSearch = useDebounce(query, 500);
  useEffect(() => {
    if (debouncedSearch) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_URL}/api/project/search-project/search?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setProjects(response.data.data);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [debouncedSearch, query, token]);
  return (
    <>
      <div className="w-full flex relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full flex-1 relative py-2 px-1 rounded  border focus:border-1 border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-teal-200 focus:shadow-sm focus:shadow-teal-200  focus:ring-teal-100 "
        />
        <div className="bg-transparent  rounded bg-teal-200 absolute top-0 bottom-0 right-0 px-6 text-teal-600 flex items-center justify-center rounded-r">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>
      {query.length > 0 && (
        <div className=" w-full  m-auto grid grid-cols-1 gap-3 py-2 h-full ">
          {projects?.map((project: any, index: number) => (
            <Project token={token} key={index} project={project} user={user} />
          ))}
        </div>
      )}
    </>
  );
}
