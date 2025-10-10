// src/lib/business.ts
import api from "./api";

export interface Business {
    _id: string;
    shopName: string;
    category: string;
    location: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export const getBusinesses = async (): Promise<Business[]> => {
    const res = await api.get<{ success: boolean, data: Business[] }>("/api/vendors");
    return res.data.data;
};

export const searchBusinesses = async (query: { shopName?: string, category?: string, location?: string }): Promise<Business[]> => {
    const params = new URLSearchParams();
    if (query.shopName) params.append('shopName', query.shopName);
    if (query.category) params.append('category', query.category);
    if (query.location) params.append('location', query.location);

    const res = await api.get<{ success: boolean, data: Business[] }>(`/api/vendors/search?${params.toString()}`);
    return res.data.data;
};
