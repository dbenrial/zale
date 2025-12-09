import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getACData, getMaintenanceData, getScheduleData, getFreonData } from '@/lib/store';
import { AirVent, Wrench, Calendar, CheckCircle, AlertCircle, Snowflake, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalAC: 0,
    acGood: 0,
    acBroken: 0,
    totalMaintenance: 0,
    scheduleUpcoming: 0,
    totalFreon: 0,
  });

  const [freonByType, setFreonByType] = useState<{ name: string; value: number }[]>([]);
  const [maintenanceByMonth, setMaintenanceByMonth] = useState<{ month: string; count: number }[]>([]);
  const [freonUsage, setFreonUsage] = useState<{ month: string; kg: number }[]>([]);

  useEffect(() => {
    const acData = getACData();
    const maintenanceData = getMaintenanceData();
    const scheduleData = getScheduleData();
    const freonData = getFreonData();

    setStats({
      totalAC: acData.length,
      acGood: acData.filter(ac => ac.status === 'good').length,
      acBroken: acData.filter(ac => ac.status === 'broken').length,
      totalMaintenance: maintenanceData.length,
      scheduleUpcoming: scheduleData.filter(s => s.duration === 'Schedule').length,
      totalFreon: freonData.reduce((sum, f) => sum + f.kg, 0),
    });

    // Freon distribution
    const freonCounts = acData.reduce((acc, ac) => {
      acc[ac.freon] = (acc[ac.freon] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setFreonByType(Object.entries(freonCounts).map(([name, value]) => ({ name, value })));

    // Maintenance by month (mock data)
    setMaintenanceByMonth([
      { month: 'Jul', count: 5 },
      { month: 'Aug', count: 8 },
      { month: 'Sep', count: 6 },
      { month: 'Oct', count: 10 },
      { month: 'Nov', count: 7 },
      { month: 'Dec', count: 4 },
    ]);

    // Freon usage trend
    setFreonUsage([
      { month: 'Jul', kg: 3.5 },
      { month: 'Aug', kg: 2.0 },
      { month: 'Sep', kg: 4.5 },
      { month: 'Oct', kg: 3.0 },
      { month: 'Nov', kg: 6.5 },
      { month: 'Dec', kg: 2.5 },
    ]);
  }, []);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))'];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang di AC Management System</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Unit AC"
          value={stats.totalAC}
          icon={<AirVent className="w-6 h-6" />}
          variant="primary"
          subtitle="Unit terdaftar"
        />
        <MetricCard
          title="AC Bagus"
          value={stats.acGood}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="AC Rusak"
          value={stats.acBroken}
          icon={<AlertCircle className="w-6 h-6" />}
          variant="destructive"
        />
        <MetricCard
          title="Maintenance"
          value={stats.totalMaintenance}
          icon={<Wrench className="w-6 h-6" />}
          variant="warning"
          subtitle="Total perbaikan"
        />
        <MetricCard
          title="Jadwal Mendatang"
          value={stats.scheduleUpcoming}
          icon={<Calendar className="w-6 h-6" />}
          variant="secondary"
        />
        <MetricCard
          title="Total Freon"
          value={`${stats.totalFreon.toFixed(1)} kg`}
          icon={<Snowflake className="w-6 h-6" />}
          variant="default"
          subtitle="Penggunaan total"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Freon Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-primary" />
              Tipe Freon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={freonByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {freonByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Maintenance per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Freon Usage Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trend Penggunaan Freon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={freonUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kg" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AC Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AirVent className="w-5 h-5 text-primary" />
            Status AC Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-secondary transition-all duration-500"
                  style={{ width: `${(stats.acGood / stats.totalAC) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span>Bagus: {stats.acGood}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive" />
                <span>Rusak: {stats.acBroken}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
