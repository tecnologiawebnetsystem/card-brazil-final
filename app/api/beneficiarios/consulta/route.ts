import { type NextRequest, NextResponse } from "next/server"
import { mockBeneficiarios, mockDependentes, mockPessoas, mockEnderecos, mockDadosBancarios, mockContratos, mockPlanos, mockOperadoras } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cpf = searchParams.get("cpf")
    const nome = searchParams.get("nome")
    const email = searchParams.get("email")
    const id = searchParams.get("id")

    if (!cpf && !nome && !email && !id) {
      return NextResponse.json(
        { success: false, message: "Informe pelo menos um critério de busca (cpf, nome, email ou id)" },
        { status: 400 },
      )
    }

    // Combinar titulares e dependentes
    const todosBeneficiarios = [...mockBeneficiarios, ...mockDependentes]
    
    let resultado = todosBeneficiarios

    if (id) {
      resultado = resultado.filter(b => b.id === Number.parseInt(id))
    }

    if (cpf) {
      resultado = resultado.filter(b => b.cpf?.replace(/\D/g, '').includes(cpf.replace(/\D/g, '')))
    }

    if (nome) {
      const nomeLower = nome.toLowerCase()
      resultado = resultado.filter(b => b.nome?.toLowerCase().includes(nomeLower))
    }

    if (email) {
      const emailLower = email.toLowerCase()
      resultado = resultado.filter(b => b.email?.toLowerCase().includes(emailLower))
    }

    // Enriquecer dados dos beneficiários encontrados
    const resultadoEnriquecido = resultado.map(beneficiario => {
      // Buscar pessoa
      const pessoa = mockPessoas.find(p => p.id === beneficiario.pessoa_id)
      
      // Buscar endereço
      const endereco = pessoa ? mockEnderecos.find(e => e.pessoa_id === pessoa.id) : null
      
      // Buscar dados bancários
      const dadosBancarios = pessoa ? mockDadosBancarios.find(d => d.pessoa_id === pessoa.id) : null
      
      // Buscar dependentes (se for titular)
      const dependentes = beneficiario.tipo_beneficiario === "titular" 
        ? mockDependentes.filter(d => d.beneficiario_titular_id === beneficiario.id)
        : null
      
      // Buscar titular (se for dependente)
      const titular = beneficiario.tipo_beneficiario === "dependente"
        ? mockBeneficiarios.find(t => t.id === beneficiario.beneficiario_titular_id)
        : null

      // Buscar plano
      const plano = mockPlanos.find(p => p.id === beneficiario.plano_id)
      
      // Buscar operadora
      const operadora = mockOperadoras.find(o => o.id === beneficiario.operadora_id)

      return {
        ...beneficiario,
        pessoa: pessoa ? {
          nome_completo: pessoa.nome_completo,
          cpf: pessoa.cpf,
          rg: pessoa.rg,
          data_nascimento: pessoa.data_nascimento,
          sexo: pessoa.sexo,
          estado_civil: pessoa.estado_civil,
          profissao: pessoa.profissao,
          renda_mensal: pessoa.renda_mensal,
        } : null,
        endereco: endereco ? {
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
          cep: endereco.cep,
        } : null,
        dados_bancarios: dadosBancarios ? {
          banco_nome: dadosBancarios.banco_nome,
          agencia: dadosBancarios.agencia,
          conta: dadosBancarios.conta,
          tipo_conta: dadosBancarios.tipo_conta,
          pix_chave: dadosBancarios.pix_chave,
        } : null,
        plano: plano ? {
          nome: plano.nome,
          codigo: plano.codigo,
          valor_mensalidade: plano.valor_mensalidade,
        } : null,
        operadora: operadora ? {
          nome: operadora.nome,
          registro_ans: operadora.registro_ans,
        } : null,
        dependentes: dependentes ? dependentes.map(d => ({
          id: d.id,
          nome: d.nome,
          cpf: d.cpf,
          parentesco: d.parentesco,
          data_nascimento: d.data_nascimento,
          status: d.status,
        })) : null,
        titular: titular ? {
          id: titular.id,
          nome: titular.nome,
          cpf: titular.cpf,
        } : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: resultadoEnriquecido,
      count: resultadoEnriquecido.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao consultar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao consultar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
