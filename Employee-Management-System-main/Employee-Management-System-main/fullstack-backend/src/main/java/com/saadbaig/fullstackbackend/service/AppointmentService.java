package com.saadbaig.fullstackbackend.service;

import com.saadbaig.fullstackbackend.model.Appointment;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserService userService;
    
    public Appointment createAppointment(Appointment appointment, Long customerId, Long employeeId) {
        User customer = userService.getUserById(customerId);
        User employee = userService.getUserById(employeeId);
        
        appointment.setCustomer(customer);
        appointment.setEmployee(employee);
        appointment.setStatus("SCHEDULED");
        
        return appointmentRepository.save(appointment);
    }
    
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }
    
    public Appointment updateAppointment(Appointment updatedAppointment, Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
                    appointment.setServiceType(updatedAppointment.getServiceType());
                    appointment.setStatus(updatedAppointment.getStatus());
                    appointment.setNotes(updatedAppointment.getNotes());
                    appointment.setTreatmentDetails(updatedAppointment.getTreatmentDetails());
                    
                    if (updatedAppointment.getEmployee() != null) {
                        appointment.setEmployee(updatedAppointment.getEmployee());
                    }
                    
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }
    
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id " + id);
        }
        appointmentRepository.deleteById(id);
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public List<Appointment> getAppointmentsByCustomer(Long customerId) {
        User customer = userService.getUserById(customerId);
        return appointmentRepository.findByCustomer(customer);
    }
    
    public List<Appointment> getAppointmentsByEmployee(Long employeeId) {
        User employee = userService.getUserById(employeeId);
        return appointmentRepository.findByEmployee(employee);
    }
    
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }
    
    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }
    
    public List<Appointment> getAppointmentsByCustomerAndDateRange(Long customerId, LocalDateTime start, LocalDateTime end) {
        User customer = userService.getUserById(customerId);
        return appointmentRepository.findByCustomerAndAppointmentDateBetween(customer, start, end);
    }
}