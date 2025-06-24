package com.mj_solutions.api.compagny.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class UpdateCompagnyRequest {
    private String name;
    private String description;
    private String color;
    private String website;
    private List<ImageRequest> pictures;

    @Data
    @Builder
    public static class ImageRequest {
        private Long id;      // id de CompagnyImage (pour update/suppression)
        private Long fileId;
        private boolean isLogo;
        private boolean isMaster;
    }
}