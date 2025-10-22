import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username !== process.env.USERNAME ||
          credentials?.password !== process.env.PASSWORD
        ) {
          return null;
        }

        return { id: "user" };
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
});

export { handler as GET, handler as POST };
