package com.saadbaig.fullstackbackend.controller;

import com.saadbaig.fullstackbackend.model.Appointment;
import com.saadbaig.fullstackbackend.model.Feedback;
import com.saadbaig.fullstackbackend.model.Message;
import com.saadbaig.fullstackbackend.service.AppointmentService;
import com.saadbaig.fullstackbackend.service.FeedbackService;
import com.saadbaig.fullstackbackend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private MessageService messageService;
    
    // Appointment booking
    @PostMapping("/appointments")
    public Appointment bookAppointment(@RequestBody Appointment appointment, 
                                      @RequestParam Long customerId,
                                      @RequestParam Long employeeId) {
        return appointmentService.createAppointment(appointment, customerId, employeeId);
    }
    
    @GetMapping("/appointments/history/{customerId}")
    public List<Appointment> getAppointmentHistory(@PathVariable Long customerId) {
        return appointmentService.getAppointmentsByCustomer(customerId);
    }
    
    @GetMapping("/calendar/{customerId}")
    public List<Appointment> getCustomerCalendar(
            @PathVariable Long customerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);
        
        return appointmentService.getAppointmentsByCustomerAndDateRange(customerId, startDateTime, endDateTime);
    }
    
    // Feedback submission
    @PostMapping("/feedback")
    public Feedback submitFeedback(@RequestBody Feedback feedback, @RequestParam Long customerId) {
        return feedbackService.createFeedback(feedback, customerId);
    }
    
    // Message sending
    @PostMapping("/messages")
    public Message sendMessage(@RequestBody Message message, 
                             @RequestParam Long senderId, 
                             @RequestParam Long recipientId) {
        return messageService.sendMessage(message, senderId, recipientId);
    }
    
    @GetMapping("/messages/{customerId}")
    public Map<String, List<Message>> getCustomerMessages(@PathVariable Long customerId) {
        return messageService.getUserMessages(customerId);
    }
}