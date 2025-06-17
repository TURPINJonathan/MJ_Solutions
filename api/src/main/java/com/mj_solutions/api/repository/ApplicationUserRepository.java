package com.mj_solutions.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.model.ApplicationUser;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
	Optional<ApplicationUser> findByEmail(String email);
}
