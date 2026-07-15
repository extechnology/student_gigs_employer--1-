export interface ProfileCompletionSection {
    filled: number;
    total: number;
    percentage: number;
    missing_fields: string[];
}

export interface ProfileCompletionResponse {
    overall_percentage: number;
    is_complete: boolean;
    sections: Record<string, ProfileCompletionSection>;
}
