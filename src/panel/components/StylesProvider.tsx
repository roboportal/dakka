import { ReactElement, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { grey } from '@mui/material/colors'

interface DarkThemeProps {
  children: ReactElement
}

export default function StylesProvider({ children }: DarkThemeProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const defaultTheme = createTheme()

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontSize: 12,
        },
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#0a1929' : grey.A200,
          },
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                [defaultTheme.breakpoints.up('sm')]: {
                  minHeight: 36,
                },
                [defaultTheme.breakpoints.down('sm')]: {
                  minHeight: 36,
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#121212',
              },
            },
          },
        },
      }),
    [prefersDarkMode, defaultTheme.breakpoints],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
