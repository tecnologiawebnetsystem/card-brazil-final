export type AvatarGender = "masculino" | "feminino"

export interface AvatarOption {
  id: string
  label: string
  gender: AvatarGender
  src: string
}

export const AVATAR_OPTIONS: readonly AvatarOption[] = [
  { id: "masculino-1", label: "Avatar masculino 1", gender: "masculino", src: "/avatars/masculino-1.png" },
  { id: "masculino-2", label: "Avatar masculino 2", gender: "masculino", src: "/avatars/masculino-2.png" },
  { id: "masculino-3", label: "Avatar masculino 3", gender: "masculino", src: "/avatars/masculino-3.png" },
  { id: "masculino-4", label: "Avatar masculino 4", gender: "masculino", src: "/avatars/masculino-4.png" },
  { id: "feminino-1", label: "Avatar feminino 1", gender: "feminino", src: "/avatars/feminino-1.png" },
  { id: "feminino-2", label: "Avatar feminino 2", gender: "feminino", src: "/avatars/feminino-2.png" },
  { id: "feminino-3", label: "Avatar feminino 3", gender: "feminino", src: "/avatars/feminino-3.png" },
  { id: "feminino-4", label: "Avatar feminino 4", gender: "feminino", src: "/avatars/feminino-4.png" },
]

export function getAvatarOption(id?: string | null): AvatarOption | undefined {
  return AVATAR_OPTIONS.find((avatar) => avatar.id === id)
}
