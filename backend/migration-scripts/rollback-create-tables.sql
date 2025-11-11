-- 테이블 복원 SQL 스크립트 (Rollback)
-- 실행 시기: drop-unused-tables.sql 실행 후 문제 발생 시
-- 주의: 이 스크립트는 테이블 구조만 복원합니다. 데이터는 백업에서 복원해야 합니다.

-- =====================================================
-- 1. device-service 데이터베이스 테이블 복원
-- =====================================================

-- 검·교정 이력 테이블 복원
CREATE TABLE IF NOT EXISTS inspection_records (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL,
    inspection_date DATE NOT NULL,
    inspector_id BIGINT,
    result VARCHAR(50) NOT NULL,
    notes TEXT,
    next_inspection_date DATE,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 수리 이력 테이블 복원
CREATE TABLE IF NOT EXISTS repair_records (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL,
    repair_date DATE NOT NULL,
    repairer_id BIGINT,
    work_description TEXT NOT NULL,
    replaced_parts TEXT,
    cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. company-service 데이터베이스 테이블 복원
-- =====================================================

-- 고객 테이블 복원
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    device_serial_number VARCHAR(100),
    last_service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 관리 장치 테이블 복원
CREATE TABLE IF NOT EXISTS managed_devices (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    model_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_subject_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 인덱스 복원
-- =====================================================

-- inspection_records 인덱스
CREATE INDEX IF NOT EXISTS idx_inspection_records_device_id ON inspection_records(device_id);
CREATE INDEX IF NOT EXISTS idx_inspection_records_inspection_date ON inspection_records(inspection_date);

-- repair_records 인덱스
CREATE INDEX IF NOT EXISTS idx_repair_records_device_id ON repair_records(device_id);
CREATE INDEX IF NOT EXISTS idx_repair_records_repair_date ON repair_records(repair_date);

-- customers 인덱스
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- managed_devices 인덱스
CREATE INDEX IF NOT EXISTS idx_managed_devices_company_id ON managed_devices(company_id);
CREATE INDEX IF NOT EXISTS idx_managed_devices_serial_number ON managed_devices(serial_number);

-- =====================================================
-- 참고사항
-- =====================================================
--
-- 이 스크립트는 테이블 구조만 복원합니다.
-- 데이터 복원이 필요한 경우 별도의 백업 파일을 사용하세요.
--
-- 데이터 복원 예시:
-- pg_restore -d database_name -t inspection_records backup_file.dump
--
-- =====================================================
