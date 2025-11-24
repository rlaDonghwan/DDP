#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import random
from datetime import datetime, timedelta
import os

# 출력 디렉토리
OUTPUT_DIR = "../src/test/resources/sample-logs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# GPS 좌표 (서울 시내)
GPS_LOCATIONS = [
    "37.5665;126.9780",  # 서울시청
    "37.5172;127.0473",  # 강남역
    "37.5509;126.9882",  # 명동
    "37.5512;126.9882",  # 종로
]

def generate_normal_log(file_num):
    """정상 로그 생성 (한 달치, 하루 4번 측정)"""
    filename = f"{OUTPUT_DIR}/driving_log_normal_{file_num:03d}.csv"

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'alcoholLevel', 'testResult', 'deviceStatus', 'gpsLocation', 'notes'])

        start_date = datetime(2025, 10, 1) + timedelta(days=random.randint(0, 30))

        # 한 달치 데이터 (하루 4번: 아침, 점심, 저녁, 밤)
        for day in range(30):
            current_date = start_date + timedelta(days=day)

            for hour in [8, 12, 18, 22]:
                timestamp = current_date.replace(hour=hour, minute=random.randint(0, 59))
                alcohol_level = 0.00  # 정상 - 알코올 검출 안 됨
                test_result = "PASS"
                device_status = "NORMAL"
                gps = random.choice(GPS_LOCATIONS)
                notes = f"Normal test at {hour}:00"

                writer.writerow([
                    timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    f"{alcohol_level:.2f}",
                    test_result,
                    device_status,
                    gps,
                    notes
                ])

    print(f"✅ 생성 완료: {filename}")
    return filename

def generate_tampering_log(file_num):
    """조작 시도 로그 (TAMPERING_ATTEMPT)"""
    filename = f"{OUTPUT_DIR}/driving_log_tampering_{file_num:03d}.csv"

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'alcoholLevel', 'testResult', 'deviceStatus', 'gpsLocation', 'notes'])

        start_date = datetime(2025, 10, 1) + timedelta(days=random.randint(0, 30))
        tampering_count = 0

        for day in range(30):
            current_date = start_date + timedelta(days=day)

            for hour in [8, 12, 18, 22]:
                timestamp = current_date.replace(hour=hour, minute=random.randint(0, 59))

                # 10% 확률로 조작 시도
                if random.random() < 0.1:
                    device_status = "TAMPERING"
                    test_result = "SKIP"
                    alcohol_level = 0.00
                    notes = "Tampering attempt detected"
                    tampering_count += 1
                else:
                    device_status = "NORMAL"
                    test_result = "PASS"
                    alcohol_level = 0.00
                    notes = "Normal test"

                gps = random.choice(GPS_LOCATIONS)

                writer.writerow([
                    timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    f"{alcohol_level:.2f}",
                    test_result,
                    device_status,
                    gps,
                    notes
                ])

        print(f"✅ 생성 완료: {filename} (조작 시도: {tampering_count}회)")

    return filename

def generate_excessive_failures_log(file_num):
    """과도한 실패 로그 (EXCESSIVE_FAILURES)"""
    filename = f"{OUTPUT_DIR}/driving_log_excessive_failures_{file_num:03d}.csv"

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'alcoholLevel', 'testResult', 'deviceStatus', 'gpsLocation', 'notes'])

        start_date = datetime(2025, 10, 1) + timedelta(days=random.randint(0, 30))

        for day in range(30):
            current_date = start_date + timedelta(days=day)

            for hour in [8, 12, 18, 22]:
                timestamp = current_date.replace(hour=hour, minute=random.randint(0, 59))

                # 60% 확률로 실패 (과도한 실패율)
                if random.random() < 0.6:
                    test_result = "FAIL"
                    alcohol_level = round(random.uniform(0.03, 0.15), 2)
                    notes = "Alcohol detected"
                else:
                    test_result = "PASS"
                    alcohol_level = 0.00
                    notes = "Normal test"

                device_status = "NORMAL"
                gps = random.choice(GPS_LOCATIONS)

                writer.writerow([
                    timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    f"{alcohol_level:.2f}",
                    test_result,
                    device_status,
                    gps,
                    notes
                ])

    print(f"✅ 생성 완료: {filename}")
    return filename

def generate_bypass_log(file_num):
    """우회 시도 로그 (BYPASS_ATTEMPT)"""
    filename = f"{OUTPUT_DIR}/driving_log_bypass_{file_num:03d}.csv"

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'alcoholLevel', 'testResult', 'deviceStatus', 'gpsLocation', 'notes'])

        start_date = datetime(2025, 10, 1) + timedelta(days=random.randint(0, 30))

        for day in range(30):
            current_date = start_date + timedelta(days=day)

            for hour in [8, 12, 18, 22]:
                timestamp = current_date.replace(hour=hour, minute=random.randint(0, 59))

                # 5% 확률로 우회 시도
                if random.random() < 0.05:
                    device_status = "BYPASS"
                    test_result = "SKIP"
                    alcohol_level = 0.00
                    notes = "Bypass attempt detected"
                else:
                    device_status = "NORMAL"
                    test_result = "PASS"
                    alcohol_level = 0.00
                    notes = "Normal test"

                gps = random.choice(GPS_LOCATIONS)

                writer.writerow([
                    timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    f"{alcohol_level:.2f}",
                    test_result,
                    device_status,
                    gps,
                    notes
                ])

    print(f"✅ 생성 완료: {filename}")
    return filename

def generate_insufficient_tests_log(file_num):
    """측정 횟수 부족 로그"""
    filename = f"{OUTPUT_DIR}/driving_log_insufficient_{file_num:03d}.csv"

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'alcoholLevel', 'testResult', 'deviceStatus', 'gpsLocation', 'notes'])

        start_date = datetime(2025, 10, 1) + timedelta(days=random.randint(0, 30))

        # 한 달에 15회만 측정 (부족)
        for i in range(15):
            timestamp = start_date + timedelta(days=random.randint(0, 29), hours=random.randint(8, 22))
            alcohol_level = 0.00
            test_result = "PASS"
            device_status = "NORMAL"
            gps = random.choice(GPS_LOCATIONS)
            notes = "Random test"

            writer.writerow([
                timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                f"{alcohol_level:.2f}",
                test_result,
                device_status,
                gps,
                notes
            ])

    print(f"✅ 생성 완료: {filename}")
    return filename

# 메인 실행
if __name__ == "__main__":
    print("=" * 60)
    print("🚀 더미 로그 파일 생성 시작")
    print("=" * 60)

    # 정상 로그 35개
    print("\n[1/5] 정상 로그 생성 중... (35개)")
    for i in range(1, 36):
        generate_normal_log(i)

    # 조작 시도 로그 5개
    print("\n[2/5] 조작 시도 로그 생성 중... (5개)")
    for i in range(1, 6):
        generate_tampering_log(i)

    # 과도한 실패 로그 5개
    print("\n[3/5] 과도한 실패 로그 생성 중... (5개)")
    for i in range(1, 6):
        generate_excessive_failures_log(i)

    # 우회 시도 로그 3개
    print("\n[4/5] 우회 시도 로그 생성 중... (3개)")
    for i in range(1, 4):
        generate_bypass_log(i)

    # 측정 횟수 부족 로그 2개
    print("\n[5/5] 측정 횟수 부족 로그 생성 중... (2개)")
    for i in range(1, 3):
        generate_insufficient_tests_log(i)

    print("\n" + "=" * 60)
    print("✅ 총 50개 로그 파일 생성 완료!")
    print(f"📁 출력 경로: {OUTPUT_DIR}")
    print("=" * 60)
