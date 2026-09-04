"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"

interface PlanoSaude {
  id: number
  codigo: string
  nome: string
  segmentacao: string
  modalidade: string
  ativo: boolean
}

export default function PlanosSaudePage() {
  const [planos, setPlanos] = useState<PlanoSaude[]>([
    {
      id: 1,
      codigo: "001",
      nome: "Plano Básico Ambulatorial",
      segmentacao: "Ambulatorial",
      modalidade: "Individual",
      ativo: true,
    },
  ])

  const handleToggleStatus = (plano: PlanoSaude) => {
    setPlanos(planos.map((p) => (p.id === plano.id ? { ...p, ativo: !p.ativo } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground">Planos de Saúde</h1>
          <p className="text-muted-foreground">Cadastro e gestão de planos de saúde</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Planos cadastrados</CardTitle>
            <CardDescription>Busque, visualize e altere o status dos planos de saúde.</CardDescription>
          </CardHeader>
          <CardContent>
            <CadastroTable
              data={planos}
              getId={(p) => p.id}
              getSearchText={(p) => `${p.codigo} ${p.nome} ${p.segmentacao} ${p.modalidade}`}
              isActive={(p) => p.ativo}
              searchPlaceholder="Buscar por código, nome, segmentação ou modalidade..."
              emptyMessage="Nenhum plano encontrado."
              columns={
                [
                  {
                    key: "codigo",
                    header: "Código",
                    sortable: true,
                    render: (p) => (
                      <Badge variant="outline" className="text-xs">
                        {p.codigo}
                      </Badge>
                    ),
                  },
                  { key: "nome", header: "Nome do plano", sortable: true, className: "font-medium text-foreground" },
                  { key: "segmentacao", header: "Segmentação", sortable: true },
                  { key: "modalidade", header: "Modalidade", sortable: true },
                ] as CadastroColumn<PlanoSaude>[]
              }
              onToggleStatus={handleToggleStatus}
              detailsTitle={(p) => p.nome}
              renderDetails={(p) => (
                <CadastroDetailsGrid>
                  <CadastroDetailField label="Código" value={p.codigo} />
                  <CadastroDetailField label="Nome do plano" value={p.nome} />
                  <CadastroDetailField label="Segmentação" value={p.segmentacao} />
                  <CadastroDetailField label="Modalidade" value={p.modalidade} />
                  <CadastroDetailField label="Status" value={p.ativo ? "Ativo" : "Inativo"} />
                </CadastroDetailsGrid>
              )}
            />
          </CardContent>
          </Card>
    </div>
  )
}
