import Image from "next/image";
import React from "react";

export default function Freelancer({ children }: any) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className=" w-full py-2 px-2 bg-white h-16 shadow flex justify-between items-center">
        <div className="h-full w-36 ">
          <Image
            src="/images/logo-bgless.png"
            className="w-full h-3/4 object-cover"
            alt="logo"
            fill
            sizes=""
          />
        </div>
      </header>
      {children}
    </div>
  );
}
