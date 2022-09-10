import NextAuth from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: {
      accessToken: string;
    };
  }
}
declare module 'next-auth/user' {
  interface User {
    /** This is an example. You can find me in types/next-auth.d.ts */

    accessToken: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
    };
  }
}
