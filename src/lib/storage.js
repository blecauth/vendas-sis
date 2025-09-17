// Funções para gerenciar dados localmente
export const STORAGE_KEYS = {
  VENDAS: 'vendas_fiado_vendas',
  PAGAMENTOS: 'vendas_fiado_pagamentos',
  NEXT_ID: 'vendas_fiado_next_id'
};

// Gerar próximo ID
export function getNextId() {
  const currentId = parseInt(localStorage.getItem(STORAGE_KEYS.NEXT_ID) || '1');
  localStorage.setItem(STORAGE_KEYS.NEXT_ID, (currentId + 1).toString());
  return currentId;
}

// Funções para vendas
export function getVendas() {
  try {
    const vendas = JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]');
    return vendas.map(venda => ({
      ...venda,
      dataVenda: new Date(venda.dataVenda)
    }));
  } catch (error) {
    console.error('Erro ao carregar vendas:', error);
    return [];
  }
}

export function salvarVenda(venda) {
  try {
    const vendas = getVendas();
    const novaVenda = {
      ...venda,
      id: getNextId(),
      dataVenda: new Date(venda.dataVenda)
    };
    vendas.push(novaVenda);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(vendas));
    return novaVenda;
  } catch (error) {
    console.error('Erro ao salvar venda:', error);
    throw error;
  }
}

export function atualizarVenda(id, dadosAtualizados) {
  try {
    const vendas = getVendas();
    const index = vendas.findIndex(v => v.id === id);
    if (index !== -1) {
      vendas[index] = { ...vendas[index], ...dadosAtualizados };
      localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(vendas));
      return vendas[index];
    }
    throw new Error('Venda não encontrada');
  } catch (error) {
    console.error('Erro ao atualizar venda:', error);
    throw error;
  }
}

export function excluirVenda(id) {
  try {
    const vendas = getVendas();
    const vendasFiltradas = vendas.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(vendasFiltradas));
    
    // Também excluir pagamentos relacionados
    const pagamentos = getPagamentos();
    const pagamentosFiltrados = pagamentos.filter(p => p.vendaId !== id);
    localStorage.setItem(STORAGE_KEYS.PAGAMENTOS, JSON.stringify(pagamentosFiltrados));
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    throw error;
  }
}

// Funções para pagamentos
export function getPagamentos() {
  try {
    const pagamentos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGAMENTOS) || '[]');
    return pagamentos.map(pagamento => ({
      ...pagamento,
      dataPagamento: new Date(pagamento.dataPagamento)
    }));
  } catch (error) {
    console.error('Erro ao carregar pagamentos:', error);
    return [];
  }
}

export function salvarPagamento(pagamento) {
  try {
    const pagamentos = getPagamentos();
    const novoPagamento = {
      ...pagamento,
      id: getNextId(),
      dataPagamento: new Date(pagamento.dataPagamento)
    };
    pagamentos.push(novoPagamento);
    localStorage.setItem(STORAGE_KEYS.PAGAMENTOS, JSON.stringify(pagamentos));
    return novoPagamento;
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error);
    throw error;
  }
}

export function excluirPagamento(id) {
  try {
    const pagamentos = getPagamentos();
    const pagamentosFiltrados = pagamentos.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAGAMENTOS, JSON.stringify(pagamentosFiltrados));
  } catch (error) {
    console.error('Erro ao excluir pagamento:', error);
    throw error;
  }
}

// Funções de relatório
export function getResumoClientes() {
  const vendas = getVendas();
  const pagamentos = getPagamentos();
  
  const clientesMap = new Map();
  
  // Processar vendas
  vendas.forEach(venda => {
    if (!clientesMap.has(venda.nomeComprador)) {
      clientesMap.set(venda.nomeComprador, {
        nome: venda.nomeComprador,
        totalVendas: 0,
        totalPago: 0,
        numVendas: 0
      });
    }
    
    const cliente = clientesMap.get(venda.nomeComprador);
    cliente.totalVendas += venda.valorTotal;
    cliente.numVendas += 1;
  });
  
  // Processar pagamentos
  pagamentos.forEach(pagamento => {
    const venda = vendas.find(v => v.id === pagamento.vendaId);
    if (venda && clientesMap.has(venda.nomeComprador)) {
      const cliente = clientesMap.get(venda.nomeComprador);
      cliente.totalPago += pagamento.valorPago;
    }
  });
  
  // Calcular saldo devedor
  const clientes = Array.from(clientesMap.values()).map(cliente => ({
    ...cliente,
    saldoDevedor: cliente.totalVendas - cliente.totalPago
  }));
  
  // Ordenar por saldo devedor (maior primeiro)
  return clientes.sort((a, b) => b.saldoDevedor - a.saldoDevedor);
}

export function getRelatorioGeral() {
  const vendas = getVendas();
  const pagamentos = getPagamentos();
  
  const totalVendas = vendas.reduce((sum, venda) => sum + venda.valorTotal, 0);
  const totalPago = pagamentos.reduce((sum, pagamento) => sum + pagamento.valorPago, 0);
  const totalDevedor = totalVendas - totalPago;
  
  const clientesUnicos = new Set(vendas.map(v => v.nomeComprador));
  
  return {
    totalVendas,
    totalPago,
    totalDevedor,
    numClientes: clientesUnicos.size,
    numVendas: vendas.length
  };
}

// Função para obter vendas de um cliente específico
export function getVendasCliente(nomeCliente) {
  const vendas = getVendas().filter(v => v.nomeComprador === nomeCliente);
  const pagamentos = getPagamentos();
  
  return vendas.map(venda => {
    const pagamentosVenda = pagamentos.filter(p => p.vendaId === venda.id);
    const totalPago = pagamentosVenda.reduce((sum, p) => sum + p.valorPago, 0);
    
    return {
      ...venda,
      pagamentos: pagamentosVenda,
      totalPago,
      saldoDevedor: venda.valorTotal - totalPago
    };
  });
}

