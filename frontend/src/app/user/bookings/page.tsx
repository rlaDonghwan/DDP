'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const mockCompanies = [
  {
    id: '1',
    name: 'ABC 정비소',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    type: 'repair' as const,
    rating: 4.8,
    distance: 2.3,
  },
  {
    id: '2',
    name: 'DEF 교육센터',
    address: '서울시 서초구 강남대로 456',
    phone: '02-9876-5432',
    type: 'education' as const,
    rating: 4.6,
    distance: 1.8,
  },
  {
    id: '3',
    name: 'GHI 검사소',
    address: '경기도 성남시 분당구 정자로 789',
    phone: '031-1111-2222',
    type: 'inspection' as const,
    rating: 4.9,
    distance: 5.2,
  },
];

const mockBookings = [
  {
    id: '1',
    type: '정기 검사',
    date: new Date(2024, 8, 20),
    time: '10:00',
    company: 'ABC 정비소',
    status: 'confirmed' as const,
    notes: '정기 점검 및 소프트웨어 업데이트',
  },
  {
    id: '2',
    type: '교육 이수',
    date: new Date(2024, 8, 25),
    time: '14:00',
    company: 'DEF 교육센터',
    status: 'pending' as const,
    notes: '음주운전 방지 교육',
  },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleBooking = () => {
    // TODO: API 호출
    setIsDialogOpen(false);
    setSelectedDate(undefined);
    setSelectedCompany('');
    setSelectedType('');
    setSelectedTime('');
    setNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">확정</Badge>;
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      case 'completed':
        return <Badge variant="outline">완료</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">취소</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'repair':
        return 'bg-blue-50 border-blue-200';
      case 'education':
        return 'bg-green-50 border-green-200';
      case 'inspection':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredCompanies = mockCompanies.filter(company =>
    searchLocation === '' || 
    company.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
    company.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">예약 관리</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              새 예약하기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 예약</DialogTitle>
              <DialogDescription>
                검사, 수리, 교육 등의 서비스를 예약할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 업체 찾기 */}
              <div className="space-y-4">
                <div>
                  <Label>업체 검색</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="지역명 또는 업체명으로 검색"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowMap(!showMap)}
                      className="gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      지도
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCompany === company.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : `${getTypeColor(company.type)} hover:border-gray-300`
                      }`}
                      onClick={() => setSelectedCompany(company.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            전화: {company.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">⭐ {company.rating}</div>
                          <div className="text-xs text-muted-foreground">
                            {company.distance}km
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 서비스 유형 */}
              <div>
                <Label>서비스 유형</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="서비스를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspection">정기 검사</SelectItem>
                    <SelectItem value="repair">수리</SelectItem>
                    <SelectItem value="education">교육 이수</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 날짜 및 시간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>예약 날짜</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !selectedDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>예약 시간</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 특이사항 */}
              <div>
                <Label htmlFor="notes">특이사항 (선택사항)</Label>
                <Input
                  id="notes"
                  placeholder="추가 요청사항이나 특이사항을 입력하세요"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleBooking}
                disabled={!selectedCompany || !selectedType || !selectedDate || !selectedTime}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                예약하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 예약 현황 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 예약</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookings.length}건</div>
            <p className="text-xs text-muted-foreground">
              이번 달
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예정된 예약</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockBookings.filter(b => b.status === 'confirmed').length}건
            </div>
            <p className="text-xs text-blue-600">
              확정 완료
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기중</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockBookings.filter(b => b.status === 'pending').length}건
            </div>
            <p className="text-xs text-orange-600">
              승인 대기
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 예약 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            예약 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(booking.date, 'MM월 dd일 (EEE)', { locale: ko })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {booking.time}
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium">
                    {booking.type}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {booking.company}
                  </div>
                  
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    상세보기
                  </Button>
                  
                  {booking.status === 'pending' && (
                    <Button variant="outline" size="sm" className="text-red-600">
                      취소
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}