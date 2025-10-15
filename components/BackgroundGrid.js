import { motion } from 'framer-motion'

export default function BackgroundGrid() {
  const gridItems = Array.from({ length: 64 }, (_, i) => i)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full opacity-20">
        {gridItems.map((i) => (
          <motion.div
            key={i}
            className="border border-gray-300 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.01, duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  )
}