import { GraduationCap, Star, Users, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "../ui/badge";

export default function Statistics() {
  return (
    <div>
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-32">
        <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-dark opacity-50" />
        <div className="container relative z-10 mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Our Global Impact
            </h2>
            <Badge className="mb-6" variant="secondary">
              Transforming Lives Through Education
            </Badge>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: 1_000_000, label: "Active Learners", icon: Users },
              {
                number: 500,
                label: "Cutting-edge Courses",
                icon: GraduationCap,
              },
              { number: 50, label: "Industry Experts", icon: Star },
              { number: 190, label: "Countries Reached", icon: Zap },
            ].map((stat, index) => (
              <div key={index}>
                <Card className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-xs">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="mx-auto mb-4 h-8 w-8" />
                    <div className="mb-2 font-bold text-4xl">{stat.number}</div>
                    <p className="text-xl opacity-80">{stat.label}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
