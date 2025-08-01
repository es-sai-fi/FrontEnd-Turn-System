import { useEffect, useState } from 'react';
import { getGlobalStats } from '../api/placeStats';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#4ade80', '#60a5fa', '#f87171', '#facc15', '#a78bfa'];

export default function PlaceStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStats();
        setStats(data);
      } catch (err) {
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

const demographicData = stats.userDemographics
  ? [
      {
        name: 'Adultos mayores',
        value: stats.userDemographics.older_adults_attended || 0,
      },
      {
        name: 'Con discapacidad',
        value: stats.userDemographics.discapacity_attended || 0,
      },
      {
        name: 'Usuarios normales',
        value: stats.userDemographics.normal_attended || 0,
      }
    ]
  : [];

const priorityData = stats.priorityDistribution
  ? [
      {
        name: 'Prioridad Alta',
        value: stats.priorityDistribution.h_priority_attended || 0,
      },
      {
        name: 'Prioridad Media',
        value: stats.priorityDistribution.m_priority_attended || 0,
      },
      {
        name: 'Prioridad Baja',
        value: stats.priorityDistribution.l_priority_attended || 0,
      }
    ]
  : [];


  const barData = stats.placeStatistics.map(place => ({
    name: place.place_name,
    Atendidos: place.attended_turn_count,
    Activos: place.active_turn_count,
    Cancelados: place.canceled_turn_count,
  }));

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Estadísticas Globales</h1>

      {/* 1️⃣ Demografía */}
      <section className="chart-section">
        <h2 className="chart-title">Demografía de Usuarios Atendidos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={demographicData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {demographicData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 2️⃣ Prioridad */}
      <section className="chart-section">
        <h2 className="chart-title">Distribución por Prioridad</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {priorityData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 3️⃣ Estadísticas por Puesto */}
      <section className="chart-section">
        <h2 className="chart-title">Estadísticas por Puesto</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Atendidos" fill="#4ade80" />
            <Bar dataKey="Activos" fill="#60a5fa" />
            <Bar dataKey="Cancelados" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
