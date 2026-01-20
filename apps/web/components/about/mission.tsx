import { Award, GraduationCap, Users, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "../ui/badge";

export default function Mission() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Our Vision & Values
          </h2>
          <Badge className="mb-6" variant="outline">
            Shaping the Future of Education
          </Badge>
        </div>
        <Tabs className="mt-12" defaultValue="values">
          <TabsList className="mx-auto grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="values">Core Values</TabsTrigger>
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-8" value="mission">
            <Card className="mx-auto max-w-3xl">
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
          <TabsContent className="mt-8" value="values">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <Card className="h-full border-primary/10 bg-card/50 backdrop-blur-xs transition-colors hover:border-primary/30">
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
  );
}
