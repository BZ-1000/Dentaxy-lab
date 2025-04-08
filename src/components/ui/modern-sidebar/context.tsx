
import React, { createContext, useContext } from 'react';

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  animate: true,
});

export const useSidebar = () => useContext(SidebarContext);

export { SidebarContext };
