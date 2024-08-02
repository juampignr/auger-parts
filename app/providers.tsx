"use client";

import * as React from "react";
import { createContext, ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export const Context = createContext({});

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = React.useState(false);
  const [rowCounter, setRowCounter] = React.useState(0);

  return (
    <Context.Provider
      value={{
        valuesObject: {},
        part: selectedPart,
        setSelectedPart: setSelectedPart,
        rowCounter: rowCounter,
        setRowCounter: setRowCounter,
      }}
    >
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </Context.Provider>
  );
}
