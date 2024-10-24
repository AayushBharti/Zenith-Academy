import React, { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChipInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
}

const ChipInput: React.FC<ChipInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
          >
            <span>{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-blue-200"
              onClick={() => removeTag(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={addTag}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export default ChipInput
