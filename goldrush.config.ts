import { type GRKKitType } from "@/utils/types/shared.types";

export const GRKKit: GRKKitType = {
  brand: {
    title: "GoldRush",
    subtitle: "Bitcoin Wallet & Portfolio UI",
    logo_url: "/goldrush-logo.png",
    github: "https://github.com/covalenthq/goldrush-bitcoin-wallet-ui",
  },
  theme: {
    borderRadius: 6,
    colors: {
      dark: {
        primary: "#FF4C8B",
        background: "#000426",
        foreground: "#FFFFFF",
        secondary: "#868E96",
      },
      light: {
        primary: "#FF4C8B",
        background: "#FFFFFF",
        foreground: "#1C2024",
        secondary: "#868E96",
      },
    },
    mode: "light",
  },
};

export default GRKKit;
