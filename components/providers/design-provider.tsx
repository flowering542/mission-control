import { createContext, useContext, ReactNode } from 'react'

interface DesignContextType {
  variance: number    // 1-10: 布局变化度
  motion: number      // 1-10: 动画强度
  density: number     // 1-10: 视觉密度
}

const DesignContext = createContext<DesignContextType>({
  variance: 8,
  motion: 6,
  density: 4,
})

export function DesignProvider({ 
  children,
  config = { variance: 8, motion: 6, density: 4 }
}: { 
  children: ReactNode
  config?: DesignContextType 
}) {
  return (
    <DesignContext.Provider value={config}>
      {children}
    </DesignContext.Provider>
  )
}

export const useDesign = () => useContext(DesignContext)
