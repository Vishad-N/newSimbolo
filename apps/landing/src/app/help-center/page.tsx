import { HelpCenterPage } from "@/components/helpCenter/HelpCenterPage";
import { fetchMappedFaqs } from "@/lib/content-mapper";

export const dynamic = "force-dynamic";

export default async function Page() {
  const liveFaqs = await fetchMappedFaqs([]);
  return <HelpCenterPage liveFaqs={liveFaqs} />;
}
