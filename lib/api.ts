import { Job } from "@/components/job-card";

// Define the structure of the API response for fetching multiple jobs
interface JobsApiResponse {
    success: boolean;
    data: {
        jobs: Job[];
        currentPage: number;
        totalPages: number;
        totalJobs: number;
    };
    message: string;
}

// Define the structure for a single job response
interface JobApiResponse {
    success: boolean;
    data: Job;
    message: string;
}

// Get the API URL from environment variables, with a fallback for safety
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Fetches a list of jobs from the backend with optional filters.
 * @param filters - An object containing search, location, etc.
 * @returns A promise that resolves to the API response.
 */
export async function getJobs(filters: Record<string, string> = {}): Promise<JobsApiResponse> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }
    return response.json();
}

/**
 * Fetches a single job by its ID.
 * @param id - The unique ID of the job.
 * @returns A promise that resolves to the API response.
 */
export async function getJobById(id: string): Promise<JobApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`);
    if (!response.ok) {
        // This will be caught by Next.js and can trigger a 404 page
        throw new Error('Job not found');
    }
    return response.json();
}