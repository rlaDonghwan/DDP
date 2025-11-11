package com.ddp.auth.dto.response;

import com.ddp.auth.client.CompanyServiceClient;
import com.ddp.auth.client.dto.CompanyNameResponse;
import com.ddp.auth.client.dto.DeviceResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 사용자에게 할당된 장치 정보 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedDeviceResponse {

    private String id; // 장치 ID
    private String serialNumber; // 장치 시리얼 번호
    private String model; // 모델명
    private String status; // 장치 상태
    private String installationDate; // 설치일 (ISO 날짜)
    private String installedBy; // 설치 업체명
    private String installedByCompanyId; // 설치 업체 ID
    private String lastInspectionDate; // 최종 점검일 (ISO 날짜)
    private String nextInspectionDate; // 다음 점검일 (ISO 날짜)

    // DeviceResponse를 AssignedDeviceResponse로 변환 (업체명 조회 포함)
    public static AssignedDeviceResponse from(DeviceResponse device, CompanyServiceClient companyServiceClient) {
        // 설치 업체명 조회
        String installedByName = "업체 정보 없음";
        if (device.getCompanyId() != null) {
            try {
                CompanyNameResponse companyName = companyServiceClient.getCompanyName(device.getCompanyId());
                installedByName = companyName.getName();
            } catch (Exception e) {
                // company-service 호출 실패 시 기본값 사용
                installedByName = "업체 정보 조회 실패";
            }
        }

        return AssignedDeviceResponse.builder()
                .id(String.valueOf(device.getDeviceId()))
                .serialNumber(device.getSerialNumber())
                .model(device.getModelName())
                .status(device.getStatus())
                .installationDate(device.getInstallDate() != null ? device.getInstallDate().toString() : null)
                .installedBy(installedByName)
                .installedByCompanyId(device.getCompanyId() != null ? String.valueOf(device.getCompanyId()) : null)
                .lastInspectionDate(device.getLastInspectionDate() != null ? device.getLastInspectionDate().toString() : null)
                .nextInspectionDate(device.getNextInspectionDate() != null ? device.getNextInspectionDate().toString() : null)
                .build();
    }
}
