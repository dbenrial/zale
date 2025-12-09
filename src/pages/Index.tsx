import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wind,
  AirVent,
  Wrench,
  Calendar,
  BarChart3,
  Shield,
  ChevronRight,
  Snowflake,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: AirVent,
      title: "Data AC Lengkap",
      description:
        "Kelola seluruh unit AC dengan informasi detail dan status real-time",
    },
    {
      icon: Wrench,
      title: "Tracking Maintenance",
      description: "Lacak riwayat perbaikan dan kerusakan setiap unit AC",
    },
    {
      icon: Snowflake,
      title: "Monitor Freon",
      description: "Pantau penggunaan dan penggantian freon secara akurat",
    },
    {
      icon: Calendar,
      title: "Jadwal Perawatan",
      description: "Atur jadwal maintenance untuk perawatan preventif",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description: "Visualisasi data dengan grafik dan metrik yang informatif",
    },
    {
      icon: Shield,
      title: "Sistem Aman",
      description: "Akses admin terproteksi dengan autentikasi yang aman",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />

        <nav className="relative container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Wind className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">AC Manajemen Sistem</span>
          </div>
          <Button variant="gradient" onClick={() => navigate("/login")}>
            Login Admin
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </nav>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary mb-6 animate-fade-in">
              <Snowflake className="w-4 h-4" />
              <span className="text-sm font-medium">
                Sistem Manajemen AC Modern
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
              Kelola Unit AC dengan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(18,100%,55%)] to-[hsl(82,78%,45%)]">
                Lebih Efisien
              </span>
            </h1>
            <p
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Sistem manajemen AC terintegrasi untuk monitoring, maintenance
              tracking, dan scheduling perawatan. Semua dalam satu platform yang
              mudah digunakan.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                variant="gradient"
                size="xl"
                onClick={() => navigate("/login")}
              >
                Mulai Sekarang
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline-primary"
                size="xl"
                onClick={() => navigate("/login")}
              >
                Lihat Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola unit AC dengan efektif
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-hero rounded-3xl p-8 md:p-12 text-primary-foreground">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "100+", label: "Unit AC" },
                { value: "50+", label: "Lokasi" },
                { value: "24/7", label: "Monitoring" },
                { value: "99%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Mengelola AC dengan Lebih Baik?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Login ke dashboard admin untuk mulai mengelola unit AC Anda
          </p>
          <Button
            variant="gradient"
            size="xl"
            onClick={() => navigate("/login")}
          >
            Login Sekarang
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Wind className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">AC Management Sistem</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Engineering-IR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
