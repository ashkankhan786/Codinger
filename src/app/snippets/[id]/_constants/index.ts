import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import py from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";

export const languageMap: Record<string, any> = {
  javascript: js,
  typescript: ts,
  python: py,
  java: java,
  c: c,
  cpp: cpp,
  go: go,
  ruby: ruby,
  rust: rust,
  swift: swift,
  csharp: csharp,
};
