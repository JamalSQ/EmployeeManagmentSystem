package com.saadbaig.fullstackbackend.service;

import com.saadbaig.fullstackbackend.model.Task;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserService userService;
    
    public Task createTask(Task task, Long createdById, Long assignedToId) {
        User createdBy = userService.getUserById(createdById);
        User assignedTo = userService.getUserById(assignedToId);
        
        task.setCreatedBy(createdBy);
        task.setAssignedTo(assignedTo);
        task.setStatus("PENDING");
        
        return taskRepository.save(task);
    }
    
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }
    
    public Task updateTask(Task updatedTask, Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setDueDate(updatedTask.getDueDate());
                    task.setStatus(updatedTask.getStatus());
                    
                    if (updatedTask.getAssignedTo() != null) {
                        task.setAssignedTo(updatedTask.getAssignedTo());
                    }
                    
                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }
    
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id " + id);
        }
        taskRepository.deleteById(id);
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public List<Task> getTasksByAssignedTo(Long userId) {
        User user = userService.getUserById(userId);
        return taskRepository.findByAssignedTo(user);
    }
    
    public List<Task> getTasksByCreatedBy(Long userId) {
        User user = userService.getUserById(userId);
        return taskRepository.findByCreatedBy(user);
    }
    
    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }
    
    public List<Task> getTasksByDateRange(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDueDateBetween(start, end);
    }
}