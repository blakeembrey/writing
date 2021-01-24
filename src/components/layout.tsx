import React, { ReactNode } from "react";
import { styled } from "react-free-style";
import Link from "next/link";

const Main = styled("div");

const Container = styled("div", [
  {
    maxWidth: 700,
    padding: 20,
    margin: "0 auto",
  },
  // Normalize.css v8 (objectified using https://transform.tools/css-to-js).
  {
    $global: true,
    html: { lineHeight: "1.15", WebkitTextSizeAdjust: "100%" },
    body: { margin: "0" },
    main: { display: "block" },
    h1: { fontSize: "2em", margin: "0.67em 0" },
    hr: { boxSizing: "content-box", height: "0", overflow: "visible" },
    pre: { fontFamily: "monospace, monospace", fontSize: "1em" },
    a: { backgroundColor: "transparent" },
    "abbr[title]": {
      borderBottom: "none",
      textDecoration: ["underline", "underline dotted"],
    },
    "b,strong": { fontWeight: "bolder" },
    "code,kbd,samp": {
      fontFamily: "monospace, monospace",
      fontSize: "1em",
    },
    small: { fontSize: "80%" },
    "sub,sup": {
      fontSize: "75%",
      lineHeight: "0",
      position: "relative",
      verticalAlign: "baseline",
    },
    sub: { bottom: "-0.25em" },
    sup: { top: "-0.5em" },
    img: { borderStyle: "none" },
    "button,input,optgroup,select,textarea": {
      fontFamily: "inherit",
      fontSize: "100%",
      lineHeight: "1.15",
      margin: "0",
    },
    "button,input": { overflow: "visible" },
    "button,select": { textTransform: "none" },
    'button,[type="button"],[type="reset"],[type="submit"]': {
      WebkitAppearance: "button",
    },
    'button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner': {
      borderStyle: "none",
      padding: "0",
    },
    'button:-moz-focusring,[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring': {
      outline: "1px dotted ButtonText",
    },
    fieldset: { padding: "0.35em 0.75em 0.625em" },
    legend: {
      boxSizing: "border-box",
      color: "inherit",
      display: "table",
      maxWidth: "100%",
      padding: "0",
      whiteSpace: "normal",
    },
    progress: { verticalAlign: "baseline" },
    textarea: { overflow: "auto" },
    '[type="checkbox"],[type="radio"]': {
      boxSizing: "border-box",
      padding: "0",
    },
    '[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button': {
      height: "auto",
    },
    '[type="search"]': { WebkitAppearance: "textfield", outlineOffset: "-2px" },
    '[type="search"]::-webkit-search-decoration': { WebkitAppearance: "none" },
    "::-webkit-file-upload-button": {
      WebkitAppearance: "button",
      font: "inherit",
    },
    details: { display: "block" },
    summary: { display: "list-item" },
    template: { display: "none" },
    "[hidden]": { display: "none" },
  },
  {
    $global: true,
    ":root": {
      "--brand-color": "#f20",
      "--background-color": "#eee",
      "--background-color-shift": "#fff",
      "--text-color": "#111",
      "--text-color-shift": "#222",
      "--text-color-subtle": "#777",
      "--border-color": "#ccc",
      "--border-color-shift": "#bbb",
      "--border-color-subtle": "#fff",
      "@media (prefers-color-scheme: dark)": {
        "--background-color": "#111",
        "--background-color-shift": "#222",
        "--text-color": "#eee",
        "--text-color-shift": "#fff",
        "--text-color-subtle": "#999",
        "--border-color": "#333",
        "--border-color-shift": "#444",
        "--border-color-subtle": "#000",
      },
    },
    html: {
      color: "var(--text-color)",
      backgroundColor: "var(--background-color)",
      fontFamily:
        "system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
      fontWeight: 300,
      lineHeight: 1.625,
    },
  },
]);

const BorderTop = styled("div", {
  borderTop: "4px solid var(--brand-color)",
});

const Header = styled("ul", {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  margin: 0,
  padding: "1.5em 0",
  fontSize: "1.2em",
});

const HeaderLink = styled("a", {
  color: "inherit",
  textDecoration: "none",
  borderBottom: "2px solid transparent",
  "&:hover": { borderBottomColor: "var(--brand-color)" },
  "&.active": { borderBottomColor: "var(--brand-color)" },
});

const PrimaryHeaderLink = styled(HeaderLink, {
  fontWeight: "bold",
});

