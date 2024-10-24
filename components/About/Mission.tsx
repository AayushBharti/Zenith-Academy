import { Award, GraduationCap, Users, Zap } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "../ui/badge"

export default function Mission() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Our Vision & Values
          </h2>
          <Badge variant="outline" className="mb-6">
            Shaping the Future of Education
          </Badge>
        </div>
        <Tabs defaultValue="mission" className="mt-12">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
            <TabsTrigger value="values">Core Values</TabsTrigger>
          </TabsList>
          <TabsContent value="mission" className="mt-8">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Empowering Global Learning</CardTitle>
                <CardDescription>
                  We&apos;re on a mission to democratize education and make
                  high-quality learning accessible to everyone, everywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our mission goes beyond just delivering courses online. We
                  wanted to create a vibrant community of learners, where
                  individuals can connect, collaborate, and learn from one
                  another. We believe that knowledge thrives in an environment
                  of sharing and dialogue, and we foster this spirit of
                  collaboration through forums, live sessions, and networking
                  opportunities.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="values" className="mt-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: "Community",
                  description: "Foster a supportive global learning network",
                },
                {
                  icon: GraduationCap,
                  title: "Excellence",
                  description: "Deliver world-class educational content",
                },
                {
                  icon: Zap,
                  title: "Innovation",
                  description: "Embrace cutting-edge learning technologies",
                },
                {
                  icon: Award,
                  title: "Accessibility",
                  description: "Make quality education available to all",
                },
              ].map((item, index) => (
                <div key={index}>
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <item.icon className="h-8 w-8 text-primary" />
                      <CardTitle className="mt-4">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
