import type React from "react"
import { Switch, type SwitchProps } from "@mui/material"

interface CustomSwitchProps extends Omit<SwitchProps, "onChange"> {
  onCheckedChange?: (checked: boolean) => void
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ onCheckedChange, ...props }) => {
  return (
    <Switch
      {...props}
      onChange={(_, checked) => onCheckedChange?.(checked)}
      sx={{
        width: 44,
        height: 24,
        padding: 0,
        marginRight: 2,
        "& .MuiSwitch-switchBase": {
          padding: 0,
          margin: "3px",
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#1f2937",
            "& + .MuiSwitch-track": {
              backgroundColor: "#ffffff",
              opacity: 1,
              border: 0,
            },
          },
        },
        "& .MuiSwitch-thumb": {
          boxSizing: "border-box",
          width: 18,
          height: 18,
          boxShadow: "0 2px 4px 0 rgb(0 0 0 / 0.2)",
        },
        "& .MuiSwitch-track": {
          borderRadius: 12,
          backgroundColor: "#6b7280",
          opacity: 1,
        },
      }}
    />
  )
}

export default CustomSwitch