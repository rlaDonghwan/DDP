package com.ddp.auth.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 프로필 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    // 전화번호 (10~11자리 숫자)
    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10~11자리 숫자만 입력 가능합니다")
    private String phone;

    // 주소 (5~200자)
    @Size(min = 5, max = 200, message = "주소는 5~200자 사이로 입력해주세요")
    private String address;
}
