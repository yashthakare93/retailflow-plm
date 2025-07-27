package com.retailflow.plm.security;

import com.retailflow.plm.model.User;
import com.retailflow.plm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Locates the user based on the username.
     * In the actual implementation, the search for the user can be customized,
     * such as searching in a database or external user directory.
     *
     * @param username the username identifying the user whose data is required.
     * @return a fully populated user record (an instance of UserDetails)
     * @throws UsernameNotFoundException if the user could not be found or has no granted authorities
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Use findByUsername as per UserDetailsService contract and UserRepository definition
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Convert the user's roles to Spring Security GrantedAuthorities
        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(),
                mapRolesToAuthorities(user.getRoles()));
    }

    // Helper method to convert User Roles to GrantedAuthorities
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<com.retailflow.plm.model.Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }
}
