import React, { useCallback, useEffect, useState } from 'react';
import { UseSocket } from './Context/Socket';
import ReactPlayer from 'react-player';
import Peer from './Peer/Peer';
import VideocamIcon from '@mui/icons-material/Videocam';
import {  useLocation } from 'react-router-dom';


export const Room = (props) => {
    const { state } = useLocation();
    const email= state;
//    /handle camera on off.......................


    const socket = UseSocket();
    const [remoteSocketId, setRemotesocketId] = useState(null);
    // for video strem state ...................here

    const [myStream, setMyStream] = useState()
    // remote stream..............here
    const [remoteStram, setRemoteStram] = useState()

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined the room`);
        setRemotesocketId(id)
    }, []);

    // handle call accepted ...............here
    const sendStream = useCallback(() => {
        for (const track of myStream.getTracks()) {

            Peer.peer.addTrack(track, myStream)
        }

    }, [myStream])
    const handleCallAccepted = useCallback(({ ans, from }) => {
        Peer.setLocalDescription(ans);
        console.log('call accepted')
        sendStream();

    }, [sendStream]);

    const handleIncommingCall = useCallback(async ({ from, offer }) => {
        setRemotesocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);
        console.log(from, offer);
        const ans = await Peer.getAnswer(offer);
        socket.emit('call:aceepted', { to: from, ans })

    }, [socket]);


    const handleNegonedded = useCallback(async () => {
        const offer = await Peer.getOffer();

        socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    });

    const handleNegoIcomming = useCallback(async ({ from, offer }) => {
        const ans = await Peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans });
    }, [socket]);

    const handleNegoFinal = useCallback(async ({ ans }) => {
        Peer.setLocalDescription(ans);
    }, [])

    // use effect to handle all event ................here
    useEffect(() => {
        Peer.peer.addEventListener('negotiationneeded', handleNegonedded);
        return () => {
            Peer.peer.removeEventListener('negotiationneeded', handleNegonedded)
        }
    }, [handleNegonedded])

    // track file.......................track..............................

    useEffect(() => {
        Peer.peer.addEventListener('track', async (ev) => {
            const remote = ev.streams;
            console.log('got tracks')
            setRemoteStram(remote[0])
        })
    }, [])

    useEffect(() => {
        socket.on('user:Joined', handleUserJoined);

        socket.on('incomming:call', handleIncommingCall)
        socket.on('call:aceepted', handleCallAccepted);

        socket.on('peer:nego:needed', handleNegoIcomming);

        socket.on('peer:nego:final', handleNegoFinal);
        return () => {
            socket.off("user:Joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall)
            socket.off('call:aceepted', handleCallAccepted)
            socket.off('peer:nego:needed', handleNegoIcomming);
            socket.off('peer:nego:final', handleNegoFinal);
        }
    }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoFinal, handleNegoIcomming])


    const handlecallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream)
        const offer = await Peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer })

    }, [remoteSocketId, socket]);



    return (
        <div >
            Room


            <h4>{remoteSocketId ? "Connected" : "no one in room"}</h4>
            {myStream && <button onClick={sendStream}>Send Stream</button>}
            {remoteSocketId && <button onClick={handlecallUser}>Call</button>}
            <div className="main">
                {myStream && (
                    <div className='video'>
                        <h2>My Video</h2>
                        
                        <ReactPlayer playing muted width="400px" height="400px" url={myStream} />
                        <VideocamIcon style={{ color: "red", fontSize: "30px" }} /><br/>
                        {email }

                    </div>
                )
                }
                {remoteStram && (
                    <div className='video'>
                        <h2>Remote</h2>
                       
                        <ReactPlayer playing muted width="400px" height="400px" url={remoteStram} />
                        <VideocamIcon style={{ color: "red", fontSize: "30px" }}  />

                    </div>
                )
                }
            </div>


        </div>
    )
}
