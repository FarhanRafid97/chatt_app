import axios from 'axios';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { url } from '../axios/api';
import { signIn } from 'next-auth/react';
interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/auth/register`, {
        email,
        password,
        name,
      });
      if (data) {
        await signIn('credentials', { email, password, callbackUrl: '/' });
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.response.data.msg);
      toast.error(`🦄 ${error.response.data.msg}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-screen h-screen justify-center items-center flex">
        <div className="flex flex-col gap-y-4 gap-y-4 sm:w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6">
          <h3>Register</h3>
          <form method="post" onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col">
                <label htmlFor="email-input">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Farhan"
                  id="email-input"
                  className="input mt-1 input-bordered input-warning "
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email-input">Email</label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  id="email-input"
                  className="input mt-1 input-bordered input-warning "
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password-input">Password</label>
                <input
                  placeholder="******"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="password-input"
                  className="input mt-1 input-bordered input-warning "
                />
              </div>

              <button type="submit" className={`btn btn-primary mt-4`}>
                Register
              </button>
            </div>
          </form>
          <Link href="/login" passHref>
            <button type="submit" className={`btn btn-primary mt-4`}>
              Alredy Have Account?
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
