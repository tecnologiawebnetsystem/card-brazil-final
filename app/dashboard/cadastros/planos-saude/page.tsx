export default function PlanosSaudePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Planos de Saúde</h1>
          <p className="text-muted-foreground">Cadastro e gestão de planos de saúde</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Novo Plano</h3>
            <p className="text-muted-foreground mb-4">Cadastrar novo plano de saúde</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Cadastrar Plano
            </button>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Consultar Planos</h3>
            <p className="text-muted-foreground mb-4">Buscar e editar planos existentes</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Consultar
            </button>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Relatórios</h3>
            <p className="text-muted-foreground mb-4">Relatórios de planos cadastrados</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Gerar Relatório
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Planos Cadastrados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Nome do Plano</th>
                  <th className="text-left p-2">Segmentação</th>
                  <th className="text-left p-2">Modalidade</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">001</td>
                  <td className="p-2">Plano Básico Ambulatorial</td>
                  <td className="p-2">Ambulatorial</td>
                  <td className="p-2">Individual</td>
                  <td className="p-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Ativo</span>
                  </td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline mr-2">Editar</button>
                    <button className="text-red-600 hover:underline">Inativar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
