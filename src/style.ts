import { MemoryRenderer, StyleSheetRenderer } from "react-free-style";

export const renderer =
  typeof window === "undefined"
    ? new MemoryRenderer()
    : new StyleSheetRenderer(false);
