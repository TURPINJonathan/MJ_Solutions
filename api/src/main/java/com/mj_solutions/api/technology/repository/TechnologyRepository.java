package com.mj_solutions.api.technology.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.technology.entity.Technology;

public interface TechnologyRepository extends JpaRepository<Technology, Long> {
	List<Technology> findAllByDeletedAtIsNull();
}
