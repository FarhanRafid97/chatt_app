import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
interface WelcomeProps {
  username: string;
  setOpenFriend: Dispatch<SetStateAction<boolean>>;
}

const Welcome: React.FC<WelcomeProps> = ({ username, setOpenFriend }) => {
  return (
    <div className="m-auto flex flex-col items-center">
      <Image src="/robot.gif" alt="welcome-png" width={200} height={200} />
      <p>Welcome {username}</p>
      <button
        className="btn btn-primary mt-4 md:hidden"
        onClick={() => setOpenFriend(true)}
      >
        Start Chatting
      </button>
    </div>
  );
};

export default Welcome;
