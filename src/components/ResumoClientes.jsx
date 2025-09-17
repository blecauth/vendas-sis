import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils';

export function ResumoClientes({ clientes }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Resumo por Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clientes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum cliente encontrado.
          </p>
        ) : (
          <div className="space-y-3">
            {clientes.map((cliente) => {
              const isPago = cliente.saldoDevedor <= 0;
              
              return (
                <div
                  key={cliente.nome}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{cliente.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {cliente.numVendas} venda{cliente.numVendas !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge variant={isPago ? "default" : "destructive"}>
                      {isPago ? "Em dia" : "Devendo"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Total Vendas:</span>
                      <p className="font-medium">{formatarMoeda(cliente.totalVendas)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Pago:</span>
                      <p className="font-medium text-green-600">{formatarMoeda(cliente.totalPago)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Saldo:</span>
                      <p className={`font-medium ${isPago ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(cliente.saldoDevedor)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

