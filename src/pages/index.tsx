import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
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
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header
        className={`${
          isFixed ? "fixed" : ""
        } transition-all ease-in-out w-full py-2 px-2 bg-white h-14 shadow flex justify-between items-center`}
      >
        <div className="h-full w-36 ">
          <img
            src="/images/logo-bgless.png"
            className="w-full h-3/4 object-cover"
            alt="logo"
          />
        </div>
        <nav className="h-full flex justify-between gap-x-4 px-1">
          <Link href="/auth/login">
            <button className=" inline-flex items-center justify-center shadow bg-transparent border rounded border-gray-300 focus:shadow-md focus:shadow-gray-300 p-2 w-28 ">
              Login
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="inline-flex items-center justify-center shadow shadow-teal-500 bg-teal-600 rounded  text-gray-100  focus:shadow-md focus:shadow-teal-400 p-2 w-28 ">
              Sign up
            </button>
          </Link>
        </nav>
      </header>
      <main className="w-full h-screen  md:h-[500px] flex items-center  bg-gradient-to-r from-gray-300 to-gray-200   ">
        <div className="w-full h-full relative">
          <img
            src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="banner"
            className=" object-cover h-full w-full "
          />
          <div className="w-full absolute   bg-gradient-to-r from-gray-300 via-gray-200   right-3/4 top-0 left-0  bottom-0 h-full flex flex-col items-start justify-center ">
            <div className="w-full md:w-1/2 h-full px-2 py-20 flex flex-col gap-y-4">
              <h1 className="text-teal-800 font-bold text-5xl">
                Welcome to Hiresume
              </h1>
              <p className="text-gray-900 font-medium text-xl">
                Hiresume is a freelance marketplace that connects businesses and
                individuals with talented freelancers from around the world. On
                Hiresume, you can browse and apply for a wide range of jobs in
                various industries, or hire freelancers for your own projects.
              </p>
              <div className="w-full flex items-center gap-x-4 justify-start h-20 ">
                <button className=" inline-flex items-center justify-center shadow bg-transparent border rounded border-gray-800 focus:shadow-md focus:shadow-gray-300 p-2 w-48 ">
                  Hire talent
                </button>
                <button className=" inline-flex items-center justify-center shadow text-gray-100 shadow-teal-500 bg-teal-600 rounded focus:shadow-md focus:shadow-teal-400 p-2  w-48 ">
                  find job
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="w-full  h-screen md:h-[600px] pt-5 md:pt-14 px-2 md:px-28 gap-y-4 flex flex-col-reverse md:flex-row gap-x-4 ">
        <div className=" w-full md:w-1/2 h-full flex flex-col items-start gap-y-4">
          <h2 className="font-bold text-teal-800 text-3xl">
            About the platform
          </h2>
          <p className="text-xl font-medium text-gray-800">
            The platform is easy to use and offers a variety of tools and
            resources to help you find the perfect match for your needs. Whether
            you&apos;re a business owner looking to hire skilled professionals
            for your team, or a freelancer seeking new opportunities, Hiresume
            is the perfect platform for connecting with like-minded individuals
            and organizations.
          </p>
        </div>
        <div className=" relative w-full md:w-1/2 h-3/4 ">
          <img
            src="https://images.unsplash.com/photo-1552960504-34e1e1be3f53?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="banner"
            className=" rounded shadow object-cover h-full w-full "
          />
        </div>
      </div>
      <div className="w-full h-screen md:h-[600px] pt-5 md:pt-0 px-2 md:px-28 gap-y-4 flex flex-col md:flex-row gap-x-4 ">
        <div className="w-full md:w-1/2 h-3/4 ">
          <img
            src="https://images.unsplash.com/photo-1557425529-b1ae9c141e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="banner"
            className=" rounded shadow object-cover h-full w-full "
          />
        </div>
        <div className="w-full md:w-1/2  h-full  flex flex-col items-start gap-y-8">
          <h2 className="font-bold text-teal-800 text-3xl">
            For the Freelancers
          </h2>
          <p className="text-xl font-medium text-gray-800">
            Are you a talented and skilled freelancer looking for new
            opportunities to showcase your talents and skills? Look no further
            than Hiresume! Our freelance marketplace is designed to connect
            businesses and individuals with top-notch freelancers from around
            the world. With a wide range of job opportunities in various
            industries, Hiresume is the perfect platform for finding your next
            gig.
          </p>
        </div>
      </div>
      <div className="w-full h-screen md:h-[600px] mb-2 md:mb-0 pt-8 md:pt-0 px-2 md:px-28 gap-y-4 flex flex-col-reverse md:flex-row  gap-x-4 ">
        <div className="w-full md:w-1/2  h-full flex flex-col items-start gap-y-4">
          <h2 className="font-bold text-teal-800 text-3xl">For the clients</h2>
          <p className="text-xl font-medium text-gray-800">
            Are you a business owner or manager looking to hire talented and
            skilled freelancers for your team? Look no further than Hiresume!
            Our freelance marketplace is designed to connect you with top-notch
            professionals from around the world. With a wide range of
            freelancers available in various industries, you&apos;re sure to
            find the perfect match for your project needs.
          </p>
        </div>
        <div className="relative w-full md:w-1/2  h-3/4 ">
          <img
            src="https://images.unsplash.com/photo-1552960504-34e1e1be3f53?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="banner"
            className=" rounded shadow object-cover h-full w-full "
          />
        </div>
      </div>
    </>
  );
}
