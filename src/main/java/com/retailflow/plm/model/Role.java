package com.retailflow.plm.model;

import jakarta.persistence.*;

/**
 * Entity representing user roles within the system.
 * Examples: ROLE_ADMIN, ROLE_USER, ROLE_DESIGNER, ROLE_APPROVER, ROLE_BUYER
 */
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., ROLE_ADMIN, ROLE_USER, ROLE_DESIGNER, ROLE_APPROVER, ROLE_BUYER

    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Role{" +
               "id=" + id +
               ", name='" + name + '\'' +
               '}';
    }
}
