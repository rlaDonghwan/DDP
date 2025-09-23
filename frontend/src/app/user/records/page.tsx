'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, CheckCircle, AlertTriangle, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const mockRecords = [
  {
    id: '1',
    date: new Date(2024, 8, 10),
    startTime: '08:30',
    endTime: '17:45',
    alcoholLevel: 0.00,
    location: '서울시 강남구',
    status: 'normal' as const,
    submitted: true,
    submittedAt: new Date(2024, 8, 11),
  },
  {
    id: '2',
    date: new Date(2024, 8, 9),
    startTime: '09:00',
    endTime: '18:20',
    alcoholLevel: 0.00,
    location: '서울시 서초구',
    status: 'normal' as const,
    submitted: true,
    submittedAt: new Date(2024, 8, 10),
  },
  {
    id: '3',
    date: new Date(2024, 8, 8),
    startTime: '07:45',
    endTime: '16:30',
    alcoholLevel: 0.00,
    location: '경기도 성남시',
    status: 'normal' as const,
    submitted: false,
  },
  {
    id: '4',
    date: new Date(2024, 8, 7),
    startTime: '09:15',
    endTime: '17:00',
    alcoholLevel: 0.00,
    location: '서울시 강남구',
    status: 'normal' as const,
    submitted: false,
  },
];

export default function RecordsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setIsDialogOpen(false);
          setSelectedFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const pendingRecords = mockRecords.filter(record => !record.submitted);
  const submittedRecords = mockRecords.filter(record => record.submitted);

  const getStatusBadge = (status: string, submitted: boolean) => {
    if (!submitted) {
      return <Badge variant="destructive">미제출</Badge>;
    }
    
    switch (status) {
      case 'normal':
        return <Badge variant="default" className="bg-green-100 text-green-800">정상</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'violation':
        return <Badge variant="destructive">위반</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">운행기록 관리</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              기록 제출하기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>운행기록 제출</DialogTitle>
              <DialogDescription>
                장치에서 생성된 운행기록 파일을 업로드해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">운행기록 파일</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.txt,.log"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  지원 형식: CSV, TXT, LOG (최대 10MB)
                </p>
              </div>

              {selectedFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>업로드 중...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>업로드 중...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    제출하기
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 현황 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 기록</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRecords.length}건</div>
            <p className="text-xs text-muted-foreground">
              이번 달 기록
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미제출</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingRecords.length}건</div>
            <p className="text-xs text-red-600">
              제출 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">제출 완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submittedRecords.length}건</div>
            <p className="text-xs text-green-600">
              정상 처리
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 미제출 기록 알림 */}
      {pendingRecords.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{pendingRecords.length}건의 미제출 기록</strong>이 있습니다. 
            법적 의무사항이므로 빠른 시일 내에 제출해주세요.
          </AlertDescription>
        </Alert>
      )}

      {/* 운행기록 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            운행기록 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(record.date, 'MM월 dd일 (EEE)', { locale: ko })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {record.startTime} ~ {record.endTime}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {record.location}
                  </div>
                  
                  <div className="text-sm font-mono">
                    알코올: {record.alcoholLevel.toFixed(2)}%
                  </div>
                  
                  {getStatusBadge(record.status, record.submitted)}
                </div>

                <div className="flex items-center gap-2">
                  {record.submitted ? (
                    <div className="text-sm text-muted-foreground">
                      {record.submittedAt && format(record.submittedAt, 'MM/dd 제출', { locale: ko })}
                    </div>
                  ) : (
                    <Button size="sm" className="gap-1">
                      <Upload className="h-3 w-3" />
                      제출
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}