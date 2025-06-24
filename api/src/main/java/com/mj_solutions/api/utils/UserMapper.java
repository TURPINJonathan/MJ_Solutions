package com.mj_solutions.api.utils;

import com.mj_solutions.api.applicationuser.dto.UserResponse;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;

public class UserMapper {
    public static UserResponse mapToUserResponse(ApplicationUser user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setLastname(user.getLastname());
        userResponse.setRole(user.getRole());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt() : null);
        return userResponse;
    }
}
