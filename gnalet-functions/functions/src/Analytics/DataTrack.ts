import {
  FIELD_UNSOLVED,
  FIELD_PENDING,
  FIELD_FLAGGED,
  FIELD_SOLVED,
  FIELD_DUPLICATE
} from "../Constants";
export class AnalyticData {
  unsolved = 0;
  pending = 0;
  solved = 0;
  flag = 0;
  duplicate = 0;

  data() {
    return {
      unsolved: this.unsolved,
      pending: this.pending,
      solved: this.solved,
      flag: this.flag,
      duplicate: this.duplicate
    };
  }

  constructor(data?: any) {
    console.log(`Initialized Analytic Data:`);
    if (data) {
      this.unsolved = typeof data.unsolved === "number" ? data.unsolved : 0;
      this.pending = typeof data.pending === "number" ? data.pending : 0;
      this.solved = typeof data.solved === "number" ? data.solved : 0;
      this.flag = typeof data.flag === "number" ? data.flag : 0;
      this.duplicate = typeof data.duplicate === "number" ? data.duplicate : 0;
    }
  }

  getStatusString(status: number): string {
    switch (status) {
      case 0:
        return FIELD_UNSOLVED;
      case 1:
        return FIELD_PENDING;
      case 2:
        return FIELD_SOLVED;
      case 3:
        return FIELD_FLAGGED;
      case 4:
        return FIELD_DUPLICATE;
      default:
        return "";
    }
  }

  categoryChange(status: number) {
    switch (status) {
      case 0:
        this.unsolved--;
        break;
      case 1:
        this.pending--;
        break;
      case 2:
        this.solved--;
        break;
      case 3:
        this.flag--;
        break;
      case 4:
        this.duplicate--;
        break;
      default:
        break;
    }
  }

  updatedStatus(final: number, initial?: number) {
    if (initial !== null) {
      switch (initial) {
        case 0:
          this.unsolved--;
          break;
        case 1:
          this.pending--;
          break;
        case 2:
          this.solved--;
          break;
        case 3:
          this.flag--;
          break;
        case 4:
          this.duplicate--;
          break;
        default:
          break;
      }
    }

    switch (final) {
      case 0:
        this.unsolved++;
        break;
      case 1:
        this.pending++;
        break;
      case 2:
        this.solved++;
        break;
      case 3:
        this.flag++;
        break;
      case 4:
        this.duplicate++;
        break;
      default:
        break;
    }
  }
}
