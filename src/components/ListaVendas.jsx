import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Eye, Trash2, RefreshCw } from 'lucide-react';
import { formatarMoeda, formatarData } from '@/lib/utils';
import { ModalPagamento } from './ModalPagamento';
import { ModalDetalhes } from './ModalDetalhes';

export function ListaVendas({ vendas, pagamentos, onAtualizarVendas, onExcluirVenda }) {
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);

  const calcularSaldoVenda = (venda) => {
    const pagamentosVenda = pagamentos.filter(p => p.vendaId === venda.id);
    const totalPago = pagamentosVenda.reduce((sum, p) => sum + p.valorPago, 0);
    return {
      totalPago,
      saldoDevedor: venda.valorTotal - totalPago
    };
  };

  const abrirModalPagamento = (venda) => {
    setVendaSelecionada(venda);
    setModalPagamentoAberto(true);
  };

  const abrirModalDetalhes = (venda) => {
    setVendaSelecionada(venda);
    setModalDetalhesAberto(true);
  };

  const confirmarExclusao = (venda) => {
    if (window.confirm(`Tem certeza que deseja excluir a venda de ${venda.nomeComprador}? Esta ação não pode ser desfeita.`)) {
      onExcluirVenda(venda.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendas Recentes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onAtualizarVendas}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {vendas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma venda registrada ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {vendas.map((venda) => {
                const { totalPago, saldoDevedor } = calcularSaldoVenda(venda);
                const isPago = saldoDevedor <= 0;
                
                return (
                  <div
                    key={venda.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{venda.nomeComprador}</h3>
                        <p className="text-sm text-gray-600">
                          {formatarData(venda.dataVenda)} • {venda.quantidadeTrufas} trufas
                        </p>
                        {venda.observacoes && (
                          <p className="text-sm text-gray-500 mt-1">
                            {venda.observacoes}
                          </p>
                        )}
                      </div>
                      <Badge variant={isPago ? "default" : "destructive"}>
                        {isPago ? "Pago" : "Pendente"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <p className="font-medium">{formatarMoeda(venda.valorTotal)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pago:</span>
                        <p className="font-medium text-green-600">{formatarMoeda(totalPago)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Saldo:</span>
                        <p className={`font-medium ${isPago ? 'text-green-600' : 'text-red-600'}`}>
                          {formatarMoeda(saldoDevedor)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirModalPagamento(venda)}
                        disabled={isPago}
                        className="flex-1"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pagamento
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirModalDetalhes(venda)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmarExclusao(venda)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {vendaSelecionada && (
        <>
          <ModalPagamento
            venda={vendaSelecionada}
            pagamentos={pagamentos.filter(p => p.vendaId === vendaSelecionada.id)}
            aberto={modalPagamentoAberto}
            onFechar={() => {
              setModalPagamentoAberto(false);
              setVendaSelecionada(null);
            }}
            onSalvar={() => {
              onAtualizarVendas();
              setModalPagamentoAberto(false);
              setVendaSelecionada(null);
            }}
          />
          
          <ModalDetalhes
            venda={vendaSelecionada}
            pagamentos={pagamentos.filter(p => p.vendaId === vendaSelecionada.id)}
            aberto={modalDetalhesAberto}
            onFechar={() => {
              setModalDetalhesAberto(false);
              setVendaSelecionada(null);
            }}
          />
        </>
      )}
    </>
  );
}

