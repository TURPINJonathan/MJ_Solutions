package com.mj_solutions.api.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
