// filepath: /Users/aaron/Documents/code_repos/vacation-tracker/frontend/src/components/ThemeToggle.tsx
import { Box, IconButton, SxProps } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  sx?: SxProps;
}

export function ThemeToggle({ isDarkMode, onToggle, sx }: ThemeToggleProps) {
  return (
    <Box sx={sx}>
      <IconButton onClick={onToggle} color="inherit">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
}
