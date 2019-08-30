export class AnalyticData {
  unsolved = 0;
  solved = 0;
  pending = 0;
  total = 0;

  constructor(data) {
    typeof data.unsolved === "number"
      ? (this.unsolved = data.unsolved)
      : (this.unsolved = 0);
    typeof data.pending === "number"
      ? (this.pending = data.pending)
      : (this.pending = 0);
    typeof data.solved === "number"
      ? (this.solved = data.solved)
      : (this.solved = 0);
    this.total = this.solved + this.unsolved + this.pending;
  }

  data = () => {
    return {
      unsolved: this.unsolved,
      pending: this.pending,
      solved: this.solved,
      total: this.total
    };
  };
}
