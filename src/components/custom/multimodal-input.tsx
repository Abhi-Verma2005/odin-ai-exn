import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lightbulb, Code, MessageSquare, Upload, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MultimodalInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

const MultimodalInput: React.FC<MultimodalInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ask for help with your problem...",
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onSubmit(value.trim())
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    // Handle file upload logic here
    console.log('Files to upload:', files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Quick Actions */}
      <div className="mb-3 flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="tertiary"
            size="small"
            className={cn(
              "text-xs sm:text-sm",
              action.color
            )}
            onClick={() => onChange(action.action)}
          >
            <action.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
            <span className="hidden sm:inline">{action.title}</span>
            <span className="sm:hidden">{action.title.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-fuchsia-500",
              "text-sm sm:text-base pr-20",
              isDragOver && "border-fuchsia-500 bg-fuchsia-900/20"
            )}
            disabled={isLoading}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          
          {/* File Upload Button */}
          <Button
            type="button"
            variant="tertiary"
            size="small"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!value.trim() || isLoading}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white flex-shrink-0"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </form>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept="image/*,.pdf,.txt,.md,.js,.ts,.py,.java,.cpp,.c"
      />
    </div>
  )
}

export default MultimodalInput 