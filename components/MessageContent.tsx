import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ content, isUser }) => {
  return (
    <div className={`markdown-content ${isUser ? 'user-message' : 'bot-message'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-3 mb-2 first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold mt-2 mb-1 first:mt-0" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-bold mt-2 mb-1 first:mt-0" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-xs font-semibold mt-2 mb-1 first:mt-0" {...props} />
          ),
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
          ),
          
          // Links
          a: ({ node, ...props }) => (
            <a
              className={`font-medium underline decoration-1 underline-offset-2 transition-colors duration-200 ${
                isUser
                  ? 'text-blue-200 hover:text-blue-100 active:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700 active:text-blue-800'
              }`}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-2 space-y-1 ml-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1 ml-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          
          // Code
          code: ({ node, inline, ...props }: any) => 
            inline ? (
              <code
                className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                  isUser
                    ? 'bg-slate-600 text-slate-100'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
                {...props}
              />
            ) : (
              <code
                className={`block px-3 py-2 rounded-lg text-sm font-mono overflow-x-auto mb-2 ${
                  isUser
                    ? 'bg-slate-600 text-slate-100'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre className="mb-2 overflow-x-auto" {...props} />
          ),
          
          // Blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={`border-l-4 pl-4 py-1 my-2 italic ${
                isUser
                  ? 'border-slate-500 text-slate-200'
                  : 'border-slate-300 text-slate-600'
              }`}
              {...props}
            />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              className={`my-3 border-t ${
                isUser ? 'border-slate-600' : 'border-slate-200'
              }`}
              {...props}
            />
          ),
          
          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          
          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-2">
              <table
                className={`min-w-full text-sm border-collapse ${
                  isUser ? 'border-slate-600' : 'border-slate-200'
                }`}
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className={isUser ? 'bg-slate-600' : 'bg-slate-50'}
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className={`border-b ${
                isUser ? 'border-slate-600' : 'border-slate-200'
              }`}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className={`px-3 py-2 text-left font-semibold border ${
                isUser ? 'border-slate-600' : 'border-slate-200'
              }`}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className={`px-3 py-2 border ${
                isUser ? 'border-slate-600' : 'border-slate-200'
              }`}
              {...props}
            />
          ),
          
          // Strikethrough (GFM)
          del: ({ node, ...props }) => (
            <del className="line-through" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
