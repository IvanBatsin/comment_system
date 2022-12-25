import React from "react";

interface IconButtonProps {
  Icon: React.FC,
  isActive?: boolean,
  color?: string,
  children?: React.ReactNode,
  count?: number,
  disabled?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
 
export const IconButton: React.FC<IconButtonProps> = ({color, Icon, isActive, children, count, disabled, onClick}) => {
  return (
    <button className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${color || ''}`.trim()} onClick={onClick} disabled={!!disabled}>
      <span className={`${count ? 'mr-1' : ''}`.trim()}>
        <Icon/>
      </span>
      {count ? count : null}
      {/* {children} */}
    </button>
  )
}