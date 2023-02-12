import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/auth";

export default function MenuOptions({ profileLink, navLinks }: any) {
  const { logout } = useAuth();
  return (
    <div className="   text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-12 h-12 justify-center rounded-full">
            <span className="relative w-12 h-12 rounded-full bg-white  border border-slate-300">
              <Image
                src="/images/avatar.png"
                alt="profile image"
                fill
                sizes=""
                className="rounded-full "
              />
            </span>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link href={`${profileLink}`}>
                    <button
                      className={`${
                        active ? "bg-teal-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded px-2 py-2 text-sm`}
                    >
                      profile
                    </button>
                  </Link>
                )}
              </Menu.Item>
              <div className="flex md:hidden flex-col">
                {navLinks.map((link: any, index: number) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <Link href={`${link.link}`}>
                          <button
                            className={`${
                              active
                                ? "bg-teal-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded px-2 py-2 text-sm`}
                          >
                            {link.name}
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? "bg-teal-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded px-2 py-2 text-sm`}
                  >
                    logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
