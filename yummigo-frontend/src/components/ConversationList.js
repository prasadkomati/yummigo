// src/components/ConversationList.js
import React from 'react';
import { ListGroup } from 'react-bootstrap';

const ConversationList = ({ conversations, currentConvo, onSelect }) => (
    <ListGroup>
        {conversations.map((convo) => (
            <ListGroup.Item
                key={convo._id}
                action
                active={currentConvo?._id === convo._id}
                onClick={() => onSelect(convo)}
            >
                {convo.participants.map((p) => p.name).join(', ')}
            </ListGroup.Item>
        ))}
    </ListGroup>
);

export default ConversationList;
