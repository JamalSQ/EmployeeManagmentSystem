package com.saadbaig.fullstackbackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Feedback {
    
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private Integer rating; // 1-5 rating
    
    @Column(length = 1000)
    private String comment;
    
    private LocalDateTime submittedAt;
    
    // Constructors, getters, setters
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}