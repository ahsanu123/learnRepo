export const CreateDiv = (id: string) => {
  const basicGrid = document.createElement("div")
  basicGrid.id = id
  document.body.appendChild(basicGrid)
}
