import { IconButton, Tooltip } from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <Tooltip
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconButton
        onClick={onToggle}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: isDarkMode ? "text.primary" : "text.primary",
        }}
      >
        <Icon
          path={isDarkMode ? mdiWeatherSunny : mdiWeatherNight}
          size={1}
          color="currentColor"
        />
      </IconButton>
    </Tooltip>
  );
}
