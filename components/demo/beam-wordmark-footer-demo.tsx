"use client"

import BeamWordmarkFooter from "@/components/ui/beam-wordmark-footer"

export default function Demo() {
  return (
    <div className="w-full bg-[#02040b]">
      <BeamWordmarkFooter
        credits={[
          { lead: "Zephyr template by ", label: "Kedhar", href: "https://21st.dev/@kedhareswer" },
          { lead: "Part of ", label: "Night Shift", tail: " collection" },
        ]}
      />
    </div>
  )
}
