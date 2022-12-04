import React from "react";

interface IconButtonProps {
  Icon: React.FC,
  isActive?: boolean,
  color?: string,
  children?: React.ReactNode
}
 
export const IconButton: React.FC<IconButtonProps> = ({color, Icon, isActive, children}) => {
  return (
    <button className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${color || ''}`}>
      <span className={`${children ? 'mr-1' : ''}`}>
        <Icon/>
      </span>
      {children}
    </button>
  )
}