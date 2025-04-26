package com.saadbaig.fullstackbackend.service;

import com.saadbaig.fullstackbackend.model.Feedback;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserService userService;
    
    public Feedback createFeedback(Feedback feedback, Long userId) {
        User user = userService.getUserById(userId);
        feedback.setUser(user);
        return feedbackRepository.save(feedback);
    }
    
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id " + id));
    }
    
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
    
    public List<Feedback> getFeedbackByUser(Long userId) {
        User user = userService.getUserById(userId);
        return feedbackRepository.findByUser(user);
    }
    
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback not found with id " + id);
        }
        feedbackRepository.deleteById(id);
    }
}