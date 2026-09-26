export const sampleWorkbooks = [
  {
    name: "New client intake",
    status: "Draft",
    updated: "Sample",
    owner: "Sample studio",
  },
  {
    name: "Week one reflection",
    status: "Draft",
    updated: "Sample",
    owner: "Sample studio",
  },
  {
    name: "Offer workshop",
    status: "Published",
    updated: "Sample",
    owner: "Sample studio",
  },
] as const;

export const sampleCounts = [
  { label: "Drafts", value: "2", note: "Sample count" },
  { label: "Published links", value: "0", note: "Nothing is live" },
  { label: "Opens", value: "—", note: "No analytics yet" },
] as const;
