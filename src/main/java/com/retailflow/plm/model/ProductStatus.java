package com.retailflow.plm.model;

public enum ProductStatus {
    DESIGN("Design Phase"),
    PROTOTYPE("Prototype Development"),
    APPROVED("Approved for Production"),
    PRODUCTION("In Production"),
    MARKET("Available in Market"),
    DISCONTINUED("Discontinued");
    
    private final String description;
    
    ProductStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public ProductStatus getNextStatus() {
        return switch (this) {
            case DESIGN -> PROTOTYPE;
            case PROTOTYPE -> APPROVED;
            case APPROVED -> PRODUCTION;
            case PRODUCTION -> MARKET;
            case DISCONTINUED -> this; // No next status for discontinued
            default -> throw new IllegalArgumentException("Unexpected value: " + this);
        };
    }
}
