package com.saadbaig.fullstackbackend.repository;

import com.saadbaig.fullstackbackend.model.Appointment;
import com.saadbaig.fullstackbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(User customer);
    List<Appointment> findByEmployee(User employee);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);
    List<Appointment> findByCustomerAndAppointmentDateBetween(User customer, LocalDateTime start, LocalDateTime end);
}