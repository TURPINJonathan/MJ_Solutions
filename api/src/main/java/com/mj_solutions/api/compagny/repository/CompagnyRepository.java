package com.mj_solutions.api.compagny.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.compagny.entity.Compagny;

public interface CompagnyRepository extends JpaRepository<Compagny, Long> {
	
}
