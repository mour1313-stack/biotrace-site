"use client"
// Adapté pour Biotrace : directive client ; libellés accessibles en français ; largeur limitée
// sur mobile ; fermeture avec Échap ou au clic à l'extérieur ; résultats optionnels (liste de
// suggestions navigable au clavier, ouverte vers le haut ou vers le bas) ; styles passés en props.

import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type SearchDockResult = { id: string; title: string; subtitle?: string; badge?: string; href?: string }

type ExpandingSearchDockProps = {
  onSearch?: (query: string) => void
  /** Suggestions affichées pendant la saisie. */
  getResults?: (query: string) => SearchDockResult[]
  onSelect?: (result: SearchDockResult) => void
  placeholder?: string
  openLabel?: string
  closeLabel?: string
  inputLabel?: string
  emptyLabel?: string
  /** Sens d'ouverture de la liste de résultats. */
  resultsPlacement?: "top" | "bottom"
  expandedWidth?: number
  /** Prévenu à l'ouverture et à la fermeture du champ. */
  onExpandedChange?: (expanded: boolean) => void
  buttonClassName?: string
  fieldClassName?: string
  panelClassName?: string
}

export function ExpandingSearchDock({
  onSearch,
  getResults,
  onSelect,
  placeholder = "Search...",
  openLabel = "Open search",
  closeLabel = "Close search",
  inputLabel = "Search",
  emptyLabel = "No results",
  resultsPlacement = "bottom",
  expandedWidth = 320,
  onExpandedChange,
  buttonClassName,
  fieldClassName,
  panelClassName,
}: ExpandingSearchDockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [width, setWidth] = useState(expandedWidth)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const results = getResults && query.trim() ? getResults(query) : []
  const showPanel = Boolean(getResults && query.trim())

  const handleExpand = () => {
    // Largeur limitée à l'écran (marge de 1 rem de chaque côté sur mobile).
    setWidth(Math.min(expandedWidth, window.innerWidth - 32))
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setQuery("")
    setActive(0)
  }

  const choose = (result: SearchDockResult) => {
    onSelect?.(result)
    handleCollapse()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results[active]) return choose(results[active])
    if (onSearch && query) onSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      handleCollapse()
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    }
  }

  // Prévient le parent à chaque ouverture / fermeture (clic, Échap ou clic à l'extérieur).
  const onExpandedChangeRef = useRef(onExpandedChange)
  useEffect(() => {
    onExpandedChangeRef.current = onExpandedChange
  })
  useEffect(() => {
    onExpandedChangeRef.current?.(isExpanded)
  }, [isExpanded])

  // Ferme le champ au clic à l'extérieur.
  useEffect(() => {
    if (!isExpanded) return
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      setIsExpanded(false)
      setQuery("")
      setActive(0)
    }
    document.addEventListener("pointerdown", onPointer)
    return () => document.removeEventListener("pointerdown", onPointer)
  }, [isExpanded])

  return (
    <div ref={rootRef} className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon"
            type="button"
            aria-label={openLabel}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleExpand}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted",
              buttonClassName,
            )}
          >
            <Search aria-hidden className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            role="search"
            initial={{ width: 48, opacity: 0 }}
            animate={{ width, opacity: 1 }}
            exit={{ width: 48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(12px)" }}
              className={cn(
                "relative flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/80 backdrop-blur-md",
                fieldClassName,
              )}
            >
              <div className="ml-4">
                <Search aria-hidden className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={inputLabel}
                role={getResults ? "combobox" : undefined}
                aria-expanded={getResults ? showPanel : undefined}
                aria-controls={getResults ? listId : undefined}
                aria-autocomplete={getResults ? "list" : undefined}
                aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                autoFocus
                className="h-12 min-w-0 flex-1 bg-transparent pr-2 text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
              />
              <motion.button
                type="button"
                aria-label={closeLabel}
                onClick={handleCollapse}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted"
              >
                <X aria-hidden className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {showPanel && (
              <motion.div
                initial={{ opacity: 0, y: resultsPlacement === "top" ? 8 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "absolute right-0 left-0 max-h-[min(60vh,26rem)] overflow-y-auto rounded-2xl border border-border bg-card p-1.5",
                  resultsPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2",
                  panelClassName,
                )}
              >
                <ul id={listId} role="listbox" aria-label={inputLabel}>
                  {results.map((r, i) => (
                    <li
                      key={r.id}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onPointerEnter={() => setActive(i)}
                      onClick={() => choose(r)}
                      className={cn(
                        "cursor-pointer rounded-xl px-3 py-2 text-sm",
                        i === active && "bg-muted",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{r.title}</span>
                        {r.badge && <span className="shrink-0 text-[0.7rem] text-muted-foreground uppercase">{r.badge}</span>}
                      </span>
                      {r.subtitle && <span className="line-clamp-2 text-xs text-muted-foreground">{r.subtitle}</span>}
                    </li>
                  ))}
                </ul>
                {results.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">{emptyLabel}</p>}
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
