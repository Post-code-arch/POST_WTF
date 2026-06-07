import HomePage from "@/components/home/HomePage";
import { works } from "@/lib/works";

export default function Page() {
  return <HomePage works={works} />;
}
