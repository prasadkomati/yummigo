// src/pages/Chat.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ConversationList from '../components/ConversationList';
import MessageBox from '../components/MessageBox';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
    const { auth } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [currentConvo, setCurrentConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await API.get('/api/conversations/my');
                setConversations(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConversations();
    }, []);

    const fetchMessages = async (convoId) => {
        try {
            const res = await API.get(`/api/conversations/${convoId}/messages`);
            setMessages(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectConvo = (convo) => {
        setCurrentConvo(convo);
        fetchMessages(convo._id);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await API.post('/api/conversations/send', {
                conversationId: currentConvo._id,
                content: newMessage,
            });
            setNewMessage('');
            fetchMessages(currentConvo._id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="my-4">
            <Row>
                <Col md={4}>
                    <h5>Conversations</h5>
                    <ConversationList
                        conversations={conversations}
                        currentConvo={currentConvo}
                        onSelect={handleSelectConvo}
                    />
                </Col>
                <Col md={8}>
                    {currentConvo ? (
                        <>
                            <h5>
                                Chat with{' '}
                                {currentConvo.participants.find((p) => p._id !== auth.user._id)?.name || 'Unknown'}
                            </h5>
                            <MessageBox messages={messages} currentUserId={auth.user._id} />
                            <Form className="d-flex mt-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Type a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button variant="primary" className="ms-2" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <p>Select a conversation to start chatting.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
