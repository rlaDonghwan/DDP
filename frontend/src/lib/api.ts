import {
  User,
  Company,
  Device,
  DrivingRecord,
  Booking,
  Education,
  DashboardStats,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ users: User[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    return this.request(`/users?${queryParams}`);
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return this.request("/companies");
  }

  async getCompany(id: string): Promise<Company> {
    return this.request(`/companies/${id}`);
  }

  // Devices
  async getDevices(userId?: string): Promise<Device[]> {
    const endpoint = userId ? `/devices?userId=${userId}` : "/devices";
    return this.request(endpoint);
  }

  // Driving Records
  async getDrivingRecords(params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ records: DrivingRecord[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return this.request(`/records?${queryParams}`);
  }

  async submitDrivingRecord(
    file: File,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const response = await fetch(`${API_BASE_URL}/records/submit`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to submit driving record");
    }

    return response.json();
  }

  // Bookings
  async getBookings(params?: {
    userId?: string;
    companyId?: string;
    status?: string;
    date?: string;
  }): Promise<Booking[]> {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.companyId) queryParams.append("companyId", params.companyId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.date) queryParams.append("date", params.date);

    return this.request(`/bookings?${queryParams}`);
  }

  async createBooking(
    data: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ): Promise<Booking> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    return this.request(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Education
  async getEducations(userId?: string): Promise<Education[]> {
    const endpoint = userId ? `/education?userId=${userId}` : "/education";
    return this.request(endpoint);
  }

  async createEducation(data: Omit<Education, "id">): Promise<Education> {
    return this.request("/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request("/dashboard/stats");
  }
}

export const apiClient = new ApiClient();
