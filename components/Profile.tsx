import { useAuth } from '../context/authContext';
import Image from 'next/image';
import { UserType } from './Contact';
import { CgProfile } from 'react-icons/cg';
import { AiFillSound } from 'react-icons/ai';
interface ProfileProps {
  indexCurrentChat: UserType;
}

const Profile: React.FC<ProfileProps> = ({ indexCurrentChat }) => {
  const { state } = useAuth();
  return (
    <div className="p-4">
      <div className="w-full p-4 flex flex-col items-center gap-y-2 ">
        <Image
          height={60}
          width={60}
          className="rounded-full mt-5"
          alt="logo"
          src="/profile-pict.jpeg"
        />
        <p>{indexCurrentChat?.name}</p>
        <p>{indexCurrentChat?.email}</p>
      </div>
      <div className="w-full p-4 flex justify-center gap-x-9">
        <div className="flex flex-col items-center">
          <div className="p-2 bg-white text-black rounded-full text-lg w-[35px]">
            <CgProfile />
          </div>
          <p className="text-sm mt-2">Profile</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2  bg-white text-black rounded-full text-lg w-[35px]">
            <AiFillSound />
          </div>
          <p className="text-sm mt-2">Mute</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 bg-white text-black rounded-full text-lg w-[35px]">
            <CgProfile />
          </div>
          <p className="text-sm mt-2">Mute</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
