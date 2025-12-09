import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  GraduationCap,
  Code,
  Mail,
  Github,
  Linkedin,
  Database,
  Server,
  Palette,
  Wrench,
  Wind,
} from "lucide-react";

const AboutPage = () => {
  const skills = [
    { name: "React.js", icon: Code },
    { name: "TypeScript", icon: Code },
    { name: "Database", icon: Database },
    { name: "Backend", icon: Server },
    { name: "UI/UX", icon: Palette },
    { name: "Maintenance", icon: Wrench },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="h-32 gradient-hero" />
        <CardContent className="relative pt-0 pb-8">
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center">
              <User className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="ml-44 pt-4">
            <h1 className="text-3xl font-bold">Chaerul Rizal</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Management Informatika
            </p>
            <div className="flex gap-2 mt-4">
              <Badge
                variant="secondary"
                className="gradient-primary text-primary-foreground"
              >
                <Wind className="w-3 h-3 mr-1" /> AC System Admin
              </Badge>
              <Badge variant="outline">Developer</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Tentang Saya
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Saya adalah seorang Management Informatika yang memiliki passion
              dalam pengembangan sistem informasi dan teknologi. Saat ini fokus
              dalam mengembangkan aplikasi manajemen aset khususnya sistem
              pengelolaan unit AC untuk meningkatkan efisiensi operasional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Pendidikan
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">
                  Management Informatika & Cyber Security
                </h3>
                <p className="text-sm text-muted-foreground">Diploma / S1</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fokus pada pengembangan sistem informasi dan manajemen
                  database
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Keahlian
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-muted rounded-xl text-center hover:bg-primary/10 hover:scale-105 transition-all duration-300 cursor-default"
              >
                <skill.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">{skill.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-primary" />
            Proyek Utama
          </h2>
          <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Wind className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AC Management System</h3>
                <p className="text-muted-foreground mt-1">
                  Sistem pengelolaan data unit AC yang komprehensif dengan fitur
                  tracking maintenance, monitoring status, dan manajemen jadwal
                  perbaikan.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge>React.js</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>Recharts</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Kontak
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="outline" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Button variant="outline" className="gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pb-8">
        <p>© 2025 Engineering-IR</p>
        <p className="mt-1">Built with React, TypeScript & Tailwind CSS</p>
      </div>
    </div>
  );
};

export default AboutPage;
