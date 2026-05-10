export const spacing = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  48: "48px",
  64: "64px",
  76: "76px",
  172: "172px",
} as const;

export const colors = {
  primary: {
    DEFAULT: "#635BFF",
    hover: "#675DFF",
    active: "#533AFD",
  },
  neutral: {
    white: "#FFFFFF",
    muted: "#F4F7FA",
    border: "#ECF1F6",
    text: "#414552",
  },
  semantic: {
    danger: "#E61947",
    warning: "#CC4B00",
    success: "#22C55E",
  },
} as const;

export const minimumTouchTarget = 44;
