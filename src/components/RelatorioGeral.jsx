import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, AlertTriangle, Users, ShoppingCart } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils';

export function RelatorioGeral({ relatorio }) {
  const cards = [
    {
      title: 'Total de Vendas',
      value: formatarMoeda(relatorio.totalVendas),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Recebido',
      value: formatarMoeda(relatorio.totalPago),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total a Receber',
      value: formatarMoeda(relatorio.totalDevedor),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Clientes',
      value: relatorio.numClientes.toString(),
      subtitle: `${relatorio.numVendas} vendas`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Relatório Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            
            return (
              <div
                key={card.title}
                className={`${card.bgColor} rounded-lg p-4 space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className={`text-lg font-bold ${card.color}`}>
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

