-- 미사용/중복 테이블 삭제 SQL 스크립트
-- 실행 시기: 코드 정리 완료 후 배포 시
-- 주의: 이 스크립트는 데이터를 영구적으로 삭제합니다. 실행 전 백업 필수!

-- =====================================================
-- 1. device-service 데이터베이스 테이블 삭제
-- =====================================================

-- 검·교정 이력 테이블 삭제
-- 이유: ServiceRecord로 통합 (ServiceType.INSPECTION으로 관리)
DROP TABLE IF EXISTS inspection_records CASCADE;

-- 수리 이력 테이블 삭제
-- 이유: ServiceRecord로 통합 (ServiceType.REPAIR, ServiceType.MAINTENANCE로 관리)
DROP TABLE IF EXISTS repair_records CASCADE;

-- =====================================================
-- 2. company-service 데이터베이스 테이블 삭제
-- =====================================================

-- 고객 테이블 삭제
-- 이유: auth-service의 User 엔티티와 중복
DROP TABLE IF EXISTS customers CASCADE;

-- 관리 장치 테이블 삭제
-- 이유: device-service의 Device 엔티티와 중복
DROP TABLE IF EXISTS managed_devices CASCADE;

-- =====================================================
-- 참고사항
-- =====================================================
--
-- 삭제된 기능의 대체 방안:
--
-- 1. inspection_records, repair_records -> ServiceRecord
--    - ServiceRecord 테이블에 type 필드로 구분
--    - ServiceType enum: INSTALLATION, INSPECTION, REPAIR, MAINTENANCE
--    - 상세 정보는 description 필드에 JSON 또는 텍스트로 저장
--
-- 2. customers -> User (auth-service)
--    - 사용자 정보는 auth-service의 User 엔티티로 관리
--    - company-service는 userId만 참조
--
-- 3. managed_devices -> Device (device-service)
--    - 장치 정보는 device-service의 Device 엔티티로 관리
--    - company-service는 companyId로 장치 목록 조회
--
-- =====================================================

-- 실행 확인용 쿼리 (삭제 전 테이블 존재 여부 확인)
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('inspection_records', 'repair_records', 'customers', 'managed_devices');
