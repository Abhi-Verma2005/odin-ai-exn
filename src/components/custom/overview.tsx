import React from 'react'
import { Bot, Lightbulb, Code, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OverviewProps {
  onQuickAction?: (action: string) => void
  className?: string
}

const Overview: React.FC<OverviewProps> = ({ onQuickAction, className }) => {
  const quickActions = [
    {
      title: "Get a hint",
      label: "for current problem",
      action: "Give me a hint for my current problem.",
      icon: Lightbulb,
      color: "text-fuchsia-200 hover:bg-fuchsia-900/40"
    },
    {
      title: "Explain approach",
      label: "step by step",
      action: "Explain the approach to solve this problem step by step.",
      icon: MessageSquare,
      color: "text-blue-200 hover:bg-blue-900/40"
    },
    {
      title: "Show solution",
      label: "with code",
      action: "Show me the complete solution with code.",
      icon: Code,
      color: "text-green-200 hover:bg-green-900/40"
    }
  ]

  return (
    <div className={cn("text-center py-4 sm:py-8", className)}>
      <div className="bg-zinc-800 rounded-lg p-4 sm:p-6 max-w-sm mx-auto">
        <Bot className="h-8 w-8 sm:h-12 sm:w-12 text-fuchsia-500 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
          Welcome to LeetCode Whisper
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm mb-3 sm:mb-4">
          Get AI-powered hints and explanations for your LeetCode problems.
        </p>
        
        {/* Quick Actions */}
        <div className="space-y-1.5 sm:space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="tertiary"
              size="small"
              className={cn(
                "w-full justify-start text-left text-xs sm:text-sm",
                action.color
              )}
              onClick={() => onQuickAction?.(action.action)}
            >
              <action.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{action.title}</div>
                <div className="text-xs opacity-70 truncate">{action.label}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview 