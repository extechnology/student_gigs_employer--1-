import {
    AlertCircle,
    ArrowRight,
    Building2,
    CheckCircle2,
    CircleAlert,
    Loader2,
    MapPin,
    RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProfileCompletionResponse, ProfileCompletionSection } from "../../types/profileCompletion";

interface ProfileCompletionCardProps {
    data?: ProfileCompletionResponse;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    onCompleteProfile: () => void;
}

interface SectionMeta {
    label: string;
    description: string;
    icon: LucideIcon;
}

interface CompletionSectionView extends ProfileCompletionSection {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
}

const sectionMeta: Record<string, SectionMeta> = {
    basic_info: {
        label: "Basic info",
        description: "Company name, story, logo and email",
        icon: Building2,
    },
    location: {
        label: "Location",
        description: "Address, city, state, postal code and country",
        icon: MapPin,
    },
};

const fieldLabels: Record<string, string> = {
    company_name: "Company name",
    company_info: "Company info",
    logo: "Logo",
    email: "Email",
    street_address: "Street address",
    city: "City",
    state: "State",
    postal_code: "Postal code",
    country: "Country",
};

const getReadableLabel = (value: string) => {
    return fieldLabels[value] ?? value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const clampPercentage = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return Math.min(100, Math.max(0, Math.round(safeValue)));
};

const getSectionViews = (sections: ProfileCompletionResponse["sections"]) => {
    return Object.entries(sections).map(([key, section]): CompletionSectionView => {
        const meta = sectionMeta[key] ?? {
            label: getReadableLabel(key),
            description: "Complete the required profile fields",
            icon: CircleAlert,
        };

        return {
            ...section,
            key,
            label: meta.label,
            description: meta.description,
            icon: meta.icon,
        };
    });
};

export default function ProfileCompletionCard({
    data,
    isLoading = false,
    isError = false,
    onRetry,
    onCompleteProfile,
}: ProfileCompletionCardProps) {
    if (isLoading) {
        return (
            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-5">
                    <div className="h-3 w-28 animate-pulse rounded-full bg-emerald-100" />
                    <div className="mt-4 h-5 w-44 animate-pulse rounded-md bg-gray-200" />
                    <div className="mt-6 flex items-center gap-5">
                        <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
                            <div className="h-3 w-full animate-pulse rounded-md bg-gray-200" />
                            <div className="h-3 w-3/4 animate-pulse rounded-md bg-gray-200" />
                        </div>
                    </div>
                    <div className="mt-5 h-10 w-full animate-pulse rounded-md bg-emerald-100" />
                </div>
                <div className="space-y-4 p-5">
                    {[1, 2].map((item) => (
                        <div key={item} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-28 animate-pulse rounded-md bg-gray-200" />
                                    <div className="h-3 w-full animate-pulse rounded-md bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-red-600">Profile strength</p>
                        <h2 className="mt-2 text-lg font-bold text-gray-950">Unable to load completion</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            We could not fetch the employer profile checklist right now.
                        </p>
                    </div>
                </div>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                )}
            </section>
        );
    }

    if (!data) {
        return (
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <Loader2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Profile strength</p>
                        <h2 className="mt-2 text-lg font-bold text-gray-950">Completion details unavailable</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Update your profile details to improve employer visibility.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const sections = getSectionViews(data.sections);
    const overallPercentage = clampPercentage(data.overall_percentage);
    const totals = sections.reduce(
        (summary, section) => ({
            filled: summary.filled + section.filled,
            total: summary.total + section.total,
            missing: summary.missing + section.missing_fields.length,
        }),
        { filled: 0, total: 0, missing: 0 }
    );
    const completedSections = sections.filter(
        (section) => section.missing_fields.length === 0 || clampPercentage(section.percentage) === 100
    ).length;
    const progressColor = data.is_complete ? "#059669" : overallPercentage >= 50 ? "#2563eb" : "#f97316";
    const statusClassName = data.is_complete
        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
        : "border-orange-100 bg-orange-50 text-orange-700";

    return (
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Profile strength</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName}`}>
                        {data.is_complete ? "Complete" : "Pending"}
                    </span>
                </div>

                <h2 className="mt-3 text-xl font-bold text-gray-950">
                    {data.is_complete ? "Your profile is complete" : "Complete your company profile"}
                </h2>

                <div className="mt-6 flex items-center gap-5">
                    <div
                        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full p-2"
                        role="progressbar"
                        aria-label="Employer profile completion"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={overallPercentage}
                        style={{
                            background: `conic-gradient(${progressColor} ${overallPercentage * 3.6}deg, #e5e7eb 0deg)`,
                        }}
                    >
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">
                            <span className="text-2xl font-black text-gray-950">{overallPercentage}%</span>
                            <span className="text-[10px] font-bold uppercase text-gray-500">complete</span>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                            <CheckCircle2 size={14} className="text-blue-600" />
                            {totals.filled}/{totals.total} done
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Add missing details to build trust and improve employer visibility.
                        </p>
                    </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                        style={{ width: `${overallPercentage}%` }}
                    />
                </div>

                <button
                    type="button"
                    onClick={onCompleteProfile}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                    {data.is_complete ? "Review profile" : "Complete profile"}
                    <ArrowRight size={16} />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-bold text-gray-950">Completion checklist</h3>
                        <p className="mt-1 text-xs text-gray-500">
                            {totals.missing > 0 ? `${totals.missing} fields left` : "All fields completed"}
                        </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {completedSections}/{sections.length} sections
                    </span>
                </div>

                <div className="mt-4">
                    {sections.map((section) => {
                        const sectionPercentage = clampPercentage(section.percentage);
                        const isSectionComplete = section.missing_fields.length === 0 || sectionPercentage === 100;
                        const Icon = section.icon;
                        const visibleMissingFields = section.missing_fields.slice(0, 3);
                        const hiddenMissingFieldsCount = Math.max(section.missing_fields.length - visibleMissingFields.length, 0);

                        return (
                            <div key={section.key} className="border-t border-gray-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                            isSectionComplete ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                        }`}
                                    >
                                        {isSectionComplete ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-950">{section.label}</h4>
                                                <p className="mt-1 text-xs leading-5 text-gray-500">{section.description}</p>
                                            </div>
                                            <span className="shrink-0 text-xs font-bold text-gray-600">{sectionPercentage}%</span>
                                        </div>

                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full rounded-full ${isSectionComplete ? "bg-emerald-500" : "bg-blue-600"}`}
                                                style={{ width: `${sectionPercentage}%` }}
                                            />
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                                            <span>
                                                {section.filled}/{section.total} completed
                                            </span>
                                            <span className={isSectionComplete ? "font-semibold text-emerald-700" : "font-semibold text-orange-700"}>
                                                {isSectionComplete ? "Completed" : `${section.missing_fields.length} missing`}
                                            </span>
                                        </div>

                                        {!isSectionComplete && visibleMissingFields.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {visibleMissingFields.map((field) => (
                                                    <span
                                                        key={`${section.key}-${field}`}
                                                        className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                                                    >
                                                        {getReadableLabel(field)}
                                                    </span>
                                                ))}
                                                {hiddenMissingFieldsCount > 0 && (
                                                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                        +{hiddenMissingFieldsCount} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
