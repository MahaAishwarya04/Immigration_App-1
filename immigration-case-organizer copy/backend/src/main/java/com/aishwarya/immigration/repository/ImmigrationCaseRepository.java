package com.aishwarya.immigration.repository;

import com.aishwarya.immigration.model.ImmigrationCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImmigrationCaseRepository extends JpaRepository<ImmigrationCase, Long> {}
