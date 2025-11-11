// src/components/MessageBox.js
import React, { useEffect, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';

const MessageBox = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg) => (
                <ListGroup.Item
                    key={msg._id}
                    className={msg.sender._id === currentUserId ? 'text-end bg-primary text-white' : ''}
                >
                    <small>{msg.sender.name}</small>
                    <p>{msg.content}</p>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
        </ListGroup>
    );
};

export default MessageBox;
