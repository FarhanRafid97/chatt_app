import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { url } from '../axios/api';
import ChatContainer from '../components/ChatContainer';
import Contact, { UserType } from '../components/Contact';
import Layout from '../components/Layout';
import Profile from '../components/Profile';
import Welcome from '../components/Welcome';
import { useAuth } from '../context/authContext';
import { authOptions } from './api/auth/[...nextauth]';

//triggerd push
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log('session console log', session);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const { data } = await axios.get(`${url}/user/friendlist`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: session?.user?.accessToken,
    },
  });

  return {
    props: { data },
  };
};

interface HomeProps {
  data: {
    users: {
      id: number | null;
      email: string;
      name: string;
    }[];
  };
}
const socketUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL_SOCKET_PROD
    : process.env.NEXT_PUBLIC_BASE_URL_SOCKET_DEV;
const socket = io(socketUrl);

const Home: React.FC<HomeProps> = ({ data }) => {
  const { state } = useAuth();
  const [openFriend, setOpenFriend] = useState(true);
  const [indexCurrentChat, setIndexCurrentChat] = useState<UserType>(null);

  useEffect(() => {
    if (state) {
      socket.emit('add-user', state.id);
    }
  }, [state]);

  return (
    <Layout>
      <div className="w-screen h-full flex  ">
        <div
          className={`xl:w-3/12 md:w-4/12 p-4 sm:3/12  fixed z-10 sm:relative  h-screen w-full sm:block sm:left-0  ${
            openFriend ? 'left-0' : 'left-[-700px]'
          } `}
          style={{ transition: 'left 0.5s', backgroundColor: '#212121' }}
        >
          <Contact
            setOpenFriend={setOpenFriend}
            friendlist={data.users}
            setIndexCurrentChat={setIndexCurrentChat}
          />
        </div>
        <div
          className="w-full sm:w-9/12 md:w-8/12 xl:w-6/12 flex  "
          style={{ border: '1px solid black' }}
        >
          {indexCurrentChat === null ? (
            <Welcome username={state.name} setOpenFriend={setOpenFriend} />
          ) : (
            <ChatContainer
              setOpenFriend={setOpenFriend}
              socket={socket}
              indexCurrentChat={indexCurrentChat}
            />
          )}
        </div>
        <div className="w-3/12 hidden lg:block">
          {indexCurrentChat === null ? (
            <div className="p-4 justify-center flex">No User</div>
          ) : (
            <Profile indexCurrentChat={indexCurrentChat} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
