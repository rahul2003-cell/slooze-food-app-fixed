package com.slooze.foodapp.dto;

import com.slooze.foodapp.entity.Country;
import com.slooze.foodapp.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String fullName;
    private Role role;
    private Country country;
}
