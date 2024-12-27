"use client"

import { MenuTable } from "@/components/manage/menu/MenuTable"
import { MenuTree } from "@/components/manage/menu/MenuTree"
import { MenuType } from "@/types/menu"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedCode, setSelectedCode] = useState<string>("")
  const [tempMenu, setTempMenu] = useState<Partial<MenuType> | undefined>(undefined)

  const onSelectCode = (code: string) => {
    setSelectedCode(code)
    setTempMenu(undefined)
  }

  return (
    <Box display="flex" className="flex flex-col md:flex-row">
      {/* Left: TreeView */}
      <Box
        sx={[
          (theme) => ({
            width: "100%",
            padding: "0",
            background: "#fafafa",
            ...theme.applyStyles("dark", {
              background: "#1f2937",
            }),
            [theme.breakpoints.up("md")]: {
              minWidth: "300px",
              width: "20%",
              padding: "10px",
              marginRight: "16px",
            },
          }),
        ]}
      >
        <MenuTree onSelectCode={onSelectCode} setTempMenu={setTempMenu} />
      </Box>
      {/* Right: Table */}
      <Box
        // className="border-l-2 pl-6 dark:border-gray-600"
        sx={[
          (theme) => ({
            width: "100%",
            marginTop: "20px",
            paddingTop: "1rem",
            borderTopWidth: "2px",
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
            [theme.breakpoints.up("md")]: {
              maxWidth: "calc(100% - 316px)",
              width: "80%",
              borderTopWidth: "0",
              borderLeftWidth: "2px",
              paddingLeft: "1rem",
              marginTop: "0",
              paddingTop: "0",
            },
          }),
        ]}
      >
        <MenuTable selectedCode={selectedCode} tempMenu={tempMenu} setTempMenu={setTempMenu} />
      </Box>
    </Box>
  )
}
