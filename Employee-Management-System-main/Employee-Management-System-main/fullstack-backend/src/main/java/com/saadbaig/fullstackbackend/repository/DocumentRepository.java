package com.saadbaig.fullstackbackend.repository;

import com.saadbaig.fullstackbackend.model.Document;
import com.saadbaig.fullstackbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCreatedBy(User createdBy);
    List<Document> findByAssignedTo(User assignedTo);
    List<Document> findByStatus(String status);
    List<Document> findByEmployeeId(Long employeeId);
}