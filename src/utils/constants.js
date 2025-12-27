export const TYPE_LABELS = {
    sea: "Море",
    mountain: "Гори",
    city: "Міста",
    adventure: "Пригоди"
};

export const DIFFICULTY_LABELS = {
    relax: "Релакс",
    medium: "Помірно",
    active: "Активно"
};

export const PRESETS = [
    { label: "🏖 Релакс на морі", type: ["sea"], difficulty: ["relax"] },
    { label: "🏔 Гірський драйв", type: ["mountain"], difficulty: ["active"] },
    { label: "🏰 Міста Європи", type: ["city"], difficulty: ["medium"] },
    { label: "🎒 Пригоди", type: ["adventure"], difficulty: ["active"] }
];
