import HomeStatic from "@/components/home/HomeStatic";
import { works } from "@/lib/works";

export default function Page() {
  return <HomeStatic works={works} />;
}
