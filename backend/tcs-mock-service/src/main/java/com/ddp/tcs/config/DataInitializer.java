package com.ddp.tcs.config;

import com.ddp.tcs.entity.License;
import com.ddp.tcs.entity.LicenseStatus;
import com.ddp.tcs.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

// 개발용 테스트 데이터 초기화
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final LicenseRepository licenseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (licenseRepository.count() == 0) {
            initializeTestData();
        }
    }

    private void initializeTestData() {
        log.info("테스트 면허 데이터 초기화 시작");

        List<License> testLicenses = Arrays.asList(
                // === 음주운전 위반자들 (10명) - 계정 생성 가능 ===
                License.builder()
                        .licenseNumber("11-22-123456-78")
                        .name("김음주")
                        .residentNumber("890101-1******")
                        .birthDate(LocalDate.of(1989, 1, 1))
                        .address("서울특별시 강남구 테헤란로 123")
                        .issueDate(LocalDate.of(2010, 3, 15))
                        .expiryDate(LocalDate.of(2030, 3, 15))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(2)
                        .build(),

                License.builder()
                        .licenseNumber("22-33-234567-89")
                        .name("박위반")
                        .residentNumber("850505-2******")
                        .birthDate(LocalDate.of(1985, 5, 5))
                        .address("부산광역시 해운대구 센텀로 456")
                        .issueDate(LocalDate.of(2008, 8, 20))
                        .expiryDate(LocalDate.of(2028, 8, 20))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(1)
                        .build(),

                License.builder()
                        .licenseNumber("33-44-345678-90")
                        .name("이반복")
                        .residentNumber("920312-1******")
                        .birthDate(LocalDate.of(1992, 3, 12))
                        .address("대구광역시 수성구 동대구로 789")
                        .issueDate(LocalDate.of(2015, 6, 10))
                        .expiryDate(LocalDate.of(2035, 6, 10))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(3)
                        .build(),

                License.builder()
                        .licenseNumber("44-55-456789-01")
                        .name("정상습")
                        .residentNumber("881225-2******")
                        .birthDate(LocalDate.of(1988, 12, 25))
                        .address("인천광역시 연수구 컨벤시아대로 101")
                        .issueDate(LocalDate.of(2012, 11, 5))
                        .expiryDate(LocalDate.of(2032, 11, 5))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(4)
                        .build(),

                License.builder()
                        .licenseNumber("55-66-567890-12")
                        .name("최중범")
                        .residentNumber("780808-1******")
                        .birthDate(LocalDate.of(1978, 8, 8))
                        .address("광주광역시 서구 상무대로 202")
                        .issueDate(LocalDate.of(2005, 4, 12))
                        .expiryDate(LocalDate.of(2025, 4, 12))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(1)
                        .build(),

                // 추가 음주운전 위반자들
                License.builder()
                        .licenseNumber("12-34-567890-11")
                        .name("조음주")
                        .residentNumber("910815-1******")
                        .birthDate(LocalDate.of(1991, 8, 15))
                        .address("울산광역시 남구 삼산로 808")
                        .issueDate(LocalDate.of(2014, 4, 20))
                        .expiryDate(LocalDate.of(2034, 4, 20))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(2)
                        .build(),

                License.builder()
                        .licenseNumber("23-45-678901-22")
                        .name("송만취")
                        .residentNumber("860922-2******")
                        .birthDate(LocalDate.of(1986, 9, 22))
                        .address("경기도 성남시 분당구 판교역로 909")
                        .issueDate(LocalDate.of(2009, 11, 15))
                        .expiryDate(LocalDate.of(2029, 11, 15))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(5)
                        .build(),

                License.builder()
                        .licenseNumber("34-56-789012-33")
                        .name("한주정")
                        .residentNumber("930705-1******")
                        .birthDate(LocalDate.of(1993, 7, 5))
                        .address("경상북도 포항시 북구 중앙로 1010")
                        .issueDate(LocalDate.of(2016, 3, 10))
                        .expiryDate(LocalDate.of(2036, 3, 10))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(1)
                        .build(),

                License.builder()
                        .licenseNumber("45-67-890123-44")
                        .name("강술박")
                        .residentNumber("801203-1******")
                        .birthDate(LocalDate.of(1980, 12, 3))
                        .address("전라남도 순천시 중앙로 1111")
                        .issueDate(LocalDate.of(2003, 7, 8))
                        .expiryDate(LocalDate.of(2023, 7, 8))
                        .licenseType("1종보통")
                        .status(LicenseStatus.EXPIRED)
                        .isDuiViolator(true)
                        .violationCount(3)
                        .build(),

                License.builder()
                        .licenseNumber("56-78-901234-55")
                        .name("윤만주")
                        .residentNumber("941118-2******")
                        .birthDate(LocalDate.of(1994, 11, 18))
                        .address("경상남도 창원시 마산합포구 중앙로 1212")
                        .issueDate(LocalDate.of(2017, 8, 25))
                        .expiryDate(LocalDate.of(2037, 8, 25))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(true)
                        .violationCount(2)
                        .build(),

                // === 일반 운전자들 (10명) - 계정 생성 불가 ===
                License.builder()
                        .licenseNumber("66-77-678901-23")
                        .name("홍길동")
                        .residentNumber("900615-1******")
                        .birthDate(LocalDate.of(1990, 6, 15))
                        .address("경기도 수원시 영통구 월드컵로 303")
                        .issueDate(LocalDate.of(2013, 9, 25))
                        .expiryDate(LocalDate.of(2033, 9, 25))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("77-88-789012-34")
                        .name("김철수")
                        .residentNumber("950420-1******")
                        .birthDate(LocalDate.of(1995, 4, 20))
                        .address("강원도 춘천시 중앙로 404")
                        .issueDate(LocalDate.of(2018, 2, 14))
                        .expiryDate(LocalDate.of(2038, 2, 14))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("88-99-890123-45")
                        .name("이영희")
                        .residentNumber("870730-2******")
                        .birthDate(LocalDate.of(1987, 7, 30))
                        .address("충청북도 청주시 상당구 상당로 505")
                        .issueDate(LocalDate.of(2011, 12, 8))
                        .expiryDate(LocalDate.of(2031, 12, 8))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                // 추가 일반 운전자들
                License.builder()
                        .licenseNumber("67-78-890234-56")
                        .name("안전주")
                        .residentNumber("920825-1******")
                        .birthDate(LocalDate.of(1992, 8, 25))
                        .address("경기도 고양시 일산동구 중앙로 1313")
                        .issueDate(LocalDate.of(2015, 5, 12))
                        .expiryDate(LocalDate.of(2035, 5, 12))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("78-89-901345-67")
                        .name("신중운")
                        .residentNumber("881109-2******")
                        .birthDate(LocalDate.of(1988, 11, 9))
                        .address("충청남도 천안시 동남구 중앙로 1414")
                        .issueDate(LocalDate.of(2012, 3, 18))
                        .expiryDate(LocalDate.of(2032, 3, 18))
                        .licenseType("1종대형")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("89-90-012456-78")
                        .name("유모범")
                        .residentNumber("970614-1******")
                        .birthDate(LocalDate.of(1997, 6, 14))
                        .address("경기도 용인시 기흥구 중앙로 1515")
                        .issueDate(LocalDate.of(2020, 7, 22))
                        .expiryDate(LocalDate.of(2040, 7, 22))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("90-01-123567-89")
                        .name("임깨끗")
                        .residentNumber("851127-2******")
                        .birthDate(LocalDate.of(1985, 11, 27))
                        .address("경기도 안양시 만안구 중앙로 1616")
                        .issueDate(LocalDate.of(2008, 9, 5))
                        .expiryDate(LocalDate.of(2028, 9, 5))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("01-12-234678-90")
                        .name("서순수")
                        .residentNumber("940403-1******")
                        .birthDate(LocalDate.of(1994, 4, 3))
                        .address("경기도 부천시 원미구 중앙로 1717")
                        .issueDate(LocalDate.of(2017, 1, 15))
                        .expiryDate(LocalDate.of(2037, 1, 15))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("12-23-345789-01")
                        .name("배모범")
                        .residentNumber("830219-2******")
                        .birthDate(LocalDate.of(1983, 2, 19))
                        .address("경기도 화성시 봉담읍 중앙로 1818")
                        .issueDate(LocalDate.of(2006, 10, 30))
                        .expiryDate(LocalDate.of(2026, 10, 30))
                        .licenseType("1종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                License.builder()
                        .licenseNumber("23-34-456890-12")
                        .name("황신입")
                        .residentNumber("020508-3******")
                        .birthDate(LocalDate.of(2002, 5, 8))
                        .address("경기도 파주시 문산읍 중앙로 1919")
                        .issueDate(LocalDate.of(2023, 8, 15))
                        .expiryDate(LocalDate.of(2043, 8, 15))
                        .licenseType("2종보통")
                        .status(LicenseStatus.NORMAL)
                        .isDuiViolator(false)
                        .violationCount(0)
                        .build(),

                // === 취소/정지된 면허들 (2명) ===
                License.builder()
                        .licenseNumber("99-00-901234-56")
                        .name("임취소")
                        .residentNumber("820303-1******")
                        .birthDate(LocalDate.of(1982, 3, 3))
                        .address("전라북도 전주시 완산구 전주천서로 606")
                        .issueDate(LocalDate.of(2007, 7, 18))
                        .expiryDate(LocalDate.of(2027, 7, 18))
                        .licenseType("1종보통")
                        .status(LicenseStatus.CANCELED)
                        .isDuiViolator(true)
                        .violationCount(5)
                        .build(),

                License.builder()
                        .licenseNumber("00-11-012345-67")
                        .name("한정지")
                        .residentNumber("940918-2******")
                        .birthDate(LocalDate.of(1994, 9, 18))
                        .address("제주특별자치도 제주시 중앙로 707")
                        .issueDate(LocalDate.of(2016, 5, 30))
                        .expiryDate(LocalDate.of(2036, 5, 30))
                        .licenseType("2종보통")
                        .status(LicenseStatus.SUSPENDED)
                        .isDuiViolator(true)
                        .violationCount(2)
                        .build()
        );

        licenseRepository.saveAll(testLicenses);
        log.info("테스트 면허 데이터 초기화 완료 - 총 {}개 레코드 생성", testLicenses.size());
    }
}