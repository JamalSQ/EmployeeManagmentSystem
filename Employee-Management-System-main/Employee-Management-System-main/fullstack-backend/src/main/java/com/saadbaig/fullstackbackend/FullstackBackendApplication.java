package com.saadbaig.fullstackbackend;

import com.saadbaig.fullstackbackend.model.Auth;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.AuthRepository;
import com.saadbaig.fullstackbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FullstackBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullstackBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner init(AuthRepository authRepository, UserRepository userRepository) {
        return args -> {
            // Check if admin exists, if not create it
            if (!authRepository.existsByUsername("admin")) {
                System.out.println("Creating admin user...");
                
                Auth auth = new Auth();
                auth.setUsername("admin");
                auth.setPassword("admin123");
                auth.setRole("ADMIN");
                authRepository.save(auth);
                
                User user = new User();
                user.setUsername("admin");
                user.setName("Administrator");
                user.setEmail("admin@example.com");
                user.setPassword("admin123");
                user.setRole("ADMIN");
                userRepository.save(user);
                
                System.out.println("Admin user created successfully");
            }
        };
    }
}