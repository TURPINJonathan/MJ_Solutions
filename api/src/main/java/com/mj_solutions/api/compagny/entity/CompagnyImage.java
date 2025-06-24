package com.mj_solutions.api.compagny.entity;

import com.mj_solutions.api.file.entity.File;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compagny_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompagnyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "compagny_id", nullable = false)
    private Compagny compagny;

    @OneToOne
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Column(nullable = false)
    private boolean isLogo;

    @Column(nullable = false)
    private boolean isMaster;
}