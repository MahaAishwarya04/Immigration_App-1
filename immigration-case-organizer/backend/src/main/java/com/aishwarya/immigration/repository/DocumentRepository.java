package com.aishwarya.immigration.repository;

import com.aishwarya.immigration.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByImmigrationCaseId(Long caseId);
}
