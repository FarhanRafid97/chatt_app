import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

interface loginProps {}

const Login: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
  const { error } = useRouter().query;

  if (error) {
    toast.error('🦄 Invalid Username Or Password', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
    <>
      <div className="w-screen h-screen justify-center items-center flex">
        <div className="flex flex-col gap-y-4 gap-y-4 sm:w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6">
          <h3>Login</h3>
          <form
            method="post"
            className=""
            action="/api/auth/callback/credentials"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col">
                <label htmlFor="email-input">Email</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Type here"
                  id="email-input"
                  required
                  className="input mt-1 input-bordered input-warning "
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password-input">Password</label>
                <input
                  placeholder="Type here"
                  type="password"
                  name="password"
                  required
                  id="password-input"
                  className="input mt-1 input-bordered input-warning "
                />
              </div>

              <button type="submit" className={`btn btn-primary mt-4`}>
                Login
              </button>
            </div>
          </form>
          <Link href="/register" passHref>
            <button type="submit" className={`btn btn-primary mt-4`}>
              Dont Have Account?
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
