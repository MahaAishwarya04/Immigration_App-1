package com.aishwarya.immigration.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "immigration_cases")
public class ImmigrationCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String caseName;

    @NotBlank
    private String visaCategory;

    private String receiptNumber;
    private LocalDate filingDate;

    @Enumerated(EnumType.STRING)
    private CaseStatus status = CaseStatus.PLANNING;

    @OneToMany(mappedBy = "immigrationCase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "immigrationCase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deadline> deadlines = new ArrayList<>();

    public Long getId() { return id; }
    public String getCaseName() { return caseName; }
    public void setCaseName(String caseName) { this.caseName = caseName; }
    public String getVisaCategory() { return visaCategory; }
    public void setVisaCategory(String visaCategory) { this.visaCategory = visaCategory; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }
    public CaseStatus getStatus() { return status; }
    public void setStatus(CaseStatus status) { this.status = status; }
    public List<Document> getDocuments() { return documents; }
    public List<Deadline> getDeadlines() { return deadlines; }
}
