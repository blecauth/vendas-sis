import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatarMoeda, formatarDataInput, validarPagamento } from '@/lib/utils';
import { salvarPagamento } from '@/lib/storage';

export function ModalPagamento({ venda, pagamentos, aberto, onFechar, onSalvar }) {
  const totalPago = pagamentos.reduce((sum, p) => sum + p.valorPago, 0);
  const saldoDevedor = venda.valorTotal - totalPago;
  
  const [formData, setFormData] = useState({
    valorPago: saldoDevedor.toString(),
    dataPagamento: formatarDataInput(new Date()),
    observacoes: ''
  });
  
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (erros.length > 0) {
      setErros([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dadosPagamento = {
      ...formData,
      valorPago: parseFloat(formData.valorPago),
      vendaId: venda.id
    };
    
    const errosValidacao = validarPagamento(dadosPagamento);
    
    // Verificar se o valor não excede o saldo devedor
    if (dadosPagamento.valorPago > saldoDevedor) {
      errosValidacao.push(`Valor do pagamento não pode ser maior que o saldo devedor (${formatarMoeda(saldoDevedor)})`);
    }
    
    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }
    
    setSalvando(true);
    try {
      salvarPagamento(dadosPagamento);
      onSalvar();
    } catch (error) {
      setErros(['Erro ao salvar pagamento: ' + error.message]);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cliente:</span>
              <span className="font-medium">{venda.nomeComprador}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Valor da Venda:</span>
              <span className="font-medium">{formatarMoeda(venda.valorTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Já Pago:</span>
              <span className="font-medium text-green-600">{formatarMoeda(totalPago)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm text-gray-600">Saldo Devedor:</span>
              <span className="font-medium text-red-600">{formatarMoeda(saldoDevedor)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {erros.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <ul className="text-red-700 text-sm space-y-1">
                  {erros.map((erro, index) => (
                    <li key={index}>• {erro}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="valorPago">Valor do Pagamento (R$)</Label>
              <Input
                id="valorPago"
                type="number"
                step="0.01"
                min="0"
                max={saldoDevedor}
                value={formData.valorPago}
                onChange={(e) => handleChange('valorPago', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataPagamento">Data do Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={formData.dataPagamento}
                onChange={(e) => handleChange('dataPagamento', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoesPagamento">Observações</Label>
              <Textarea
                id="observacoesPagamento"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Observações sobre o pagamento (opcional)"
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onFechar} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando} className="flex-1">
                {salvando ? 'Salvando...' : 'Registrar Pagamento'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

