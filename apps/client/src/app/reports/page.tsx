"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = [
  { name: 'Week 1', traffic: 4000, leads: 24 },
  { name: 'Week 2', traffic: 4500, leads: 28 },
  { name: 'Week 3', traffic: 5100, leads: 35 },
  { name: 'Week 4', traffic: 6800, leads: 42 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Performance Reports
          </h1>
          <p className="text-sm text-gray-400">Analytics and ROI tracking across your active campaigns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center text-center p-8 space-y-2">
          <div className="text-gray-400 text-sm font-medium">Total Traffic (30d)</div>
          <div className="text-4xl font-heading font-bold text-white">20.4K</div>
          <div className="text-green-400 text-xs font-medium flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% vs last month
          </div>
        </Card>
        
        <Card className="flex flex-col justify-center text-center p-8 space-y-2">
          <div className="text-gray-400 text-sm font-medium">Total Leads (30d)</div>
          <div className="text-4xl font-heading font-bold text-white">129</div>
          <div className="text-green-400 text-xs font-medium flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.2% vs last month
          </div>
        </Card>

        <Card className="flex flex-col justify-center text-center p-8 space-y-2">
          <div className="text-gray-400 text-sm font-medium">Conversion Rate</div>
          <div className="text-4xl font-heading font-bold text-white">3.4%</div>
          <div className="text-gray-400 text-xs font-medium flex items-center justify-center gap-1">
            Steady
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Website Traffic Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Lead Generation</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#FF8C1A" strokeWidth={3} dot={{ r: 4, fill: '#FF8C1A', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
