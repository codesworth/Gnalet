"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
class AnalyticData {
    constructor(data) {
        this.unsolved = 0;
        this.pending = 0;
        this.solved = 0;
        this.flag = 0;
        this.duplicate = 0;
        console.log(`Initialized Analytic Data:`);
        if (data) {
            this.unsolved = typeof data.unsolved === "number" ? data.unsolved : 0;
            this.pending = typeof data.pending === "number" ? data.pending : 0;
            this.solved = typeof data.solved === "number" ? data.solved : 0;
            this.flag = typeof data.flag === "number" ? data.flag : 0;
            this.duplicate = typeof data.duplicate === "number" ? data.duplicate : 0;
        }
    }
    data() {
        return {
            unsolved: this.unsolved,
            pending: this.pending,
            solved: this.solved,
            flag: this.flag,
            duplicate: this.duplicate
        };
    }
    getStatusString(status) {
        switch (status) {
            case 0:
                return Constants_1.FIELD_UNSOLVED;
            case 1:
                return Constants_1.FIELD_PENDING;
            case 2:
                return Constants_1.FIELD_SOLVED;
            case 3:
                return Constants_1.FIELD_FLAGGED;
            case 4:
                return Constants_1.FIELD_DUPLICATE;
            default:
                return "";
        }
    }
    categoryChange(status) {
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
    updatedStatus(final, initial) {
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
exports.AnalyticData = AnalyticData;
//# sourceMappingURL=DataTrack.js.map