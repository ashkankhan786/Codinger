"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";
import NavigationHeader from "@/components/NavigationHeader";
import { Clock, Code, Download, MessageSquare, User } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import CopyButton from "./_components/CopyButton";
import Comments from "./_components/Comments";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import monokai from "react-syntax-highlighter/dist/esm/styles/hljs/monokai";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { languageMap } from "./_constants";
import ShareButton from "./_components/ShareButton";

function SnippetDetailPage() {
  const snippetId = useParams().id;

  const snippet = useQuery(api.snippets.getSnippetById, {
    snippetId: snippetId as Id<"snippets">,
  });
  const comments = useQuery(api.snippets.getComments, {
    snippetId: snippetId as Id<"snippets">,
  });

  const handleSnippetDownload = async () => {
    if (snippet?.language && languageMap[snippet.language]) {
      SyntaxHighlighter.registerLanguage(
        snippet.language,
        languageMap[snippet.language]
      );
    }
    const node = document.getElementById("download-snippet-wrapper");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        skipFonts: true,
      });
      download(dataUrl, `${snippet?.title || "snippet"}.png`);
    } catch (err) {
      console.error("Snapshot error", err);
    }
  };

  if (snippet === undefined) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-[#ffffff08] p-2.5">
                  <img
                    src={`/${snippet.language}.png`}
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {snippet.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <User className="w-4 h-4" />
                      <span>{snippet.userName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(snippet._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{comments?.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
                {snippet.language}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086] ">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <div className="flex items-center gap-4">
                <CopyButton code={snippet.code} />
                <button
                  onClick={handleSnippetDownload}
                  type="button"
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative"
                >
                  <Download className=" size-5 text-gray-400 group-hover:text-gray-300" />
                </button>
                <ShareButton snippetId={snippet._id} />
              </div>
            </div>
            <div id="snippet-code-editor">
              <div
                style={{
                  position: "absolute",
                  top: "-9999px",
                  left: "-9999px",
                }}
              >
                <div
                  id="download-snippet-wrapper"
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    background: "#272822",
                    maxWidth: "900px",
                  }}
                >
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={monokai}
                    customStyle={{
                      fontSize: 16,
                      borderRadius: "12px",
                      fontFamily: '"Fira Code", monospace',
                    }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
              <Editor
                height="600px"
                language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
                value={snippet.code}
                theme="vs-dark"
                beforeMount={defineMonacoThemes}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  readOnly: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  renderWhitespace: "selection",
                  fontFamily:
                    '"Fira Code", "Cascadia Code", Consolas, monospace',
                  fontLigatures: true,
                }}
              />
            </div>
          </div>

          <Comments snippetId={snippet._id} />
        </div>
      </main>
    </div>
  );
}
export default SnippetDetailPage;
