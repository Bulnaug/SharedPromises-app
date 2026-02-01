const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-CA") // YYYY-MM-DD
}

export const today = (): string => {
  return formatDate(new Date())
}

export const getLastNDays = (days: number): string[] => {
  const result: string[] = []
  const base = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    result.push(formatDate(d))
  }

  return result
}
