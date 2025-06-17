package com.mj_solutions.api.unit.auth.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;

@DataJpaTest
class RefreshTokenRepositoryIT {

	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

	@Autowired
	private ApplicationUserRepository applicationUserRepository;

	@Test
	void saveAndFindByToken() {
		RefreshToken token = RefreshToken.builder()
				.token("abc")
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();
		refreshTokenRepository.save(token);

		assertThat(refreshTokenRepository.findByToken("abc")).isPresent();
	}

	@Test
	void deleteByUserId_shouldRemoveToken() {
		ApplicationUser user = new ApplicationUser();
		user.setEmail("deletebyuserid@mail.com");
		user = applicationUserRepository.save(user);

		RefreshToken token = RefreshToken.builder()
				.token("to-delete")
				.expiryDate(Instant.now().plusSeconds(1000))
				.user(user)
				.build();
		refreshTokenRepository.save(token);

		int deleted = refreshTokenRepository.deleteByUserId(user.getId());
		assertThat(deleted).isEqualTo(1);
		assertThat(refreshTokenRepository.findByToken("to-delete")).isNotPresent();
	}

	@Test
	void deleteByUser_shouldRemoveToken() {
		ApplicationUser user = new ApplicationUser();
		user.setEmail("deletebyuser@mail.com");
		user = applicationUserRepository.save(user);

		RefreshToken token = RefreshToken.builder()
				.token("to-delete2")
				.expiryDate(Instant.now().plusSeconds(1000))
				.user(user)
				.build();
		refreshTokenRepository.save(token);

		int deleted = refreshTokenRepository.deleteByUser(user);
		assertThat(deleted).isEqualTo(1);
		assertThat(refreshTokenRepository.findByToken("to-delete2")).isNotPresent();
	}
}
