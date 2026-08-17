package com.hostel.service;

import com.hostel.dto.AuthResponse;
import com.hostel.dto.LoginRequest;
import com.hostel.model.Student;
import com.hostel.model.User;
import com.hostel.repository.StudentRepository;
import com.hostel.repository.UserRepository;
import com.hostel.security.JwtUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse authenticate(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userOpt.get();

        // Plaintext / simple comparison suitable for university project demo
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        Long studentId = null;
        if ("STUDENT".equalsIgnoreCase(user.getRole().name())) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                studentId = studentOpt.get().getId();
            }
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                studentId
        );
    }
}
