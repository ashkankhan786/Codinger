"use client";
import { Facebook, Linkedin, Mail, Share, Twitter } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiWhatsappFill } from "react-icons/ri";

function ShareButton({ snippetId }: { snippetId: string }) {
  const [showShare, setShowShare] = useState(false);
  const shareUrl = `${window.location.origin}/snippets/${snippetId}`;
  return (
    <>
      <button
        onClick={() => setShowShare(true)}
        type="button"
        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative"
      >
        <Share className=" size-4 text-gray-400 group-hover:text-gray-300" />
      </button>
      {showShare && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-xl relative w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Share this snippet
            </h3>

            <div className="flex items-center bg-gray-100 dark:bg-[#2c2c2c] rounded-md p-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full bg-transparent text-sm text-black dark:text-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast("Link copied!");
                }}
                className="ml-2 text-blue-600 text-sm"
              >
                Copy
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Share via
              </p>
              <div className="flex items-center justify-evenly text-3xl">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  <Twitter />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700"
                >
                  <Facebook />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="text-blue-800" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent("Check out this code snippet")}&body=${encodeURIComponent(`I found this code snippet on Codinger you might like:\n\n${shareUrl}`)}`}
                  className="text-red-500"
                  title="Share via Email"
                >
                  <Mail />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500"
                >
                  <RiWhatsappFill />
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShare(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareButton;
