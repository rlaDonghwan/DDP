package com.ddp.auth.dto.request;

import com.ddp.auth.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

// 사용자 회원가입 요청 DTO - 회원가입에 필요한 모든 정보 포함
@Data
@NoArgsConstructor
@Schema(description = "사용자 회원가입 요청 정보")
public class UserRegistrationRequest {
    
    // 이메일 주소
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    @Schema(description = "사용자 이메일 주소", example = "user@example.com", required = true)
    private String email;
    
    // 비밀번호
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).{8,}$", 
             message = "비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다")
    @Schema(description = "사용자 비밀번호 (영문자+숫자 포함 8자 이상)", example = "password123", required = true)
    private String password;
    
    // 사용자 이름
    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 100, message = "이름은 2자 이상 100자 이하여야 합니다")
    @Schema(description = "사용자 이름", example = "홍길동", required = true)
    private String name;
    
    // 전화번호 (선택사항)
    @Size(max = 20, message = "전화번호는 20자를 초과할 수 없습니다")
    @Pattern(regexp = "^[0-9-]+$|^$", message = "전화번호는 숫자와 하이픈만 입력 가능합니다")
    @Schema(description = "사용자 전화번호", example = "010-1234-5678")
    private String phone;
    
    // 주소 (선택사항)
    @Size(max = 500, message = "주소는 500자를 초과할 수 없습니다")
    @Schema(description = "사용자 주소", example = "서울시 강남구 테헤란로 123")
    private String address;
    
    // 사용자 역할 (기본값: USER)
    @Schema(description = "사용자 역할", example = "USER", allowableValues = {"USER", "COMPANY", "ADMIN"})
    private UserRole role;
    
    // 역할 기본값 설정 메서드
    public UserRole getRole() {
        return role != null ? role : UserRole.getDefault();
    }
    
    // 역할 없이 생성하는 팩토리 메서드 (기본 역할: USER)
    public static UserRegistrationRequest createUser(String email, String password, String name, 
                                                   String phone, String address) {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setName(name);
        request.setPhone(phone);
        request.setAddress(address);
        request.setRole(UserRole.USER);
        return request;
    }
    
    // 특정 역할로 생성하는 팩토리 메서드 (관리자용)
    public static UserRegistrationRequest createWithRole(String email, String password, String name, 
                                                        String phone, String address, UserRole role) {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setName(name);
        request.setPhone(phone);
        request.setAddress(address);
        request.setRole(role);
        return request;
    }
}