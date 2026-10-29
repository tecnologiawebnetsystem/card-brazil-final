import { SwaggerDocumentation } from "@/features/documentation/swagger-documentation"

export const metadata = {
  title: "Documentação da API | Card Brazil",
  description: "Documentação interativa dos endpoints da API Card Brazil.",
}

export default function SwaggerPage() {
  return <SwaggerDocumentation />
}
