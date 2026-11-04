"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroSummaryCard, CadastroSummaryGrid } from "@/components/tables/cadastro-summary-card"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"

interface Plano {
  id: number
  codigo: string
  nome: string
  segmentacao: string
  modalidade: string
  ativo: boolean
}

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([
    {
      id: 1,
      codigo: "001",
      nome: "Plano Básico Ambulatorial",
      segmentacao: "Ambulatorial",
      modalidade: "Individual",
      ativo: true,
    },
  ])

  const handleToggleStatus = (plano: Plano) => {
    setPlanos((current) => current.map((item) => (item.id === plano.id ? { ...item, ativo: !item.ativo } : item)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Planos</h1>
        <p className="text-muted-foreground">Crie e gerencie planos a partir dos produtos cadastrados.</p>
      </div>

      <CadastroSummaryGrid className="mb-6 xl:grid-cols-1">
        <CadastroSummaryCard
          title="Total de Planos"
          value={planos.length}
          description="planos cadastrados"
          metrics={[{ label: "Status", value: `${planos.filter((plano) => plano.ativo).length} ativos`, tone: "positive" }]}
        />
      </CadastroSummaryGrid>

      <Card>
        <CardHeader>
          <CardTitle>Planos cadastrados</CardTitle>
          <CardDescription>Busque, visualize e altere o status dos planos.</CardDescription>
        </CardHeader>
        <CardContent>
          <CadastroTable
            data={planos}
            getId={(plano) => plano.id}
            getSearchText={(plano) => `${plano.codigo} ${plano.nome} ${plano.segmentacao} ${plano.modalidade}`}
            isActive={(plano) => plano.ativo}
            searchPlaceholder="Buscar por código, nome, segmentação ou modalidade..."
            emptyMessage="Nenhum plano encontrado."
            columns={
              [
                {
                  key: "codigo",
                  header: "Código",
                  sortable: true,
                  render: (plano) => <Badge variant="outline" className="text-xs">{plano.codigo}</Badge>,
                },
                { key: "nome", header: "Nome do plano", sortable: true, className: "font-medium text-foreground" },
                { key: "segmentacao", header: "Segmentação", sortable: true },
                { key: "modalidade", header: "Modalidade", sortable: true },
              ] as CadastroColumn<Plano>[]
            }
            onToggleStatus={handleToggleStatus}
            detailsTitle={(plano) => plano.nome}
            renderDetails={(plano) => (
              <CadastroDetailsGrid>
                <CadastroDetailField label="Código" value={plano.codigo} />
                <CadastroDetailField label="Nome do plano" value={plano.nome} />
                <CadastroDetailField label="Segmentação" value={plano.segmentacao} />
                <CadastroDetailField label="Modalidade" value={plano.modalidade} />
                <CadastroDetailField label="Status" value={plano.ativo ? "Ativo" : "Inativo"} />
              </CadastroDetailsGrid>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
