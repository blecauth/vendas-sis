import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { formatarDataInput, validarVenda } from '@/lib/utils';

export function FormVenda({ onSalvar }) {
  const [formData, setFormData] = useState({
    nomeComprador: '',
    quantidadeTrufas: '',
    valorTotal: '',
    dataVenda: formatarDataInput(new Date()),
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
    
    const dadosVenda = {
      ...formData,
      quantidadeTrufas: parseInt(formData.quantidadeTrufas),
      valorTotal: parseFloat(formData.valorTotal)
    };
    
    const errosValidacao = validarVenda(dadosVenda);
    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }
    
    setSalvando(true);
    try {
      await onSalvar(dadosVenda);
      setFormData({
        nomeComprador: '',
        quantidadeTrufas: '',
        valorTotal: '',
        dataVenda: formatarDataInput(new Date()),
        observacoes: ''
      });
      setErros([]);
    } catch (error) {
      setErros(['Erro ao salvar venda: ' + error.message]);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nova Venda
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="nomeComprador">Nome do Comprador</Label>
            <Input
              id="nomeComprador"
              value={formData.nomeComprador}
              onChange={(e) => handleChange('nomeComprador', e.target.value)}
              placeholder="Digite o nome do comprador"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidadeTrufas">Quantidade de Trufas</Label>
              <Input
                id="quantidadeTrufas"
                type="number"
                min="1"
                value={formData.quantidadeTrufas}
                onChange={(e) => handleChange('quantidadeTrufas', e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorTotal">Valor Total (R$)</Label>
              <Input
                id="valorTotal"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorTotal}
                onChange={(e) => handleChange('valorTotal', e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataVenda">Data da Venda</Label>
            <Input
              id="dataVenda"
              type="date"
              value={formData.dataVenda}
              onChange={(e) => handleChange('dataVenda', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações sobre a venda (opcional)"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Registrar Venda'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

