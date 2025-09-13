import { GraduationCap, Star, Users, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { Badge } from "../ui/badge"

export default function Statistics() {
  return (
    <div>
      <section className="py-20 sm:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-50" />
        <div className="mx-auto container px-5 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Global Impact
            </h2>
            <Badge variant="secondary" className="mb-6">
              Transforming Lives Through Education
            </Badge>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: 1000000, label: "Active Learners", icon: Users },
              {
                number: 500,
                label: "Cutting-edge Courses",
                icon: GraduationCap,
              },
              { number: 50, label: "Industry Experts", icon: Star },
              { number: 190, label: "Countries Reached", icon: Zap },
            ].map((stat, index) => (
              <div key={index}>
                <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-4" />
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <p className="text-xl opacity-80">{stat.label}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
