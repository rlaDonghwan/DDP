package com.ddp.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 비밀번호 변경 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRequest {

    // 현재 비밀번호
    @NotBlank(message = "현재 비밀번호를 입력해주세요")
    private String currentPassword;

    // 새 비밀번호 (8~20자, 대소문자, 숫자, 특수문자 포함)
    @NotBlank(message = "새 비밀번호를 입력해주세요")
    @Size(min = 8, max = 20, message = "새 비밀번호는 8~20자 사이로 입력해주세요")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다"
    )
    private String newPassword;

    // 새 비밀번호 확인
    @NotBlank(message = "비밀번호 확인을 입력해주세요")
    private String confirmPassword;
}
