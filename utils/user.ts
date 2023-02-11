import prisma from "../lib/prisma";

export async function checkUserExists(username: string) {
  const findUser = await prisma.login.findUnique({
    where: {
      Login_username: username,
    },
  });

  if (!findUser) {
    return false;
  }

  return true;
}
