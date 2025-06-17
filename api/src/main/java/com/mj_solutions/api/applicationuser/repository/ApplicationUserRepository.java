package com.mj_solutions.api.applicationuser.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.common.enums.Role;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
	Optional<ApplicationUser> findByEmail(String email);

	Optional<ApplicationUser> findByFirstnameAndLastname(String firstname, String lastname);

	Optional<ApplicationUser> findByEmailAndIdNot(String email, Long id);

	Optional<ApplicationUser> findByEmailAndId(String email, Long id);

	Optional<ApplicationUser> findByEmailAndPassword(String email, String password);

	Optional<ApplicationUser> findByFirstname(String firstname);

	Optional<ApplicationUser> findByLastname(String lastname);

	List<ApplicationUser> findAllByRole(Role role);
}
