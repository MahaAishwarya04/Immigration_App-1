package com.aishwarya.immigration.repository;

import com.aishwarya.immigration.model.Deadline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
    List<Deadline> findByImmigrationCaseIdOrderByDueDateAsc(Long caseId);
}
