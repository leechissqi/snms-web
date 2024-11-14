"use client"

import { EquipTable } from "@/components/equip/EquipTable"
import { EquipTree } from "@/components/equip/EquipTree"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedEquipTypeCode, setSelectedEquipTypeCode] = useState<string>("")

  return (
    <Box display="flex">
      {/* Left: TreeView */}
      <Box width="30%" mr={2}>
        <EquipTree onSelectEquipTypeCode={setSelectedEquipTypeCode} />
      </Box>

      {/* Right: Table */}
      <Box width="70%">
        <EquipTable selectedEquipTypeCode={selectedEquipTypeCode} />
      </Box>
    </Box>
  )
}