const Content = styled("div", {
  fontSize: "1.125em",
  "h1, h2, h3, h4, h5, h6": {
    fontWeight: "bolder",
    marginTop: 0,
    marginBottom: "1em",
  },
  h1: {
    fontSize: "2em",
  },
  h2: {
    fontSize: "1.5em",
  },
  h3: {
    fontSize: "1.3em",
  },
  h4: {
    fontSize: "1.1em",
  },
  hr: {
    display: "block",
    margin: "1.5em 0",
    border: "1px dashed var(--border-color)",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: "var(--border-color-subtle)",
  },
  p: {
    margin: "0 0 1em 0",
  },
  a: {
    color: "inherit",
    textDecoration: "none",
    borderBottom: "2px solid var(--border-color)",
    "&:hover": { borderBottomColor: "var(--brand-color)" },
  },
  blockquote: {
    margin: "1em 0",
    paddingLeft: "1em",
    borderLeft: "4px solid var(--brand-color)",
  },
  "img,audio,embed,video,object": {
    height: "auto",
    maxWidth: "100%",
  },
  // Code rendering.
  "code, pre": {
    fontFamily: "monospace",
    color: "var(--text-color-shift)",
    border: "1px solid var(--border-color-shift)",
    fontSize: "0.9em",
    backgroundColor: "var(--background-color-shift)",
  },
  pre: {
    padding: "0.6em 0.8em",
    overflowX: "auto",
    lineHeight: 1.3,
    borderRadius: "2px",
  },
  code: {
    display: "inline",
    padding: "0.2em 0.3em",
    wordWrap: "break-word",
    whiteSpace: "pre-line",
    borderColor: "var(--border-color-shift)",
    borderRadius: "2px",
  },
  "pre > code": {
    border: "none",
    padding: "0",
    fontSize: "100%",
    wordWrap: "normal",
    whiteSpace: "pre",
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  "a > code": {
    borderBottomWidth: "2px",
  },
  "a:hover > code": {
    borderColor: "var(--brand-color)",
  },
  // Highlight.js theme.
  ".hljs-header,.hljs-comment,.hljs-javadoc": { color: "#969896" },
  ".hljs-keyword,.hljs-winutils,.hljs-subst,.hljs-request,.hljs-status": {
    color: "#a71d5d",
  },
  ".hljs-number,.hljs-hexcolor,.hljs-constant": { color: "#0086b3" },
  ".hljs-string,.hljs-tag .hljs-value,.hljs-phpdoc,.hljs-dartdoc,.hljs-formula": {
    color: "#df5000",
  },
  ".hljs-title,.hljs-id,.hljs-preprocessor": { color: "#795da3" },
  ".hljs-class .hljs-title,.hljs-type,.hljs-literal,.hljs-command": {
    color: "#458",
    fontWeight: "bolder",
  },
  ".hljs-tag,.hljs-tag .hljs-title,.hljs-rules .hljs-property": {
    color: "#000080",
  },
  ".hljs-attribute,.hljs-variable,.hljs-body": { color: "#008080" },
  ".hljs-regexp": { color: "#009926" },
  ".hljs-symbol,.hljs-symbol .hljs-string,.hljs-special,.hljs-prompt": {
    color: "#990073",
  },
  ".hljs-built_in": { color: "#0086b3" },
  ".hljs-preprocessor,.hljs-pragma,.hljs-pi,.hljs-doctype,.hljs-shebang,.hljs-cdata": {
    color: "#999",
    fontWeight: "bolder",
  },
  ".hljs-deletion": { background: "#fdd" },
  ".hljs-addition": { background: "#dfd" },
  ".hljs-change": { background: "#0086b3" },
  ".hljs-chunk": { color: "#aaa" },
  // Diff style.
  // "pre .diff-addition": { backgroundColor: "#dfd" },
  // "pre .diff-deletion": { backgroundColor: "#fdd" },
  // "pre .diff-chunk": { color: "#aaa" },
});

export type Props = {
  page?: "index" | "supporters";
  children: ReactNode;
};

export const Layout = ({ page, children }: Props) => {
  return (
    <Main>
      <BorderTop />
      <Container>
        <Header>
          <Link href="/" passHref>
            <PrimaryHeaderLink className={page === "index" ? "active" : ""}>
              Writing
            </PrimaryHeaderLink>
          </Link>
          <Link href="/supporters/" passHref>
            <HeaderLink className={page === "supporters" ? "active" : ""}>
              Supporters
            </HeaderLink>
          </Link>
        </Header>

        <Content>{children}</Content>
      </Container>
    </Main>
  );
};
