import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatarMoeda, formatarData } from '@/lib/utils';

export function ModalDetalhes({ venda, pagamentos, aberto, onFechar }) {
  const totalPago = pagamentos.reduce((sum, p) => sum + p.valorPago, 0);
  const saldoDevedor = venda.valorTotal - totalPago;
  const isPago = saldoDevedor <= 0;

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações da Venda */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Informações da Venda</h3>
              <Badge variant={isPago ? "default" : "destructive"}>
                {isPago ? "Pago" : "Pendente"}
              </Badge>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cliente:</span>
                <span className="font-medium">{venda.nomeComprador}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data da Venda:</span>
                <span className="font-medium">{formatarData(venda.dataVenda)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantidade:</span>
                <span className="font-medium">{venda.quantidadeTrufas} trufas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Valor Total:</span>
                <span className="font-medium">{formatarMoeda(venda.valorTotal)}</span>
              </div>
              {venda.observacoes && (
                <div>
                  <span className="text-sm text-gray-600">Observações:</span>
                  <p className="text-sm mt-1">{venda.observacoes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-3">
            <h3 className="font-medium">Resumo Financeiro</h3>
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total da Venda:</span>
                <span className="font-medium">{formatarMoeda(venda.valorTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pago:</span>
                <span className="font-medium text-green-600">{formatarMoeda(totalPago)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-gray-600">Saldo Devedor:</span>
                <span className={`font-medium ${isPago ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(saldoDevedor)}
                </span>
              </div>
            </div>
          </div>

          {/* Histórico de Pagamentos */}
          {pagamentos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Histórico de Pagamentos</h3>
              <div className="space-y-2">
                {pagamentos.map((pagamento) => (
                  <div key={pagamento.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-600">
                          {formatarMoeda(pagamento.valorPago)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatarData(pagamento.dataPagamento)}
                        </p>
                        {pagamento.observacoes && (
                          <p className="text-sm text-gray-500 mt-1">
                            {pagamento.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

