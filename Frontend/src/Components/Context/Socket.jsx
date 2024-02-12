import React, { useContext, useMemo } from 'react';
import {io} from 'socket.io-client'
import { createContext } from 'react';
const SocketContext=createContext(null);


export const UseSocket=()=>{
    const socket= useContext(SocketContext);
    return(
        socket
    )
};


export const SocketP = (props) => {

  
  
    const socketMemo=useMemo(()=>io('localhost:80'),[])
  return (

    
    <SocketContext.Provider value={socketMemo}>
    {props.children}
    </SocketContext.Provider>
  )
}
