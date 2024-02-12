import React, { useCallback, useEffect, useState } from 'react'
import { UseSocket } from './Context/Socket';
import { useNavigate } from 'react-router-dom';


export const Screen = () => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const socket = UseSocket();
    console.log(socket);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        socket.emit('room:join', { email, room })
    }, [email, room, socket])

    // setup naviagte here to jump to the page ................hetre
    const navigate = useNavigate();
    // handle backend join member ......................here

    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data
        console.log(email, room);
        navigate(`/room/${room}`,{state:email})
    }, [navigate]);


    useEffect(() => {
        socket.on('room:join', handleJoinRoom)
        return () => {
            socket.off('room:join', handleJoinRoom)
        }


    }, [socket, handleJoinRoom])

    return (
        <div>
            <h2>Home Screen

            </h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='Email'>Email</label>
                <input type='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label htmlFor='Room'>Room Number</label>
                <input type='text' placeholder='Where you want to join' value={room} onChange={(e) => setRoom(e.target.value)} />
                <br />
                <button>Join</button>
            </form>
        </div>
    )
}
