import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider, type Theme } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import { CustomToaster } from "./components/Toaster";
import { UserContext } from "./contexts/UserContext";
import { useSystemTheme } from "./hooks/useSystemTheme";
import AppRouter from "./router";
import { GlobalStyles } from "./styles";
import { Themes, createCustomTheme, isDarkMode } from "./theme/createTheme";

function App() {
  const { user } = useContext(UserContext);
  const systemTheme = useSystemTheme();

  const getMuiTheme = useCallback((): Theme => {
    if (systemTheme === "unknown") {
      return Themes[0].MuiTheme;
    }
    if (user.theme === "system") {
      return systemTheme === "dark" ? Themes[0].MuiTheme : Themes[1].MuiTheme;
    }
    const selectedTheme = Themes.find((theme) => theme.name === user.theme);
    return selectedTheme ? selectedTheme.MuiTheme : Themes[0].MuiTheme;
  }, [systemTheme, user.theme]);

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", getMuiTheme().palette.secondary.main);
    }
  }, [user.theme, getMuiTheme]);

  return (
    <MuiThemeProvider
      theme={createCustomTheme(
        getMuiTheme().palette.primary.main,
        getMuiTheme().palette.secondary.main,
        isDarkMode(user.darkmode, systemTheme, getMuiTheme().palette.secondary.main)
          ? "dark"
          : "light",
      )}
    >
      <EmotionThemeProvider
        theme={{
          primary: getMuiTheme().palette.primary.main,
          secondary: getMuiTheme().palette.secondary.main,
          darkmode: isDarkMode(user.darkmode, systemTheme, getMuiTheme().palette.secondary.main),
          mui: getMuiTheme(),
        }}
      >
        <GlobalStyles />
        <CustomToaster />
        <ErrorBoundary>
          <MainLayout>
            <AppRouter />
          </MainLayout>
        </ErrorBoundary>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;