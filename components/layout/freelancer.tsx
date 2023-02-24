import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import MenuOptions from "../utils/menu";

type ClientNav = {
  name: string;
  link: string;
};

const navigation = [
  {
    name: "jobs",
    link: "/freelancer",
  },

  {
    name: "reports",
    link: "/freelancer/reports",
  },
];

export default function Freelancer({ children }: any) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="w-full  min-h-screen flex flex-col">
      <header
        className={` w-full py-2 px-2 bg-white h-16 shadow flex justify-between items-center z-10`}
      >
        <div className="h-full w-36 relative ">
          <Image
            src="/images/logo-bgless.png"
            className="w-full h-3/4 object-cover"
            alt="logo"
            fill
            sizes=""
          />
        </div>

        <nav className="   w-fit px-1 md:flex gap-x-3">
          <ul className=" hidden md:flex gap-x-2 items-center text-slate-600">
            {navigation.map((nav: ClientNav, index: number) => {
              return (
                <Link href={nav.link} key={index}>
                  <li className="hover:underline"> {nav.name} </li>
                </Link>
              );
            })}
          </ul>

          <MenuOptions
            profileLink="/freelancer/profile"
            navLinks={navigation}
          />
        </nav>
      </header>
      {children}
    </div>
  );
}
