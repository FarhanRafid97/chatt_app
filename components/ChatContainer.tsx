import Image from 'next/image';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiSend } from 'react-icons/fi';
import { Socket } from 'socket.io-client';
import { apiAuth } from '../axios/api';
import { useAuth } from '../context/authContext';
import { UserType } from './Contact';
import { FaUserFriends } from 'react-icons/fa';

interface ChatContainerProps {
  indexCurrentChat: UserType;
  socket: Socket;
  setOpenFriend: Dispatch<SetStateAction<boolean>>;
}
type Message = {
  id?: number;
  fromSelf: boolean;
  message: string;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  socket,
  indexCurrentChat,
  setOpenFriend,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  const { state } = useAuth();
  const [msg, setMsg] = useState('');
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      const { data } = await apiAuth.post('/message/user', {
        toId: indexCurrentChat?.id,
      });
      setMessages(data.msg);
    };
    getMessage();
  }, [state, indexCurrentChat]);

  const handleSendMsg = async (e: FormEvent<HTMLFormElement>, msg: string) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiAuth.post('/message/send', {
        toId: indexCurrentChat?.id,
        message: msg,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    socket.emit('send', {
      to: indexCurrentChat?.id,
      from: state.id,
      msg,
    });

    socket.emit('push-notif', {
      to: indexCurrentChat?.id,
      from: state.id,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    setMsg('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('get-msg', (msg) => {
        console.log('msg masuk', msg);

        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full ">
      <div
        className="flex p-4 shadow-xl w-full items-center justify-between"
        style={{ height: '10%' }}
      >
        <div className="flex  items-center gap-x-4">
          <Image
            height={40}
            width={40}
            className="rounded-full"
            alt="logo"
            src="/profile-pict.jpeg"
          />
          <p>{indexCurrentChat?.name} </p>
        </div>
        <div
          className="cursor-pointer text-xl text-black p-3 bg-gray-200 rounded-xl md:hidden"
          onClick={() => setOpenFriend(true)}
        >
          <FaUserFriends />
        </div>
      </div>

      <div
        className="w-full flex flex-col gap-y-2 p-4 overflow-scroll"
        style={{ height: '80%' }}
      >
        {messages.map((m, i) => (
          <div
            ref={scrollRef}
            key={i}
            className={`text-black flex p-2  ${
              m.fromSelf ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`py-2 px-4 ${
                m.fromSelf ? 'bg-green-300' : 'bg-gray-200'
              } rounded-xl max-w-sm break-all`}
            >
              <p>{m.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="w-full flex items-center  p-4"
        style={{
          borderTop: '1px solid black',
          height: '10%',
        }}
      >
        <form className="flex w-full" onSubmit={(e) => handleSendMsg(e, msg)}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered input-warning w-full mr-4"
            disabled={loading}
          />

          <button
            className={`btn btn-primary ${loading && 'loading'}`}
            type="submit"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
