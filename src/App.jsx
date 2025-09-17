import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { FormVenda } from '@/components/FormVenda';
import { ListaVendas } from '@/components/ListaVendas';
import { ResumoClientes } from '@/components/ResumoClientes';
import { RelatorioGeral } from '@/components/RelatorioGeral';
import { 
  getVendas, 
  getPagamentos, 
  salvarVenda, 
  excluirVenda,
  getResumoClientes,
  getRelatorioGeral
} from '@/lib/storage';
import './App.css';

function App() {
  const [vendas, setVendas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [relatorio, setRelatorio] = useState({
    totalVendas: 0,
    totalPago: 0,
    totalDevedor: 0,
    numClientes: 0,
    numVendas: 0
  });

  const carregarDados = () => {
    const vendasCarregadas = getVendas();
    const pagamentosCarregados = getPagamentos();
    
    setVendas(vendasCarregadas.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda)));
    setPagamentos(pagamentosCarregados);
    setClientes(getResumoClientes());
    setRelatorio(getRelatorioGeral());
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarVenda = async (dadosVenda) => {
    salvarVenda(dadosVenda);
    carregarDados();
  };

  const handleExcluirVenda = (vendaId) => {
    excluirVenda(vendaId);
    carregarDados();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Vendas a Fiado - Trufas
          </h1>
          <p className="text-gray-600">
            Sistema de controle de vendas e pagamentos
          </p>
        </div>

        <Tabs defaultValue="vendas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vendas" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="relatorio" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatório
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendas" className="space-y-6">
            <FormVenda onSalvar={handleSalvarVenda} />
            <ListaVendas
              vendas={vendas}
              pagamentos={pagamentos}
              onAtualizarVendas={carregarDados}
              onExcluirVenda={handleExcluirVenda}
            />
          </TabsContent>

          <TabsContent value="clientes">
            <ResumoClientes clientes={clientes} />
          </TabsContent>

          <TabsContent value="relatorio">
            <RelatorioGeral relatorio={relatorio} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
