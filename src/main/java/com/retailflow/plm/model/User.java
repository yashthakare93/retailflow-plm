package com.retailflow.plm.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;
import java.time.LocalDateTime;

/**
 * Represents a user in the system.
 * Mapped to the 'users' table in the database.
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * Primary key for the User entity.
     * Auto-generated using the identity strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique username of the user.
     * Cannot be null.
     */
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * Encrypted password of the user.
     * Cannot be null.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Unique email address of the user.
     * Cannot be null.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Many-to-Many relationship with the Role entity.
     * Stored in a join table named 'user_roles'.
     * Eagerly fetched to immediately load roles with the user.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    /**
     * Timestamp of when the user was created.
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Timestamp of the last update to the user's data.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Lifecycle callback that sets the creation and update timestamps
     * before the entity is persisted for the first time.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Lifecycle callback that updates the 'updatedAt' timestamp
     * before the entity is updated.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors

    public User() {}

    /**
     * Constructor to initialize a user with basic details.
     *
     * @param username the username
     * @param password the encoded password
     * @param email    the user's email address
     */
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Adds a role to the user's role set.
     *
     * @param role the role to be added
     */
    public void addRole(Role role) {
        this.roles.add(role);
    }

    /**
     * Returns a string representation of the User object.
     */
    @Override
    public String toString() {
        return "User{" +
               "id=" + id +
               ", username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", roles=" + roles +
               '}';
    }
}
