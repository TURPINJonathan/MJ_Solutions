package com.mj_solutions.api.file.repository;

import com.mj_solutions.api.file.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {
    boolean existsByFilename(String filename);
}