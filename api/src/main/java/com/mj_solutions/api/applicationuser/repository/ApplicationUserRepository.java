package com.mj_solutions.api.applicationuser.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
	Optional<ApplicationUser> findByEmail(String email);
}
