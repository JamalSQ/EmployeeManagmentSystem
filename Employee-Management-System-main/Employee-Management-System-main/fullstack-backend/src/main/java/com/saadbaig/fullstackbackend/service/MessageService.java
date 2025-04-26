package com.saadbaig.fullstackbackend.service;

import com.saadbaig.fullstackbackend.model.Message;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserService userService;
    
    public Message sendMessage(Message message, Long senderId, Long recipientId) {
        User sender = userService.getUserById(senderId);
        User recipient = userService.getUserById(recipientId);
        
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setRead(false);
        
        return messageRepository.save(message);
    }
    
    public Message getMessageById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id " + id));
    }
    
    public Message markMessageAsRead(Long id) {
        return messageRepository.findById(id)
                .map(message -> {
                    message.setRead(true);
                    return messageRepository.save(message);
                })
                .orElseThrow(() -> new RuntimeException("Message not found with id " + id));
    }
    
    public void deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new RuntimeException("Message not found with id " + id);
        }
        messageRepository.deleteById(id);
    }
    
    public Map<String, List<Message>> getUserMessages(Long userId) {
        User user = userService.getUserById(userId);
        
        List<Message> sentMessages = messageRepository.findBySender(user);
        List<Message> receivedMessages = messageRepository.findByRecipient(user);
        List<Message> unreadMessages = messageRepository.findByRecipientAndIsRead(user, false);
        
        Map<String, List<Message>> messages = new HashMap<>();
        messages.put("sent", sentMessages);
        messages.put("received", receivedMessages);
        messages.put("unread", unreadMessages);
        
        return messages;
    }
}