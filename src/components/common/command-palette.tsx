// src/components/common/command-palette.tsx

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Command } from "lucide-react"
import { useClickOutside } from "@/hooks/use-click-outside"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onClick: () => void
}

interface CommandPaletteProps {
  items: CommandItem[]
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen])

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Tìm kiếm...</span>
        <kbd className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-md">
          ⌘K
        </kbd>
      </Button>

      {/* Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={ref}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 px-0"
                  autoFocus
                />
                <kbd className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                  ESC
                </kbd>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Không tìm thấy kết quả</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                        onClick={() => {
                          item.onClick()
                          setIsOpen(false)
                        }}
                      >
                        {item.icon && (
                          <span className="text-gray-400 group-hover:text-primary-500 transition-colors">
                            {item.icon}
                          </span>
                        )}
                        <span className="flex-1 text-left text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <kbd className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                            {item.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}