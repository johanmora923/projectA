import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import PropTypes from 'prop-types';

const socket = io('http://localhost:3000'); // Cambia la URL según tu configuración

const LiveChat = ({ sender_id }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/contacts?userId=${sender_id}`)
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, [sender_id]);

    useEffect(() => {
        if (selectedUser) {
            socket.emit('join', { sender: sender_id, receiver: selectedUser.id });

            axios.get(`http://localhost:3000/messages?sender=${sender_id}&receiver=${selectedUser.id}`)
                .then(response => {
                    setMessages(response.data);
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });

            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off('message');
            };
        }
    }, [sender_id, selectedUser]);

    const sendMessage = () => {
        const message = {
            sender_id,
            receiver_id: selectedUser.id,
            content: newMessage,
            reply_to: replyTo ? replyTo.id : null,
        };
        axios.post('http://localhost:3000/messages', message)
            .then(() => {
                setNewMessage('');
                setReplyTo(null);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    return (
        <div className='flex w-100% h-[100vh]'>
            <div className='w-[30%] bg-gray-200 p-4'>
                <h2 className='text-black font-bold mb-4'>Contacts</h2>
                <ul>
                    {contacts.map(contact => (
                        <li 
                        key={contact.id} 
                        className='mb-2'
                        >
                            <div
                                className={`flex p-2 rounded-lg ${selectedUser && selectedUser.id === contact.id ? 'bg-blue-500 text-black' : 'bg-gray-300 text-black'}`}
                                onClick={() => setSelectedUser(contact)}
                            >
                                <img src="/pp.jpg" className='w-[34px] h-[34px] rounded-[50%] mr-2'  />
                                <span>{contact.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='w-3/4 bg-gray-100 p-4 rounded-lg shadow-lg'>
                {selectedUser ? (
                    <>
                        <div className='messages overflow-y-auto h-64 mb-4'>
                            {messages.map((msg) => (
                                <div 
                                key={msg.id} 
                                className={`p-2 my-2 w-80  rounded-lg ${msg.sender_id === sender_id ? 'bg-blue-500 text-black' : 'bg-gray-300 text-black'}`}>
                                    {msg.reply_to && (
                                        <div className='text-xs text-gray-500'>
                                            Replying to: {messages.find((m) => m.id === msg.reply_to)?.content}
                                        </div>
                                    )}
                                    <div>{msg.content}</div>
                                    <button className='text-xs text-black' onClick={() => setReplyTo(msg)}>Reply</button>
                                </div>
                            ))}
                        </div>
                        {replyTo && (
                            <div className='text-xs text-gray-500 mb-2'>
                                Replying to: {replyTo.content}
                                <button className='ml-2 text-red-500' onClick={() => setReplyTo(null)}>Cancel</button>
                            </div>
                        )}
                        <input
                            type='text'
                            className='w-full p-2 border rounded-lg mb-2 text-black'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder='Type a message...'
                        />
                        <button className='w-full bg-blue-500 text-white p-2 rounded-lg' onClick={sendMessage}>Send</button>
                    </>
                ) : (
                    <div>Select a contact to start chatting</div>
                )}
            </div>
        </div>
    );
};

LiveChat.propTypes = {
    sender_id: PropTypes.number.isRequired,
};

export default LiveChat;