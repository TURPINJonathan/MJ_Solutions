package com.mj_solutions.api.compagny.entity;

import com.mj_solutions.api.file.entity.File;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "compagny_contact")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompagnyContact {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "compagny_id", nullable = false)
	private Compagny compagny;

	@Column(nullable = false)
	private String lastname;

	@Column(nullable = false)
	private String firstname;

	private String position;
	private String email;
	private String phone;

	@OneToOne
	@JoinColumn(name = "picture_id")
	private File picture;
}
