"use client";

import { useState } from "react";
import DaumPostcode, { Address } from "react-daum-postcode";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface AddressForm {
  zipcode: string;
  address: string;
  addressDetail: string;
}

interface AddressSearchProps {
  form: UseFormReturn<AddressForm>;
}

/**
 * Daum Postcode API를 사용한 주소 검색 컴포넌트
 * 우편번호와 도로명/지번 주소를 검색하고 상세주소를 입력받습니다
 */
const AddressSearch: React.FC<AddressSearchProps> = ({ form }) => {
  const [isSearching, setIsSearching] = useState(false);

  /**
   * 주소 검색 완료 핸들러
   */
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    // 도로명 주소인 경우
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    // 폼 값 업데이트
    form.setValue("zipcode", data.zonecode);
    form.setValue("address", fullAddress);
    form.setValue("addressDetail", "");

    // 검색 모달 닫기
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      {/* 우편번호 및 주소 검색 */}
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>우편번호</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="우편번호"
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSearching(true)}
            className="bg-Navy text-black hover:bg-Navy hover:opacity-90"
          >
            주소 검색
          </Button>
        </div>
      </div>

      {/* 주소 필드 */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>주소</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="주소 검색 버튼을 클릭해주세요"
                readOnly
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 상세주소 필드 */}
      <FormField
        control={form.control}
        name="addressDetail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>상세주소</FormLabel>
            <FormControl>
              <Input {...field} placeholder="상세주소를 입력하세요" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Daum Postcode 모달 */}
      {isSearching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-s rounded-lg shadow-xl w-full max-w-lg max-h-[600px] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">주소 검색</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSearching(false)}
              >
                ✕
              </Button>
            </div>
            <div className="h-[500px]">
              <DaumPostcode
                onComplete={handleComplete}
                autoClose={false}
                style={{ height: "100%" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
