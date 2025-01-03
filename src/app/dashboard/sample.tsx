"use client"

import { dashboardSelectedAtom } from "@/atom/dashboardAtom"
import { TopTable } from "@/components/dashboard/TopTable"
import { ClickHouseQuerySample, PostgresQuerySample } from "@/components/sample/Sample"
import { useContextPath } from "@/config/Providers"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(dashboardSelectedAtom)
  const contextPath = useContextPath()

  return (
    <div>
      <h1>대시보드</h1>
      <TopTable />
      <iframe
        width="100%"
        height="600"
        title="서버자원 모니터링"
        src={`${
          contextPath
        }/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
        // src={`${
        //   contextPath
        // }/grafana/d/ae0yw793f2800a/new-dashboard?orgId=1&from=1729567451243&to=1729589051243&refresh=auto&kiosk${selected}`}
        // src={`grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}`}
        // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
      />
      <div>
        <h2>데이터베이스 통계</h2>
        <PostgresQuerySample />
        <ClickHouseQuerySample />
        {/* <MariaDBQuerySample /> */}
      </div>
    </div>
  )
}
