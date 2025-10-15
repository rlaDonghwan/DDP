package com.ddp.company.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 승인/반려 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApproveCompanyRequest {

    // 업체 ID
    @NotBlank(message = "업체 ID는 필수입니다")
    private String companyId;

    // 상태 (approved, rejected)
    @NotBlank(message = "상태는 필수입니다")
    private String status;

    // 반려 사유 (반려 시 필수)
    private String rejectedReason;
}
