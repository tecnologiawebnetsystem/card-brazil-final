import { SwaggerDocumentation } from "@/features/documentation/swagger-documentation"

export const metadata = {
  title: "Documentação da API | CardBrazil",
  description: "Documentação interativa de todos os endpoints da API CardBrazil.",
}

export default function ApiDocs() {
  return <SwaggerDocumentation />
}
