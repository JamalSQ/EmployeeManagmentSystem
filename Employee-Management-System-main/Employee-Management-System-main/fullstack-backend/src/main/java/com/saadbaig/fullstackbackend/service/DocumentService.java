package com.saadbaig.fullstackbackend.service;

import com.saadbaig.fullstackbackend.model.Document;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserService userService;
    
    public Document createDocument(Document document, Long createdById, Long assignedToId) {
        User createdBy = userService.getUserById(createdById);
        document.setCreatedBy(createdBy);
        
        if (assignedToId != null) {
            User assignedTo = userService.getUserById(assignedToId);
            document.setAssignedTo(assignedTo);
        }
        
        document.setStatus("DRAFT");
        return documentRepository.save(document);
    }
    
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }
    
    public Document updateDocument(Document updatedDocument, Long id) {
        return documentRepository.findById(id)
                .map(document -> {
                    document.setTitle(updatedDocument.getTitle());
                    document.setDocumentType(updatedDocument.getDocumentType());
                    document.setContent(updatedDocument.getContent());
                    document.setStatus(updatedDocument.getStatus());
                    
                    if (updatedDocument.getAssignedTo() != null) {
                        document.setAssignedTo(updatedDocument.getAssignedTo());
                    }
                    
                    return documentRepository.save(document);
                })
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }
    
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document not found with id " + id);
        }
        documentRepository.deleteById(id);
    }
    
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    
    public List<Document> getDocumentsByCreatedBy(Long userId) {
        User user = userService.getUserById(userId);
        return documentRepository.findByCreatedBy(user);
    }
    
    public List<Document> getDocumentsByAssignedTo(Long userId) {
        User user = userService.getUserById(userId);
        return documentRepository.findByAssignedTo(user);
    }
    
    public List<Document> getDocumentsByStatus(String status) {
        return documentRepository.findByStatus(status);
    }

    public List<Document> getDocumentsByEmployeeId(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId);
    }

    public Document save(Document document) {
        return documentRepository.save(document);
    }

    public void delete(Long id) {
        documentRepository.deleteById(id);
    }
}