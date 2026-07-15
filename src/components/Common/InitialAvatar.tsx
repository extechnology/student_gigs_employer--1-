import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface InitialAvatarProps {
    imageUrl?: string | null;
    username?: string | null;
    name?: string | null;
    alt?: string;
    className?: string;
    textClassName?: string;
}

const gradients = [
    "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
    "linear-gradient(135deg, #f97316 0%, #db2777 100%)",
    "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)",
    "linear-gradient(135deg, #16a34a 0%, #65a30d 100%)",
    "linear-gradient(135deg, #ea580c 0%, #ca8a04 100%)",
    "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
];

const getDisplayName = (username?: string | null, name?: string | null) => {
    return (username || name || "").trim();
};

const getInitial = (username?: string | null, name?: string | null) => {
    const displayName = getDisplayName(username, name);
    return displayName.charAt(0).toUpperCase() || "U";
};

const getGradient = (value: string) => {
    const total = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return gradients[total % gradients.length];
};

export default function InitialAvatar({
    imageUrl,
    username,
    name,
    alt = "User avatar",
    className = "h-10 w-10",
    textClassName = "text-base",
}: InitialAvatarProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const trimmedImageUrl = imageUrl?.trim();
    const displayName = getDisplayName(username, name);
    const initial = getInitial(username, name);
    const background = useMemo(() => getGradient(displayName || initial), [displayName, initial]);

    useEffect(() => {
        setImageFailed(false);
    }, [trimmedImageUrl]);

    if (trimmedImageUrl && !imageFailed) {
        return (
            <img
                src={trimmedImageUrl}
                loading="lazy"
                alt={alt}
                onError={() => setImageFailed(true)}
                className={`${className} shrink-0 rounded-full object-cover`}
            />
        );
    }

    const avatarStyle: CSSProperties = { background };

    return (
        <div
            role="img"
            aria-label={displayName ? `${displayName} avatar` : alt}
            className={`${className} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-white/70`}
            style={avatarStyle}
        >
            <span className={`${textClassName} font-bold uppercase leading-none tracking-normal text-white drop-shadow-sm`}>
                {initial}
            </span>
        </div>
    );
}
