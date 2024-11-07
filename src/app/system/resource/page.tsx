"use client"

import { grafanaServerResourceParamAtom } from "@/atom/dashboardAtom"
import { ResourceOption } from "@/components/dashboard/ResourceOption"
import { useContextPath } from "@/config/Providers"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerResourceParamAtom)
  const contextPath = useContextPath()
  console.log(selected)
  return (
    <div>
      <h1>서버자원관리</h1>
      <div style={{ width: 50, height: 20 }} />
      <ResourceOption />
      <div style={{ width: 50, height: 20 }} />
      <iframe
        width="100%"
        height="600"
        title="서버자원 모니터링"
        src={`${
          contextPath
        }/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
        // src={`${contextPath}/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
        /// grafana/d/ae0yw793f2800a/new-dashboard?orgId=1&from=1729567451243&to=1729589051243&refresh=auto&kiosk
        // grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}
        // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
      />
    </div>
  )
}