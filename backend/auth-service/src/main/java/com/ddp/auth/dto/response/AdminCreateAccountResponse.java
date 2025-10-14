package com.ddp.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 관리자 계정 생성 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "관리자 계정 생성 응답")
public class AdminCreateAccountResponse {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "응답 메시지", example = "미완성 계정이 생성되었습니다")
    private String message;

    @Schema(description = "생성된 사용자 ID")
    private Long userId;

    @Schema(description = "사용자 이름")
    private String name;

    @Schema(description = "전화번호")
    private String phone;

    @Schema(description = "운전면허 번호")
    private String licenseNumber;

    @Schema(description = "계정 상태")
    private String accountStatus;

    // 성공 응답 생성
    public static AdminCreateAccountResponse success(Long userId, String name, String phone, String licenseNumber) {
        return AdminCreateAccountResponse.builder()
                .success(true)
                .message("미완성 계정이 생성되었습니다. 사용자는 휴대폰 인증을 통해 회원가입을 완료할 수 있습니다.")
                .userId(userId)
                .name(name)
                .phone(phone)
                .licenseNumber(licenseNumber)
                .accountStatus("PENDING")
                .build();
    }

    // 실패 응답 생성
    public static AdminCreateAccountResponse failure(String message) {
        return AdminCreateAccountResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
