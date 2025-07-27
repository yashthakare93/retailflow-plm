package com.retailflow.plm.service;

import com.retailflow.plm.model.Role;
import com.retailflow.plm.model.User;
import com.retailflow.plm.repository.RoleRepository;
import com.retailflow.plm.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerNewUser(String username, String email, String rawPassword, String roleName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword)); // Encode the password

        // Assign role
        Optional<Role> optionalRole = roleRepository.findByName(roleName);
        if (!optionalRole.isPresent()) {
            throw new RuntimeException("Role not found: " + roleName);
        }
        Set<Role> roles = new HashSet<>();
        roles.add(optionalRole.get());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        logger.info("New user registered: {}", savedUser.getUsername());
        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
