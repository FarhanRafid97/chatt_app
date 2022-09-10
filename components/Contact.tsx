import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/authContext';

//triggerd deploy
export interface ContactProps {
  friendlist: {
    id: number | null;
    email: string;
    name: string;
  }[];
  contact?: {
    id: number | null;
    email: string;
    name: string;
  } | null;
  setIndexCurrentChat: Dispatch<SetStateAction<UserType>>;
  setOpenFriend: Dispatch<SetStateAction<boolean>>;
}
export type UserType = {
  id: number | null;
  email: string;
  name: string;
} | null;

const Contact: React.FC<ContactProps> = ({
  setOpenFriend,
  friendlist,
  setIndexCurrentChat,
}) => {
  const [currentChat, setCurrentChat] = useState<ContactProps['contact']>({
    id: null,
    email: '',
    name: '',
  });

  const [search, setSearch] = useState('');
  const getCurrentUser = (user: UserType) => {
    setIndexCurrentChat((prev) => (prev?.id === user?.id ? null : user));
    setCurrentChat((prev) => (prev?.id === user?.id ? null : user));
    setOpenFriend(false);
  };

  const { state } = useAuth();
  return (
    <div>
      <div className=" flex  flex-col  ">
        <div className="mb-4 flex items-center">
          <h3>{state.name} </h3>
          <button
            className="btn ml-auto bg-red-600 hover:bg-red-800"
            onClick={() => signOut()}
          >
            <FiLogOut />
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search User"
          className="input input-bordered input-warning w-full "
        />
      </div>
      <div className="flex flex-col gap-y-4 mt-4 max-h-[600px] overflow-auto">
        {friendlist
          .filter((friend) => {
            if (search.length < 2) {
              return friend;
            } else {
              return friend.name.includes(search);
            }
          })
          .map((friend) => (
            <div
              key={friend.id}
              className={`flex  items-center  gap-x-4 p-2 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-orange-600 ${
                currentChat?.id === friend.id ? 'bg-orange-600' : 'bg-primary'
              }`}
              onClick={(e) => getCurrentUser(friend)}
            >
              <div className="flexitems-center">
                <Image
                  height={60}
                  width={60}
                  className="rounded-full"
                  alt="logo"
                  src="/profile-pict.jpeg"
                />
              </div>
              <div>
                <h3 className="text-black">{friend.name}</h3>
              </div>
            </div>
          ))}
        <div></div>
      </div>
    </div>
  );
};

export default Contact;
