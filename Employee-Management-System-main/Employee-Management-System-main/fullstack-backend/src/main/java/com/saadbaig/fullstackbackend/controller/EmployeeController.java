package com.saadbaig.fullstackbackend.controller;

import com.saadbaig.fullstackbackend.model.Appointment;
import com.saadbaig.fullstackbackend.model.Document;
import com.saadbaig.fullstackbackend.model.Task;
import com.saadbaig.fullstackbackend.service.AppointmentService;
import com.saadbaig.fullstackbackend.service.DocumentService;
import com.saadbaig.fullstackbackend.service.TaskService;
import com.saadbaig.fullstackbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private TaskService taskService;
    
    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private UserService userService;
    
    // Task management
    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task, 
                           @RequestParam Long createdById, 
                           @RequestParam Long assignedToId) {
        return taskService.createTask(task, createdById, assignedToId);
    }
    
    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @GetMapping("/tasks/assigned/{userId}")
    public List<Task> getTasksByAssignedTo(@PathVariable Long userId) {
        return taskService.getTasksByAssignedTo(userId);
    }
    
    @GetMapping("/tasks/created/{userId}")
    public List<Task> getTasksByCreatedBy(@PathVariable Long userId) {
        return taskService.getTasksByCreatedBy(userId);
    }
    
    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }
    
    @PutMapping("/tasks/{id}")
    public Task updateTask(@RequestBody Task task, @PathVariable Long id) {
        return taskService.updateTask(task, id);
    }
    
    @GetMapping("/calendar/{userId}")
    public Map<String, Object> getUserCalendar(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);
        
        List<Task> tasks = taskService.getTasksByAssignedTo(userId);
        List<Appointment> appointments = appointmentService.getAppointmentsByEmployee(userId);
        
        Map<String, Object> calendar = new HashMap<>();
        calendar.put("tasks", tasks);
        calendar.put("appointments", appointments);
        
        return calendar;
    }
    
    // Document management
    @PostMapping("/documents")
    public Document createDocument(@RequestBody Document document,
                                @RequestParam Long createdById,
                                @RequestParam(required = false) Long assignedToId) {
        return documentService.createDocument(document, createdById, assignedToId);
    }
    
    @GetMapping("/documents")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }
    
    @GetMapping("/documents/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }
    
    @PutMapping("/documents/{id}")
    public Document updateDocument(@RequestBody Document document, @PathVariable Long id) {
        return documentService.updateDocument(document, id);
    }
    
    @PostMapping("/documents/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam("fileName") String fileName) {
        try {
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Save the file
            Path filePath = Paths.get(uploadDir, fileName);
            Files.write(filePath, file.getBytes());

            // Create document record
            Document document = new Document();
            document.setDocumentType(documentType);
            document.setFileName(fileName);
            document.setFilePath(filePath.toString());
            document.setCreatedAt(new Date());

            // Save to database
            documentService.save(document);

            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "File uploaded successfully",
                "document", document
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to upload file: " + e.getMessage()
            ));
        }
    }
    
    // Appointment management
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    
    @GetMapping("/appointments/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }
    
    @PutMapping("/appointments/{id}")
    public Appointment updateAppointment(@RequestBody Appointment appointment, @PathVariable Long id) {
        return appointmentService.updateAppointment(appointment, id);
    }
}