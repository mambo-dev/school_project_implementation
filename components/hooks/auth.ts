import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { DecodedToken } from "../../types/types";
import axios from "axios";

export const useAuth = () => {
  const router = useRouter();

  const logout = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/api/auth/logout`, {})
      .then((response) => {
        console.log(response);
        router.replace("/auth/login");
      });
  };

  return { logout };
};
