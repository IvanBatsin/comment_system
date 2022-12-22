import React from "react";

interface IconButtonProps {
  Icon: React.FC,
  isActive?: boolean,
  color?: string,
  children?: React.ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
 
export const IconButton: React.FC<IconButtonProps> = ({color, Icon, isActive, children, onClick}) => {
  return (
    <button className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${color || ''}`} onClick={onClick}>
      <span className={`${children ? 'mr-1' : ''}`}>
        <Icon/>
      </span>
      {children}
    </button>
  )
}