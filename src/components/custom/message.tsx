import { ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { useSidebar } from "@/context/SidebarProvider";
import { BotIcon, UserIcon } from "@/components/custom/icons";
import { Markdown } from "@/components/custom/markdown";
import { ShiningText } from "@/components/ui/shining-text";
import CompactQuestionsViewer from "@/components/dsa/Questions";
import DSAProgressDashboard from "@/components/dsa/Progress";
import UserSubmission from "@/components/dsa/UserSubmission";

export const Message = ({
  role,
  content,
  toolInvocations,
  append,
  isStreaming = false,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  append?: (message: any) => void;
  isStreaming?: boolean;
}) => {
  const { setSidebarContent } = useSidebar();

  // Handle Done button click
  const handleDone = (question: any) => {
    const message = `I'm done with the question "${question.title}" (${question.slug}). Please check my submission and provide feedback.`;
    append?.({
      role: 'user',
      content: message,
    });
  };

  // Handle Check button click
  const handleCheck = (question: any) => {
    const message = `Please examine my submission for "${question.title}" (${question.slug}) and provide detailed feedback on my solution.`;
    append?.({
      role: 'user',
      content: message,
    });
  };

  // Function to get component and show in sidebar
  const showInSidebar = (toolName: string, result: any) => {
    let component = null;

    switch (toolName) {
      case "getFilteredQuestionsToSolve":
        component = (
          <CompactQuestionsViewer 
            data={result} 
            onDone={handleDone}
            onCheck={handleCheck}
          />
        );
        break;
      case "getUserProgressOverview":
        component = <DSAProgressDashboard data={result} />;
        break;
      case "getUserSubmissionForProblem":
        component = <UserSubmission data={result} />;
        break;
      default:
        component = <div>{JSON.stringify(result, null, 2)}</div>;
    }

    if (component) {
      setSidebarContent(component);
    }
  };

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {/* Shimmer above AI message when streaming */}
        {role === "assistant" && isStreaming && (
          <div className="mb-2">
            <ShiningText text="Thinking..." />
          </div>
        )}
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-2">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    <button
                      onClick={() => showInSidebar(toolName, result)}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                    >
                      View {toolName.replace(/([A-Z])/g, ' $1').trim()} →
                    </button>
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm animate-pulse">
                      Loading {toolName}...
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};