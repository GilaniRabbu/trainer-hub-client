import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JoinProviderSection() {
  return (
    <section className="w-full py-10 px-4">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
          Join As A Service Provider
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
          Connect with thousands of clients looking for your expertise. Grow
          your business with our trusted platform designed for professionals
          like you.
        </p>
        <div className="pt-2">
          <Button size="lg" className="text-base">
            <Link href="/signup">Join Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
