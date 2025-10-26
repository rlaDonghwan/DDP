"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AddressSearch from "@/components/shared/address-search";
import { useForm } from "react-hook-form";
import React from "react";

type AddressForm = {
  zipcode: string;
  address: string;
  addressDetail: string;
};

interface AddressSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress?: string;
  onSelect: (v: {
    address: string;
    addressDetail?: string;
    zipcode?: string;
  }) => void;
}

/**
 * 주소 검색 모달 컴포넌트
 * Daum Postcode API를 사용하여 주소를 검색하고 선택합니다
 */
const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  open,
  onOpenChange,
  initialAddress,
  onSelect,
}) => {
  const form = useForm<AddressForm>({
    defaultValues: {
      zipcode: "",
      address: initialAddress ?? "",
      addressDetail: "",
    },
  });

  /**
   * 적용하기 버튼 핸들러
   */
  const apply = () => {
    const v = form.getValues();
    onSelect({
      address: v.address,
      addressDetail: v.addressDetail,
      zipcode: v.zipcode,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <AddressSearch form={form} />
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={apply} disabled={!form.watch("address")}>
            적용하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressSearchModal;
