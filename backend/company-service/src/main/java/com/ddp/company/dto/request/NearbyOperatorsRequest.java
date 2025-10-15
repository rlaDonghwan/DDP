package com.ddp.company.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 주변 업체 검색 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyOperatorsRequest {

    // 현재 위치 위도
    @NotNull(message = "위도는 필수입니다")
    @Min(value = -90, message = "위도는 -90 이상이어야 합니다")
    @Max(value = 90, message = "위도는 90 이하여야 합니다")
    private Double latitude;

    // 현재 위치 경도
    @NotNull(message = "경도는 필수입니다")
    @Min(value = -180, message = "경도는 -180 이상이어야 합니다")
    @Max(value = 180, message = "경도는 180 이하여야 합니다")
    private Double longitude;

    // 검색 반경 (km, 기본 10km)
    @Min(value = 1, message = "검색 반경은 1km 이상이어야 합니다")
    @Max(value = 100, message = "검색 반경은 100km 이하여야 합니다")
    private Double radius = 10.0;

    // 서비스 타입 필터 (옵션)
    private String serviceType;
}
