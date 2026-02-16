export function randomState() {
  const states = ["Alabama", "Alaska", "Arizona", "Texas"];
  return states[Math.floor(Math.random() * states.length)];
}