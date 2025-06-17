package com.mj_solutions.api.unit.auth.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.mj_solutions.api.auth.entity.BlacklistedToken;
import com.mj_solutions.api.auth.repository.BlacklistedTokenRepository;

@DataJpaTest
class BlacklistedTokenRepositoryITTest {

	@Autowired
	private BlacklistedTokenRepository blacklistedTokenRepository;

	@Test
	void saveAndFindByToken() {
		BlacklistedToken token = BlacklistedToken.builder()
				.token("jwt-blacklisted")
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();
		blacklistedTokenRepository.save(token);

		assertThat(blacklistedTokenRepository.findByToken("jwt-blacklisted")).isPresent();
	}
}