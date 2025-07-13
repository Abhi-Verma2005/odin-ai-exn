import React from 'react'
import { generateUUID } from "@/lib/utils";
import { Chat } from './components/Chat';


const Popup: React.FC = () => {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}

export default Popup
