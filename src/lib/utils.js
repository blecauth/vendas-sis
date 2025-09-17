import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatação de moeda
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Formatação de data
export function formatarData(data) {
  if (!data) return '';
  const dataObj = data instanceof Date ? data : new Date(data);
  return dataObj.toLocaleDateString('pt-BR');
}

// Formatação de data para input
export function formatarDataInput(data) {
  if (!data) return '';
  const dataObj = data instanceof Date ? data : new Date(data);
  return dataObj.toISOString().split('T')[0];
}

// Validação de dados
export function validarVenda(venda) {
  const erros = [];
  
  if (!venda.nomeComprador?.trim()) {
    erros.push('Nome do comprador é obrigatório');
  }
  
  if (!venda.quantidadeTrufas || venda.quantidadeTrufas <= 0) {
    erros.push('Quantidade de trufas deve ser maior que zero');
  }
  
  if (!venda.valorTotal || venda.valorTotal <= 0) {
    erros.push('Valor total deve ser maior que zero');
  }
  
  if (!venda.dataVenda) {
    erros.push('Data da venda é obrigatória');
  }
  
  return erros;
}

export function validarPagamento(pagamento) {
  const erros = [];
  
  if (!pagamento.valorPago || pagamento.valorPago <= 0) {
    erros.push('Valor do pagamento deve ser maior que zero');
  }
  
  if (!pagamento.dataPagamento) {
    erros.push('Data do pagamento é obrigatória');
  }
  
  return erros;
}
